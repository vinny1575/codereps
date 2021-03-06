var passport = require('passport');
var mongoose = require('mongoose');
var GithubStrategy = require('passport-github2').Strategy;
var User = require('../models/user');

exports = passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ oauthID: profile.id }, function(err, user) {
        if (err) {
          console.log(err);
        }

        if (!err && user !== null) {
          done(null, user);
        } else {
          var user = new User({
            oauthID: profile.id,
            username: profile.username,
            name: profile.displayName,
            email: profile._json.email
          });

          user.save(function(err, user) {
            if (err) {
              console.log(err);
            } else {
              console.log("Saving User...");
              done(null, user);
            }
          });
        }
      }); // end of User.findOne
    }
  ));
