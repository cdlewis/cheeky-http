import Server from '../index';
import fetch from 'node-fetch';

test('create server with string response route', async () => {
    const server = new Server({'/': () => 'hello world'});
    const response = await fetch('http://localhost:3000');
    expect(await response.text(), 'hello world');
    await server.close();
});
