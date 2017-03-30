import createStore from '../src/createStore';
import combineReducers from '../src/combineReducers';

function todos (state: any[] = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text]);
    default:
      return state;
  }
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
describe('createStore test', () => {
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
});
