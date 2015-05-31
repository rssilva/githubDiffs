let request = require('request');
let mongoose = require('mongoose');
let FollowersSchemaObj = require('../models/FollowersPageSchema');

let User = require('../models/UserModel');
let user = new User();

let Schema = mongoose.Schema;
let FollowersSchema = new Schema(FollowersSchemaObj);

function getByLogin (login, page=0, cb) {
  function onUserData (userData) {
    Followers.find({followed: userData.login}, function (err, result) {
      return result;
    }).exec(function (err, result) {

      if (result.length) {
        cb(result);
      }

      if (!result.length) {
        getByRequest(login, page, cb);
      }
    });
  }

  user.getByLogin(login).then((result) => {
    console.log('my result, from my promise', result.followed);
  })
};

function getByRequest (login, page=0, cb) {

  const options = {
    url: `https://api.github.com/users/${login}/followers?page=${page}`,
    headers: {
      'User-Agent': 'diffs app'
    }
  }

  function onResponse (error, response, body) {
    console.log('requesting followers data...');
    // @ToDo handle API request limit
    if (!error && response.statusCode == 200) {
      let followersPage = {
        followers: JSON.parse(body),
        '_update': new Date(),
        page: page,
        followed: login
      }

      cb(followersPage);

      let followers = new Followers(followersPage);

      followers.save((err) => console.log(err, 'Saved Assim, facil desse jeito?'));
    }
  }

  request(options, onResponse);
};

FollowersSchema.methods.getByLogin = getByLogin;

let Followers = mongoose.model('followers', FollowersSchema);

module.exports = Followers