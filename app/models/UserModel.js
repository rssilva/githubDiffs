let Promise = require('promise');
let request = require('request');
let mongoose = require('mongoose');
let UserSchemaObj = require('./UserSchema');

let Schema = mongoose.Schema;
let UserSchema = new Schema(UserSchemaObj);

const USER_DELTA = 12;

function getByLogin (login) {

  function onFind (result, resolve) {

    const shouldUpdate = hasDataExpired(result);

    if (!result) {
      getByRequest(login).done( user => {
        user.save((err) => console.log(err, 'Saved?'));
        resolve(user);
      });
    }

    if (result && shouldUpdate) {
      getByRequest(login).done( user => {
        user.update({login: login}, (err) => console.log(err, 'Updated?'));
        resolve(user);
      });
    }

    return result;
  }

  let promise = new Promise( (resolve, reject) => {
    User.findOne({ login: login })
        .exec( (err, result) => {
          if (err) reject(err)
          result ? resolve(result) : onFind(result, resolve);
        });
  });

  return promise;
};

function hasDataExpired (result) {
  result = result || {};
  const update = result._update;
  const now = new Date();
  let delta = (now - update)/(3600000);

  console.log('update time diff in hours ', delta)

  return delta > USER_DELTA;
};

function getByRequest (login) {

  const options = {
    url: `https://api.github.com/users/${login}`,
    headers: {
      'User-Agent': 'diffs app'
    }
  }

  let onData = function (body) {
    body = JSON.parse(body);
    body._update = new Date();

    let user = new User(body);

    return user;
  }

  let promise = new Promise( (resolve, reject) => {
    // @ToDO: handle request errors

    request(options).on('response', (response) => {
      let allData = '';

      response.on('data', data => allData += data.toString());

      response.on('end', () => resolve(onData(allData)));
    });
  });

  return promise;
};

UserSchema.methods.getByLogin = getByLogin;

let User = mongoose.model('users', UserSchema);

module.exports = User;
