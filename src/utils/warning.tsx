export default (messages) => {
  if (console && typeof console.error === 'function') {
    console.error(messages);
  }
  try {
    throw new Error(messages);
    /* tslint:disable-next-line: no-empty */
  } catch (e) {}
};
