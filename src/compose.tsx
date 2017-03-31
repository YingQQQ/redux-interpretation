export default (...funcs): Function => {
  if (funcs.length === 0) {
    return arg => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  // 解决深度套嵌
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
};
