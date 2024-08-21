const http = require('http');

const server = http.createServer((_, res) => {
  res.writeHead(404, {
    'Content-type': 'text/html',
  });
  res.end('<h1>Page not found!</h1>');
});

server.listen(8000, '127.0.0.1', () => {});
