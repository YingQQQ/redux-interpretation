export default ((...args) => {
  // next 大部分的时候传入dispatch
  return ({getState, dispatch}) => next => action => {
    if (typeof action === 'function') {
      return action(getState, dispatch, ...args);
    }
    return next(action);
  };
})();
