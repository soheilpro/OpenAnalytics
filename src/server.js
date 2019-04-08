const EventEmitter = require('events');
const http = require('http');

class Server extends EventEmitter {
  constructor(port) {
    super();

    this.port = port;
    this.server = http.createServer(this.handleRequest.bind(this));
  }

  handleRequest(request, response) {
    if (request.url === '/submit') {
      if (request.method !== 'POST')
        return this.send(response, 405, 'Method Not Allowed');

      const dateTime = new Date().toISOString();
      const ip = (request.headers && request.headers['x-forwarded-for']) || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
      const data = [];

      request.on('data', (chunk) => {
        data.push(chunk);
      });

      request.on('end', () => {
        this.emit('event', dateTime, ip, data);
        this.send(response, 200, 'OK');
      });

      return;
    }

    this.send(response, 404, 'Not Found');
  }

  send(response, code, description, headers, body) {
    response.writeHead(code, description, headers);
    response.end(body);
  }

  start() {
    this.server.listen(this.port);
    this.emit('start');
  }

  stop() {
    this.server.close();
  }
}

module.exports = Server;
