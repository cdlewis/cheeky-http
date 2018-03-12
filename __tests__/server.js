const Server = require("../server");
const fetch = require("node-fetch");

test("route with string response", async () => {
  const server = new Server({ "/": () => "hello world" });
  const response = await fetch("http://localhost:3000");
  expect(await response.text()).toEqual("hello world");
  await server.close();
});

test("route with named parameter", async () => {
  const server = new Server({ "/hello/:name": req => req.params.name });
  const response = await fetch("http://localhost:3000/hello/chris");
  expect(await response.text()).toEqual("chris");
  await server.close();
});

test("route with promise response", async () => {
  const server = new Server({ "/": () => Promise.resolve("hello") });
  const response = await fetch("http://localhost:3000");
  expect(await response.text()).toEqual("hello");
  await server.close();
});
