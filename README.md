# Simple HTTP

A simple, performant Node HTTP server.

## Getting started

```
import Server from 'simple-http'
new Server({/': () => 'hello world'})
```

## Features

### Route parameters

simple-http supports Express-style route parameters.

```
import Server from 'simple-http';
new Server({'/name': req => req.params.name});
```

### Automatically parse/serialise JSON in request/response

(TBD)

### Handle asynchronous handlers

If a handler returns a promise, simple-http will resolve it before responding.

```
import Server from 'simple-http';
new Server({'/': () => Promise.resolve('response')});
```

### Middleware

Route middleware can be added to the options object when creating a new server.
Unlike other Node HTTP frameworks, all middlewares are evaluated at once. The connection
will be terminated if a single middleware rejects its promise.

```
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

![middleware requests per second](https://raw.githubusercontent.com/cdlewis/simple-http/master/images/middleware-performance.png)
