let Promise = require('promise');
let request = require('request');
let mongoose = require('mongoose');
let FollowersSchemaObj = require('../models/FollowersPageSchema');

let User = require('../models/UserModel');
let user = new User();

let Schema = mongoose.Schema;
let FollowersSchema = new Schema(FollowersSchemaObj);

function getByLogin (login, page=0) {

  let promise = new Promise( (resolve, reject) => {
    Followers.find({login: login})
        .exec( (err, result) => {
          console.log(result.length)
          result.length ? resolve(result) : getByRequest(login, page, resolve);
        });
  });

  return promise;
};

function getByRequest (login, page=0, resolve) {

  const options = {
    url: `https://api.github.com/users/${login}/followers?page=${page}`,
    headers: {
      'User-Agent': 'diffs app'
    }
  }

  function parseData (data) {
    let parsed = {
      followers: JSON.parse(data),
      '_update': new Date(),
      page: page,
      login: login
    };

    return parsed;
  };

  function onResponse (error, response, body) {
    console.log('requesting followers data...');
    // @ToDo handle API request limit
    if (!error && response.statusCode == 200) {
      let followersPage = parseData(body);

      resolve(followersPage);

      let followers = new Followers(followersPage);

      followers.save((err) => console.log(err, 'Saved!'));
    }
  }

  request(options, onResponse);
};

FollowersSchema.methods.getByLogin = getByLogin;

let Followers = mongoose.model('followers', FollowersSchema);

module.exports = Followers