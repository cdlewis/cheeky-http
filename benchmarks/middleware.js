const Server = require('../server')

const n = parseInt(process.env.MW || '1', 10)
console.log('  %s middleware', n)

function testMiddleware(request, response) {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

const middlewares = []
for (let i = 0; i < n; i++) {
  middlewares.push(testMiddleware)
}

new Server({'/': () => 'hi'}, {middlewares})
