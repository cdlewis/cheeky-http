import http from 'http';
import parseRequestBody from './lib/parse-request-body';
import resolveHandler from './lib/resolve-handler';
import setupRoutes from './lib/setup-routes';

export default class Server {
    async handleConnections(request, response) {
        let closed = false;
        response.on('end', () => {
            closed = true
            console.warn('response is closed');
        });

        const {method, url} = request;

        const requestProps = {
            params: {}
        };
        let handler = null;

        // Run all middlewares, a single rejection will terminate the request
        try {
            await Promise.all(
                this.middlewares.map(middleware => middleware(request, response))
            );
        } catch (err) {
            response.end();
            return;
        }

        // wait until request body has been parsed
        let body = null;
        if (method === 'POST' || method === 'PUT') {
            let body = await parseRequestBody(request);
        }
 
        for (const route of this.routes) {
            const search = url.match(route.pattern);
            if (search) {
                for (let i = 0; i < route.namedParams.length; i++) {
                    requestProps.params[route.namedParams[i]] = search[i + 1];
                }
                handler = route.handler;
                break;
            }
        }

        // Return 404 if there's no matching handler
        if (!handler) {
            response.statusCode = 404;
            response.statusMessage = 'Not found';
            response.end();
            return;
        }

        try {
            const result = await resolveHandler(handler(requestProps));

            if (typeof result === 'object') {
                response.writeHead(200, {
                    'content-type': 'application/json',
                });
                response.write(JSON.stringify(result));
            } else {
                response.write(result);
            }

            response.end();
        } catch (err) {
            console.error(`${method} ${url}: ${err}`)
            response.statusCode = 500;
            response.statusMessage = 'Internal server error';
            response.end();
            return;
        }
    }

    constructor(routes = {}, options = {}) {
        this.port = options.port || 3000
        this.middlewares = options.middlewares || [];
        this.routes = setupRoutes(routes);

        this.server = http
            .createServer(this.handleConnections.bind(this))
            .listen(this.port, () => {
                console.log(`Started server on http://localhost:${this.port}`);
            });
    }

    async close() {
        return new Promise((resolve) => this.server.close(resolve));
    }
}


const server = new Server(
    {
        '/': () => 'hello world'
    },
    {
        middlewares: [
            (request, response) => new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            })
        ]
    }
);

