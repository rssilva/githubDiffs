let request = require('request');
let mongoose = require('mongoose');
let UserSchemaObj = require('./UserSchema');

let Schema = mongoose.Schema;
let UserSchema = new Schema(UserSchemaObj);

const USER_DELTA = 12;

function getByLogin (login, cb) {

  function onFind (err, result) {
    if (err) {
      return console.error(err);
    }

    const shouldUpdate = hasDataExpired(result);

    if (!result) {
      getByRequest(login, cb);
    }

    if (result && shouldUpdate) {
      getByRequest(login, cb);
    }

    if (result && !shouldUpdate) {
      cb(result);
    }
  }

  User.findOne({ login: login }, onFind);
};

function hasDataExpired (result) {
  result = result || {};
  const update = result._update;
  const now = new Date();
  let delta = (now - update)/(3600000);

  console.log('update time diff in hours ', delta)

  return delta > USER_DELTA;
};

function getByRequest (login, cb) {

  const options = {
    url: `https://api.github.com/users/${login}`,
    headers: {
      'User-Agent': 'diffs app'
    }
  }

  request(options, (error, response, body) => {
    console.log('requesting new data...');

    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      body._update = new Date();

      let user = new User(body);

      cb(user);

      user.save((err) => {
        console.log(err, 'Saved?')
      });
    }
  });
};

UserSchema.methods.getByLogin = getByLogin;

let User = mongoose.model('users', UserSchema);

module.exports = User;
