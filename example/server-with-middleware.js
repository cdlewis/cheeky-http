const Server = require('../server')

const server = new Server(
  {
    '/': () => 'hello world',
  },
  {
    middlewares: [
      (request, response) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve()
          }, 2000)
        }),
    ],
  }
)
