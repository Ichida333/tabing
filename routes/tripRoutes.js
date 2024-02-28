const express = require('express');
const router = express.Router();
const Trip = require("../model/tripModel")
const Plan = require("../model/planModel")
const { isLoggedIn } = require("../middleware")
const multer = require('multer')
const { storage } = require('../cloudinary/index');
const upload = multer({ storage : storage})


router.get("/new", isLoggedIn,(req,res) =>{
  res.render("trip/new")
})

router.post('/new', isLoggedIn,async (req, res, next) => {
  try {
    const trip = new Trip(req.body);
    trip.author = req.user._id
    await trip.save();

    res.redirect(`${trip._id}`);
  
  } catch (error) {
    req.flash("error", error.message)
    res.redirect("/")
  }
  
    });
    router.post("/:id/plan/new", upload.array('image'),isLoggedIn , async(req,res, next) =>{
      try {
    
        const plan = new Plan(req.body)
        const trip = await Trip.findById(req.params.id);
      plan.trip = trip._id
      await plan.save()
      res.redirect(`/trip/${trip._id}/edit`)
      } catch (error) {
        req.flash("error", error.message)
        res.redirect(`/`)
      }
      
    })


    router.get("/:id/edit",isLoggedIn ,async (req,res) =>{
      const trip = await Trip.findById(req.params.id);
      const plans = await Plan.find({ trip: trip._id })
   
      res.render("trip/edit", { trip, plans });
    })

    router.get("/:id",isLoggedIn ,async (req,res) =>{
      const trip = await Trip.findById(req.params.id);
      const plans = await Plan.find({ trip: trip._id })
      res.render("trip/show", { trip , plans});
    })


module.exports = router;
