require("babel-core").transform("code");

var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.start(function () {
  console.log('Server running at:', server.info.uri);
});

server.route({
  method: 'GET',
  path: '/',
  handler: {
    file: 'public/index.html'
  }
});

server.route({
  method: 'GET',
  path: '/public/{filename}',
  handler: {
    file: function (request) {
      return 'public/' + request.params.filename;
    }
  }
});
