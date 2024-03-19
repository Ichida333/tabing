const express = require('express');
const router = express.Router();
const { isLoggedIn } = require("../middleware")
const Plan = require("../model/planModel")
const { cloudinary } = require("../cloudinary")





router.get("/:id/new", isLoggedIn,async(req,res) =>{
  const plan = await Plan.findById(req.params.id);
 
  

  res.render("plan/new", {plan})
})

router.post("/:id/update", isLoggedIn, async(req,res) =>{

  try {
  
    const { id } = req.params;
    const plan = await Plan.findByIdAndUpdate(id, { ...req.body });

    if(req.files)
    {
      const uploadedFiles = req.files.image;

    if(uploadedFiles[1])
    {
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
       
        plan.images.push(...uploadedImageUrls);
    }
    else
    {
    const result = await cloudinary.uploader.upload(uploadedFiles.tempFilePath);

    plan.images.push(result.url)
  }


    }

    


    await plan.save()
    console.log(plan)
    req.flash('success', '更新しました');
    res.redirect(`/trip/${plan.trip}/edit`);


    
  } catch (error) {
    console.error(error);
    req.flash("error", error.message)
    res.redirect(`/`)
  }
})

module.exports = router;
