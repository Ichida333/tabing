const express = require('express');
const router = express.Router();
const Trip = require("../model/tripModel")
const Plan = require("../model/planModel")
const User = require("../model/userModel")
const { isLoggedIn } = require("../middleware")

const fileUpload = require("express-fileupload");
const { cloudinary } = require("../cloudinary")


router.get("/new", isLoggedIn,(req,res) =>{
  res.render("trip/new")
})

router.post('/new', isLoggedIn,async (req, res, next) => {
  try {
    const trip = new Trip(req.body);
    //エラーの作らなあかん
    const sharedName = req.body.shared
    console.log(sharedName)
    trip.shared = await User.findOne({ username : sharedName })
    console.log(trip.shared)

    trip.author = req.user._id
    console.log(req.body)
    await trip.save();

    res.redirect(`/trip/${trip._id}/edit`);
  
  } catch (error) {
    req.flash("error", error.message)
    res.redirect("/")
  }
  
    });
    router.post("/:id/plan/new",isLoggedIn , async(req,res, next) =>{
      try {    
        const plan = new Plan(req.body)
        const trip = await Trip.findById(req.params.id);
        plan.trip = trip._id
       

        if(req.files){
          const uploadedFiles = req.files.image;
          console.log(uploadedFiles)

        if(uploadedFiles[1])
          {
            console.log(uploadedFiles)
                    // アップロードされた各ファイルをCloudinaryにアップロード
              const uploadPromises = uploadedFiles.map((file) => {
                return new Promise((resolve, reject) => {
                  cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(result.secure_url);
                    }
                  });
                });
              });

              const uploadedImageUrls = await Promise.all(uploadPromises);
              // console.log(uploadedImageUrls)
              for (let i = 0; i < uploadedImageUrls.length; i++) {
                plan.images[i] = uploadedImageUrls[i]              
              }
          }
        else
        {
          console.log(uploadedFiles)
        const result = await cloudinary.uploader.upload(uploadedFiles.tempFilePath);
   
         console.log(result)
        plan.images[0] = result.url
        }

        }

        
    
     
      

     

      await plan.save()
      // console.log(plan)
      req.flash('success', '作成しました');
      res.redirect(`/trip/${trip._id}/edit`)
      } catch (error) {
        console.error(error);
        req.flash("error", error.message)
        res.redirect(`/`)
      }
      
    })






  

  router.delete("/:id/plan/delete/:planID" , async(req,res)=>{
    try {
  
 
      const id = req.params.planID
      const trip = await Trip.findById(req.params.id);
      await Plan.findByIdAndDelete(id)
      req.flash('success', '削除しました');
      res.redirect(`/trip/${trip._id}/edit`)
    } catch (error) {
      console.error(error);
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
      const userId = trip.author
      const sharedId = trip.shared
      const user = await User.findById(userId)
      const sharedUser = await User.findById(sharedId)
      res.render("trip/show", { trip , plans,user, sharedUser});
    })


module.exports = router;
