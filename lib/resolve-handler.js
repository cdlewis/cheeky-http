module.exports = function resolveHandler(result) {
  if (typeof result === "string") {
    return Promise.resolve(result);
  } else if (result instanceof Promise) {
    return result.then(resolveHandler);
  } else if (result instanceof Object) {
    return Promise.resolve(result);
  } else {
    Promise.resolve(null);
  }
};
