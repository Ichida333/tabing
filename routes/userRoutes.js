const express = require('express');

const router = express.Router();
const passport = require('passport');
const User = require("../model/userModel");
const e = require('connect-flash');
const { isLoggedIn } = require("../middleware")

router.get("/signup", (req, res, next) =>{
  res.render("users/signup")
})

router.post('/signup', async (req, res, next) => {
  try {
    const { email, username, password} = req.body;
  const user = new User({ email, username});
  const registerdUser = await User.register(user, password);
  console.log(registerdUser)
  req.flash("success", "ようこそ")
  res.redirect("login")
  
  } catch (error) {
    req.flash("error", error.message)
    res.redirect("signup")
  }
  
  
    });

    router.get("/login", (req, res) =>{
      res.render("users/login")
    })
   

    router.post('/login', passport.authenticate('local', { failureFlash: true,failureRedirect: 'login', successRedirect: '/' }, ))

    router.get("/logout", (req,res) => {
      req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "ログアウトしました")
        res.redirect('/');
      });
    })


module.exports = router;
