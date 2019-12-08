var express = require('express');
var router = express.Router();
var path = require("path");
const multer = require('multer');
const passport = require('passport');
const adminDb = require('../models/adminDatabase')
const userDb = require('../models/userDatabase');
const makeAppiontment = require('../models/makeApp');

/* GET home page. */
var loggedin = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  }
  else{
    res.redirect('/login');
  }
}

router.get('/', function(req, res) {
  res.render('index', {user: req.user, isLoggedIn:req.isAuthenticated()});
});


router.get('/dashboard', loggedin, function(req, res) {
  var sorted = {createdDate: -1};
      makeAppiontment.find({}, function(err, appoint){
          if (err) return next(err);
            res.render('profile/dashboard', {appoint:appoint, user: req.user, isLoggedIn:req.isAuthenticated()});
          }).sort(sorted)
      });

router.post('/dashboard', function(req, res, next){

  userDb.findById(req.user.id, function (err, user) {
      if (!user) {
          res.send('No account Found');
      }
      var firstName = req.body.firstName;
      var lastName = req.body.lastName;
      var email = req.body.email;
      var phone = req.body.phone;
      var address = req.body.address;
      var gender = req.body.gender;
      var dob = req.body.dob;
      var state = req.body.state;
      var country = req.body.country;
      var lg = req.body.lg;
      var town = req.body.town;
      var occupation = req.body.occupation;
      var bloodGroup = req.body.bloodGroup;
      var genotype = req.body.genotype;
      var marital = req.body.marital;


      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.phone = phone;
      user.address = address;
      user.gender = gender;
      user.dob = dob;
      user.state = state;
      user.country = country;
      user.lg = lg;
      user.town = town;
      user.occupation = occupation;
      user.bloodGroup = bloodGroup;
      user.genotype = genotype;
      user.marital = marital;

      user.save(function (err) {
        req.flash('updateProfile', 'Your Profile was updated successfully')
          res.redirect('/dashboard');
      });
  });
});

router.get('/dashboard/make-an-appointment', loggedin, function(req, res) {
  res.render('profile/makeApp', {user: req.user, isLoggedIn:req.isAuthenticated()});
});

router.post('/dashboard/make-an-appointment', loggedin, function(req, res) {

  let doctor = {
    department: req.body.department,
    doctor: req.body.doctor,
    health: req.body.health,
    regNum: req.body.regNum,
  }
    let data = new makeAppiontment(doctor)
    data.save();
    req.flash('updateProfile', "Your information was sent successfuly");
    res.redirect('/dashboard/make-an-appointment');
});


router.get('/register', function(req, res) {
  res.render('profile/register', { title: 'Express' });
});

router.post('/register', passport.authenticate('register-user', {
  successRedirect: '/dashboard',
  failureRedirect: '/register',
  failureFlash: true
}))

router.get('/login', function(req, res) {
  res.render('profile/login', {user: req.user, isLoggedIn:req.isAuthenticated()});
});


router.post('/login', passport.authenticate('local-user', {
  failureRedirect: '/login',
  failureFlash: true
}), function(req, res, user){

      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || "/dashboard");
});





router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login')
});

module.exports = router;
