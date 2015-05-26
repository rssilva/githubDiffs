let Hapi = require('hapi');
let mongoose = require('mongoose');

let server = new Hapi.Server();

server.connection({ port: 3000 });

server.start( () => {
  console.log('Server running at:', server.info.uri);
});

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', onDbOpen);

mongoose.connect('mongodb://localhost/git_diffs');

function onDbOpen () {
  let Router = require('./routes/Router');
  Router.init(server);
}
