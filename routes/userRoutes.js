const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require("../model/userModel");
const err = require('connect-flash');
const { isLoggedIn } = require("../middleware")
const Trip = require("../model/tripModel")


router.get("/signup", (req, res, next) =>{
  res.render("users/signup")
})

router.post('/signup', async (req, res, next) => {
  try {
    const { email, username, password} = req.body;
  const user = new User({ email, username});
  const registerdUser = await User.register(user, password);
  req.login(registerdUser, err => {
    if (err) return next(err);
  req.flash("success", "ようこそ")
  res.redirect(`${registerdUser._id}`)
  })
  
  } catch (error) {
    req.flash("error", error.message)
    res.redirect("signup")
  }
  
  
    });

    router.get("/login", (req, res) =>{
      res.render("users/login")
    })
   

    router.post('/login', passport.authenticate('local', { failureFlash: true,failureRedirect: 'login'} ),
    function(req, res) {
      res.redirect(`${req.user._id}`);
    }
   
    )

    router.get("/logout", (req,res) => {
      req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "ログアウトしました")
        res.redirect('login');
      });
    })



    router.get('/index',isLoggedIn, async (req, res) => {
      try{

      const users = await User.find();

      res.render("users/index", { users })
    
      
      } catch{

      }
    });

    router.get('/:id/share',isLoggedIn, async (req, res) => {
      try{
      const { id } = req.params;

      const user = await User.findById(id);
      const trips = await Trip.find({ shared: user._id })
    
      if(user){
        res.render('users/showShare', { user, trips });
      }
      else{
        req.flash("error", error.message)
        res.redirect("login")

      }
      
      } catch{

      }
  });

    

    

    router.get('/:id',isLoggedIn, async (req, res) => {
      try{
      const { id } = req.params;

      const user = await User.findById(id);
     
      const trips = await Trip.find({ author: user._id })
    
      if(user){
        res.render('users/show', { user, trips });
      }
      else{
        req.flash("error", error.message)
        res.redirect("login")

      }
      
      } catch{

      }
  });


module.exports = router;
