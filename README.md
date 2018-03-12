# Simple HTTP

A simple, performant Node HTTP server.

## Getting started

```js
import Server from 'simple-http'

new Server({/': () => 'hello world'})
```

## Features

Route parameters:

Automatically parse/serialise JSON in request/response:

Handle asyncronous handlers:

### Middleware

Route middleware can be added to the options object when creating a new server.
Unlike other Node HTTP frameworks, all middlewares are evaluated at once. The connection
will be terminated if a single middleware rejects its promise.

```js
import Server from 'simple-http';

const authMiddleware = (request, response) => new Promise((resolve, reject) => {
    if (!request.headers['token'] === 'fake-token') {
        response.writeStatus(401);
        reject();
    }

    resolve();
});

new Server(
    {'/': () => 'hello world'},
    {middlewares: [authMiddleware]}
)
```

## Benchmarks
