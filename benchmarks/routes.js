const Server = require('../server')

const n = parseInt(process.env.MW || '1', 10)
console.log('  %s route', n)

const routes = {}
for (let i = 0; i < n - 1; i++) {
  routes[`/${i}`] = () => 'hello'
}
routes['/'] = () => 'world'

new Server(routes)
