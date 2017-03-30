import isPlainObject from './utils/isPlainObject';
import { ActionTypes } from './createStore';

/**
 * 异常处理，阅读前可以先跳过
 * @param key
 * @param action
 * @return {*}
 */
interface TypeConfig {
  type: string;
  [propName: string]: string;
}

function getUndefinedStateErrorMessage (key: string, action?: TypeConfig) {
  const actionType = action && action.type;
  const actionName = (actionType && `"${actionType.toString()}"`) || 'an action';

  return (
   `Given action ${actionName}, reducer "${key}" returned undefined. ` +
   `To ignore an action, you must explicitly return the previous state. ` +
   `If you want this reducer to hold no value, you can return null instead of undefined.`
  );
}

function getUnexpectedStateShapeWarningMessage (inputState, reducers, action: TypeConfig, unexpectedKeyCache): string|undefined {
  const reducerKeys: string[] = Object.keys(reducers);
  const argumentName: string = action && action.type === ActionTypes.INIT ?
    'preloadedState argument passed to createStore' :
    'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return (
      'Store does not have a valid reducer. Make sure the argument passed ' +
      'to combineReducers is an object whose values are reducers.'
    );
  }

  if (!isPlainObject(inputState)) {
    return (
      `The ${argumentName} has unexpected type of "` +
      ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] +
      `". Expected argument to be an object with the following ` +
      `keys: "${reducerKeys.join('", "')}"`
    );
  }

  const unexpectedKeys = Object.keys(inputState).filter(key =>
    !reducers.hasOwnProperty(key) &&
    !unexpectedKeyCache[key]
  );

  unexpectedKeys.forEach(key => {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return (
      `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
      `"${unexpectedKeys.join('", "')}" found in ${argumentName}. ` +
      `Expected to find one of the known reducer keys instead: ` +
      `"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`
    );
  }
}

function assertReducerSanity (reducers) {
  Object.keys(reducers).forEach(key => {
    const reducer = reducers[key];
    const initialState = reducer(undefined, { type: ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined during initialization. ` +
        `If the state passed to the reducer is undefined, you must ` +
        `explicitly return the initial state. The initial state may ` +
        `not be undefined. If you don't want to set a value for this reducer, ` +
        `you can use null instead of undefined.`
      );
    }

    const type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type }) === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined when probed with a random type. ` +
        `Don't try to handle ${ActionTypes.INIT} or other actions in "redux/*" ` +
        `namespace. They are considered private. Instead, you must return the ` +
        `current state for any unknown actions, unless it is undefined, ` +
        `in which case you must return the initial state, regardless of the ` +
        `action type. The initial state may not be undefined, but can be null.`
      );
    }
  });
}

export interface ReducerTypes {
  [propName: string]: Function;
}
/**
 * 把reducer函数对象整合为单一reducer函数，它会遍历所有的子reducer成员，并把结果整合进单一状态树
 * 这个状态树对象的key值和函数名保持一致
 *
 * 参数即为reducers对象
 *
 * 返回的函数在执行的时候，会遍历reducers返回结果
 *
 */
export default function combineReducers (reducers: ReducerTypes) {
  const reducerKeys: string[] = Object.keys(reducers);
  const finalReducers = {};
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        // warning(`No reducer provided for key "${key}"`);
      }
    }
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  const finalReducersKeys = Object.keys(finalReducers);

  let unexpectedKeyCache;
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {};
  }
  let sanityError;
  try {
    // 检查每个reducer
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }
  return function combination (state = {}, action) {
    if (sanityError) {
      throw sanityError;
    }
    // dev开发中的错误处理
    if (process.env.NODE_ENV !== 'production') {
      const warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        // warning(warningMessage);
      }
    }
    const nextState = {};
    let hasChanged = false;

    for (let i = 0; i < finalReducersKeys.length; i++) {
      const key = finalReducersKeys[i];
      const reducer: Function = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}