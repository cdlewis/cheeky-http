module.exports = function parseRequestBody(request) {
  return new Promise(resolve => {
    const body = [];
    request.on("data", chunk => body.push(chunk));
    request.on("end", () => {
      const result = body.join("");
      if (request.headers["content-type"] === "application/json") {
        resolve(JSON.stringify(result));
      } else {
        resolve(result);
      }
    });
  });
};
