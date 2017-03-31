export default ({ getState }) => next => action => {
  if (!getState()) {
    console.log('there is no init state');
  }
  const preState = getState();
  const returnedValue = next(action);
  const nextState = getState();
  const initKeys = Object.keys(preState);
  for (let i = 0; i < initKeys.length; i++) {
    const key = initKeys[i];
    if (preState[key] !== nextState[key]) {
      console.log(`state hasChanged: ${key}`);
    }
  }
  return returnedValue;
};
