# Cheeky HTTP

A simple, performant Node HTTP server.

## Getting started

```js
import Server from 'cheeky-http'
new Server({'/': () => 'hello world'})
```

## Features

### Route parameters

cheeky-http supports Express-style route parameters.

```js
import Server from 'cheeky-http'
new Server({'/name': req => req.params.name})
```

### Automatically parse/serialise JSON in request/response

The request payload is automtically parsed when the content header is JSON. When a handler
returns an object, it is automatically serialised.

```js
const Server = require('cheeky-http')
new Server({'/': req => req.body})
```

### Handle asynchronous handlers

If a handler returns a promise, cheeky-http will resolve it before responding.

```js
import Server from 'cheeky-http'
new Server({'/': () => Promise.resolve('response')})
```

### Middleware

Route middleware can be added to the options object when creating a new server.
Unlike other Node HTTP frameworks, all middlewares are evaluated at once. The connection
will be terminated if a single middleware rejects its promise.

```js
import Server from 'cheeky-http'

const authMiddleware = (request, response) =>
  new Promise((resolve, reject) => {
    if (!request.headers['token'] === 'fake-token') {
      response.writeStatus(401)
      reject()
    }

    resolve()
  })

new Server({'/': () => 'hello world'}, {middlewares: [authMiddleware]})
```

## Benchmarks

![middleware requests per second](https://raw.githubusercontent.com/cdlewis/cheeky-http/master/images/middleware-performance.png)
