import createStore from '../src/createStore';
import combineReducers from '../src/combineReducers';
import compose from '../src/compose';
import applyMiddleware from '../src/applyMiddleware';
import bindActionCreators from '../src/bindActionCreators';
import logger from '../src/utils/logger';
import thunkMiddle from '../src/utils/thunkMiddle';

function todos (state: any[] = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text]);
    default:
      return state;
  }
}
function addTodo<T> (add): T {
  return add;
}

function counter (state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}
function test (spyOnMethods) {
  return methods => {
    spyOnMethods(methods);
    return next => action => next(action);
  };
}

function newTodo (text) {
  return {
    type: 'ADD_TODO',
    text
  };
};

function dispatchInMiddle (boundDispatchFn) {
  return {
    type: 'DISPATCH_IN_MIDDLE',
    boundDispatchFn
  };
}

describe('TypeRedux easy test', () => {
  let actionCreatorFunctions;
  beforeEach(() => {
    // 在本区块的每个测试用例之前执行
    actionCreatorFunctions = {
      newTodo,
      dispatchInMiddle
    };
    Object.keys(actionCreatorFunctions).forEach((key: string) => {
      if (typeof actionCreatorFunctions[key] !== 'function') {
        delete actionCreatorFunctions[key];
      }
    });
  });

  it('it should return something in array', () => {
    const store = createStore(todos, ['Use Redux']);
    store.dispatch({
      type: 'ADD_TODO',
      text: 'Read the docs'
    });
    expect(store.getState())
      .toEqual(expect.arrayContaining(['Use Redux', 'Read the docs']));
  });

  it('if no initState will return empty array', () => {
    const store = createStore(todos);
    expect(store.getState()).toEqual([]);
  });

  it('combineReducers test', () => {
    const combine = combineReducers({
      todos,
      counter
    });
    const store = createStore(combine);
    expect(store.getState()).toEqual({
      todos: [],
      counter: 0
    });
    store.dispatch({
      type: 'ADD_TODO',
      text: 'Use Redux'
    });
    expect(store.getState()).toEqual({
      todos: ['Use Redux'],
      counter: 0
    });
  });

  it('compose test, it should return equal value', () => {
    const double = x => x * 2;
    const square = x => x * x;
    const a = next => x => next(`${x}a`);
    const b = next => x => next(`${x}b`);
    const c = next => x => next(`${x}c`);
    const final = x => x;

    expect(compose(a, b, c)(final)('d')).toBe('dabc');
    expect(compose(b, c, a)(final)('d')).toBe('dbca');
    expect(compose(c, a, c)(final)('d')).toBe('dcac');
    expect(compose(square)(5)).toBe(25);
    expect(compose(square)(5)).toBe(25);
    expect(compose(square, double, double)(5)).toBe(400);
  });

  it('applyMiddleware test', () => {
    const myMock = jest.fn();
    const store = applyMiddleware(test(myMock), logger, thunkMiddle)(createStore)(todos);

    store.dispatch(addTodo({
      type: 'ADD_TODO',
      text: 'TypeRedux'
    }));
    expect(myMock.mock.calls.length).toEqual(1);
    expect(myMock.mock.calls[0][0]).toHaveProperty('getState');
    expect(myMock.mock.calls[0][0]).toHaveProperty('dispatch');
    expect(store.getState()).toEqual(['TypeRedux']);
  });

  it('bindActionCreators test', () => {
    const _console = console;
    global.console = { error : jest.fn() };
    const store = createStore(todos);
    const boundActionCreators = bindActionCreators({
      newTodo,
      dispatchInMiddle,
      foo: 42,
      bar: 'baz',
      wow: undefined,
      much: {},
      test: null
    }, store.dispatch);
    expect(
      Object.keys(boundActionCreators)
    ).toEqual(
      Object.keys(actionCreatorFunctions)
    );
    expect(console.error.mock.calls.length).toBe(5);
    global.console = _console;
  });
});
