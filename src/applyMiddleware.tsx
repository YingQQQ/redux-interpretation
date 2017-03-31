import compose from './compose';

export default (...middlewares): Function => {
  return (createStore) => (reducer: Function, preloadedState?: any, enhancer?: Function) => {
    const store = createStore(reducer, preloadedState, enhancer);
    let dispatch: Function = store.dispatch;

    const middlewaresApi = {
      getState: store.getState,
      dispatch: action => dispatch(action)
    };
    const chain: Function[] = middlewares.map(middleware => middleware(middlewaresApi));
    dispatch = compose(...chain)(store.dispatch);
    return {
      dispatch,
      ...store
    };
  };
};
