const express = require('express');

const router = express.Router();
const passport = require('passport');
const User = require("../model/userModel")

router.get("/signup", (req, res, next) =>{
  res.render("users/signup")
})

router.post('/signup', async (req, res, next) => {
  const { email, username, password} = req.body;
  const user = new User({ email, username});
  const registerdUser = await User.register(user, password);
  console.log(registerdUser)
  req.flash("success", "ようこそ")
  res.redirect("login")
  
  
    });


    router.post('/login', passport.authenticate('local', { failureRedirect: 'login-failure', successRedirect: 'login-success' }));



    router.get("/login", (req, res) =>{
      res.render("users/login")
    })
   
    router.get('/login-success', (req, res, next) => {
      res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
  });
  
  router.get('/login-failure', (req, res, next) => {
      res.send('You entered the wrong password.');
  });




module.exports = router;
