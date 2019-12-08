const userDb = require('../models/userDatabase');
const adminDatabase = require('../models/adminDatabase');
const LocalStrategy = require('passport-local').Strategy;


function SessionConstructor(userId, userGroup, details) {
  this.userId = userId;
  this.userGroup = userGroup;
  this.details = details;
}

module.exports = function(passport) {

  passport.serializeUser(function (userObject, done) {
    // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
    let userGroup = "model1";
    let userPrototype =  Object.getPrototypeOf(userObject);

    if (userPrototype === userDb.prototype) {
      userGroup = "model1";
    } else if (userPrototype === adminDatabase.prototype) {
      userGroup = "model2";
    }

    let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
    done(null,sessionConstructor);
  });

  passport.deserializeUser(function (sessionConstructor, done) {

    if (sessionConstructor.userGroup == 'model1') {
      userDb.findOne({
          _id: sessionConstructor.userId
      }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
          done(err, user);
      });
    } else if (sessionConstructor.userGroup == 'model2') {
      adminDatabase.findOne({
          _id: sessionConstructor.userId
      }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
          done(err, user);
      });
    }

  });

  passport.use('register-user',
  new LocalStrategy({
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
  },
  function (req, email, password, done) {
      userDb.findOne({email: email})
          .catch((err) => {
                  req.flash('error', 'Error occured, try again!');
                  return done(err);
          })
          .then((user) => {
              if (user) {
                  req.flash('error', 'Email already exists, login instead');
                  return done(null, false);
              }
              let guestUser = new userDb();
              guestUser.firstName = req.body.firstName;
              guestUser.lastName = req.body.lastName;
              guestUser.email = req.body.email;
              guestUser.phone = req.body.phone;
              guestUser.password = guestUser.hashPassword(password);

              guestUser.is_super = true;

              guestUser.save()
              .catch((err) => {
                  return done(err)
              })
              .then(() => {
                  return done(null, guestUser)
              })
          })
  }
));

passport.use('local-user',
  new LocalStrategy({
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
  },
  function (req, email, password, done) {
      userDb.findOne({email: email})
          .catch((err) => {
              return done(err);
          })
          .then((user) => {
              if (!user) {
                  req.flash('error', "Invalid Username, try again!")
                  return done(null, false)
              }
              if (!user.comparePassword(password, user.password)) {
                  req.flash('error', "Invalid Password, try again!")
                  return done(null, false)
              }
              return done(null, user);
          })
  })
);


passport.use('registerAdmin-two',
    new LocalStrategy({
        usernameField: "adminEmail",
        passwordField: "adminPassword",
        passReqToCallback: true
    },
    function (req, adminEmail, adminPassword, done) {

        adminDatabase.findOne({adminEmail: adminEmail})
            .catch((err) => {
                    req.flash('error', 'Error occured, try again!');
                    return done(err);
            })
            .then((user) => {
                if (user) {
                    req.flash('error', 'Email already exists, login instead');
                    return done(null, false);
                }
                let guestUser = new adminDatabase();
                guestUser.adminFirstName = req.body.adminFirstName;
                guestUser.adminLastName = req.body.adminLastName;
                guestUser.adminEmail = req.body.adminEmail;
                guestUser.adminPhone = req.body.adminPhone;
                guestUser.adminPassword = guestUser.hashPassword(adminPassword);

                guestUser.is_super = true;

                guestUser.save()
                .catch((err) => {
                    return done(err)
                })
                .then(() => {
                    return done(null, guestUser)
                })
            })
    }
));

passport.use('local-admin',
    new LocalStrategy({
        usernameField: "adminEmail",
        passwordField: "adminPassword",
        passReqToCallback: true
    },
    function (req, adminEmail, adminPassword, done) {
        adminDatabase.findOne({adminEmail: adminEmail})
            .catch((err) => {
                return done(err);
            })
            .then((user) => {
                if (!user) {
                    req.flash('error', "Invalid Username, try again!")
                    return done(null, false)
                }
                if (!user.comparePassword(adminPassword, user.adminPassword)) {
                    req.flash('error', "Invalid Password, try again!")
                    return done(null, false)
                }
                return done(null, user);
            })
    })
);


}


