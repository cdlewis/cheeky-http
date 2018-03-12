# Cheeky HTTP [![Build Status](https://travis-ci.org/cdlewis/cheeky-http.svg?branch=master)](https://travis-ci.org/cdlewis/cheeky-http)

A simple, performant Node HTTP server.

## Getting started

```js
const Server = require('cheeky-http')
new Server({'/': () => 'hello world'})
```

## Features

### Route parameters

```js
const Server = require('cheeky-http')
new Server({'/person/:name': req => `Hello ${req.params.name}!`)
```

### Automatically parse/serialise JSON in request/response

The request payload is automtically parsed when the content header is JSON. When a handler
returns an object, it is automatically serialised.

```js
const Server = require('cheeky-http')
new Server({'/': req => req.body})
```

### Handle asynchronous handlers

If a handler returns a promise, it's resolved value will become the response.

```js
const Server = require('cheeky-http')
new Server({'/': () => Promise.resolve('response')})
```

### Middleware

When creating a new server you can pass in an array of middleware functions.
Middleware has access to the underlying HTTP request and response objects and
runs before the route handler.  

Unlike other frameworks such as Express, all middlewares are evaluated at once.
The connection will be terminated if a single middleware rejects its promise.
This allows for better performance but also breaks patterns that rely on sequentially
evaluating middleware and passing around state on the request object. Because
there's no guaranteed execution order, middleware should be idempotent.

```js
const Server = require('cheeky-http')

const authMiddleware = (request, response) =>
  new Promise((resolve, reject) => {
    if (!request.headers['token'] === 'fake-token') {
      response.statusCode = 401
      reject()
    } else {
      resolve()
    }
  })

new Server({'/': () => 'hello world'}, {middlewares: [authMiddleware]})
```

## Benchmarks

![middleware requests per second](https://raw.githubusercontent.com/cdlewis/cheeky-http/master/images/middleware-performance.png)
