let request = require('request');
let mongoose = require('mongoose');
let UserSchemaObj = require('./UserSchema');
let Schema = mongoose.Schema;

let UserSchema = new Schema(UserSchemaObj);

function getByLogin (login) {
  User.find({ login: login }, (err, result) => {
    if (err) return console.error(err);

    result.length ? null : getByRequest(login);
  });
};

function getByRequest (login) {

  let options = {
    url: `https://api.github.com/users/${login}`,
    headers: {
      'User-Agent': 'diffs app'
    }
  }

  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);

      let user = new User(body);

      user.save((err) => {
        console.log(err, 'Saved?')
      });
    }
  });
};

UserSchema.methods.getByLogin = getByLogin;

let User = mongoose.model('users', UserSchema);

module.exports = User;
