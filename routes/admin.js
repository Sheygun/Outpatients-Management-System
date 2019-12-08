var express = require('express');
var router = express.Router();
var path = require("path");
const multer = require('multer');
const passport = require('passport');
const adminDb = require('../models/adminDatabase');
const userDb = require('../models/userDatabase');
/* GET users listing. */
var loggedin = function(req, res, next){
    if(req.isAuthenticated()){
      next();
    }
    else{
      res.redirect('/Admin/login');
    }
  }


  router.get('/dashboard', loggedin, function(req, res) {
      res.render('admin/admin', {user: req.user, isLoggedIn:req.isAuthenticated() });
  });


router.get('/register', function(req, res) {
    res.render('admin/adminRegister', { title: 'Express' });
});
router.post('/register', passport.authenticate('registerAdmin-two', {
    successRedirect: '/Admin/dashboard',
    failureRedirect: '/Admin/register',
    failureFlash: true
  }))

router.get('/login', function(req, res) {
    res.render('admin/adminLogin',  {user: req.user, isLoggedIn:req.isAuthenticated()});
});

router.post('/login', passport.authenticate('local-admin', {
    failureRedirect: '/Admin/login',
    failureFlash: true
    }), function(req, res, user){

        const returnTo = req.session.returnTo;
        delete req.session.returnTo;
        res.redirect(returnTo || "/Admin/dashboard");
});



router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/Admin/login')
  });

module.exports = router;
