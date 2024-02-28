const express = require('express');
const router = express.Router();
const Trip = require("../model/tripModel")


router.get("/new", (req,res) =>{
  res.render("trip/new")
})

router.post('/new', async (req, res, next) => {
  try {
    const trip = new Trip(req.body);
    trip.author = req.user._id
    await trip.save();

    res.redirect(`${trip._id}`);
  
  } catch (error) {
    req.flash("error", error.message)
    res.redirect("new")
  }
  
    });

    router.get("/:id", async (req,res) =>{
      const trip = await Trip.findById(req.params.id);
      res.render("trip/show", { trip });
    })


module.exports = router;
