const Server = require('../server')
const fetch = require('node-fetch')

const logger = {
  log: () => {},
  warn: console.warn,
  error: console.error,
}

test('route with string response', async () => {
  const server = new Server({'/': () => 'hello world'}, {logger})
  const response = await fetch('http://localhost:3000')
  expect(await response.text()).toEqual('hello world')
  await server.close()
})

test('route with named parameter', async () => {
  const server = new Server({'/hello/:name': req => req.params.name}, {logger})
  const response = await fetch('http://localhost:3000/hello/chris')
  expect(await response.text()).toEqual('chris')
  await server.close()
})

test('route with promise response', async () => {
  const server = new Server({'/': () => Promise.resolve('hello')}, {logger})
  const response = await fetch('http://localhost:3000')
  expect(await response.text()).toEqual('hello')
  await server.close()
})

test('route with parsed request body', async () => {
  const testBody = {isTest: true}
  const server = new Server({'/': req => req.body}, {logger})

  const response = await fetch('http://localhost:3000', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(testBody),
  })

  expect(await response.json()).toEqual(testBody)

  await server.close()
})
