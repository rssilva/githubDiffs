let userRoutes = require('./UserRoutes');
let followersRoutes = require('./FollowersRoutes');

let Router = {
  init(server) {
    this.setBasic(server);

    this.userRoutes = userRoutes;
    this.userRoutes.init(server);

    this.followersRoutes = followersRoutes;
    this.followersRoutes.init(server);
  },

  setBasic(server) {
    let fs = require('fs');

    server.route({
      method: 'GET',
      path: '/',
      handler: {
        file: 'public/index.html'
      }
    });

    server.route({
      method: 'GET',
      path: '/public/{filename*}',
      handler: {
        file: function (request) {
          return 'public/' + request.params.filename;
        }
      }
    });
  }
}

module.exports = Router;
