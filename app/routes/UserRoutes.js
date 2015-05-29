let User = require('../models/UserModel');
let userModel = new User();

let UserRoutes = {
  init(server) {

    server.route({
      method: 'GET',
      path: '/users/{login}',
      handler:function (request, reply) {
        const login = request.params.login;

        userModel.getByLogin(login)
            .catch(e => console.log('treta', e))
            .done(reply)
      }
    });

  }
}

module.exports = UserRoutes;
