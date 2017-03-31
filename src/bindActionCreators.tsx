import warning from './utils/warning';

const hasOwnProperty = {}.hasOwnProperty;

const bindActionCreator: Function = (actionCreator, dispatch) => (...args) => dispatch(actionCreator(...args));

export default (actionCreators, dispatch) => {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }
  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('please check your actionCreators type');
  }

  const boundActionCreators = {};
  for (let key in actionCreators) {
    const actionCreator = actionCreators[key];
    if (hasOwnProperty.call(actionCreators, key) && typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    } else {
      warning(`bindActionCreators expected a function actionCreator for key '${key}', instead received type '${typeof actionCreator}'.`);
    }
  }
  return boundActionCreators;
};
