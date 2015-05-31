let Followers = require('../collections/FollowersCollection');
let followers = new Followers();

let FollowersRoutes = {
  init(server) {

    server.route({
      method: 'GET',
      path: '/users/{login}/followers',
      handler:function (request, reply) {
        const login = request.params.login;
        const page = request.params.page;

        followers.getByLogin(login, page).done(reply);
      }
    });

  }
}

module.exports = FollowersRoutes;
