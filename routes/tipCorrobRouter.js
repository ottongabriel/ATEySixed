const express        = require('express');
const router         = express.Router();
const mongoose       = require('mongoose');
const User           = require("../models/user");
const Tip            = require("../models/tip");
const Corroboration  = require("../models/corroboration");

const ensureLogin    = require("connect-ensure-login");




// ADD NEW TIP
// IT AUTOMATICALLY CREATES A CORROBORATION THAT WILL HAVE THE SAME OWNER AS THE NEW TIP
router.post('/add-new-tip', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const item = req.body.item;
  const the_id = req.body.the_id;
  let owner_id;

  //if a user is logged in
  if(req.user){
    //save their id
    owner_id = req.user._id;
  }
  // otherwise
  else{
    // keep it blank
    owner_id = "";
  }

  // if no item was entered in the field
  if (item === "") {
    // don't go any further
    return;
  }

  // build the new tip with the data passed in
  const newTip = new Tip({
    item: item,
    restaurant_id: the_id,
    owner_id: owner_id,
    });

  // and save it
  newTip.save( (err) => {
    if (err) {
      res.render("restaurant", { message: "Something went wrong adding your tip" });
    } 
    // if it was saved succesfully
    else {
      // prepare a ne corroboration for the new tip
      const newCorroboration = new Corroboration({
        corroborated: true,
        tip_id: newTip._id,
        owner_id: newTip.owner_id,
      })

      // and save it
      newCorroboration.save((err) => {
        if (err) {
          res.render("restaurant", { message: "Something went wrong adding the CORROBORATION for your tip" });
        }
        else{
          // with both the tip and the corroboration saved, refresh the page to display the latest information
          res.redirect('back');
        }
      })
    }
  });
});// END ADD-NEW-TIP



// DELET TIP BY ID
router.post('/delete-tip/:id', (req, res, next) => {

  const theTipId = req.params.id;

  Tip.findByIdAndRemove(theTipId)
    .then(theTip=>{
      // remove all the corroborations associated with that tip
      Corroboration.remove({tip_id: theTipId})
      .then(theCorrob =>{
        // refresh the page to show that the tip was indeed deleted
        res.redirect('back');
      })
      .catch(err=>{
        console.log('err: ', err);
        next(err);
      })
    })
    .catch(err=>{
      console.log('err: ', err);
      next(err);
    })
});//END DELETE TIP BY ID


// CREATE OR UPDATE CORROBORATION BASED ON TIP ID
// IF THERE IS NO CORROBORATION RELATIONSHIP ALREADY, CREATE IT
// OTHERWISE UPDATE IT.
router.post('/corroboration/:tip_id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  
  const tipId = req.params.tip_id;
  const ownerId = req.user._id;
  
  // Find the first corroboration that matcheds the id of the tip being looked at and has the same owner as the user currently logged in
  Corroboration.findOne(
    { 
      $and: [ 
        { tip_id: tipId }, 
        { owner_id: ownerId } 
      ] 
    }
  )
  .then(theCorroboration =>{

    // the corroboratio relationship already exists
    if (theCorroboration !== null) {

      // swap the value in the database
      theCorroboration.corroborated = !theCorroboration.corroborated;

      // and save the change
      theCorroboration.save((error) => {
        if (error) {
          res.redirect("back", { message: "the tip exists, but there was an issue updating it" });
        }
        else{
          // send response to indicate to the caller that the call was succesful
          res.send()
        }
      })
      return;
    }
    // then it doesnt exist and it needs to be created
    else{
      // create the corroboration
      const newCorroboration = new Corroboration({
        corroborated: true,
        tip_id: tipId,
        owner_id: ownerId,
      });
  
      // and save it
      newCorroboration.save((error) => {
        if (error) {
          res.redirect("back", { message: "Something went wrong adding the CORROBORATION for that tip" });
        }
        else{
          // send response to indicate to the caller that the call was succesful
          res.send()
        }
      })
      return
    }
  })
  .catch(err=>{
    console.log("there was an issue");
  })
});//END CREATE/UPDATE CORROBORATION



// GET ALL CORROBORATIONS ASSOCIATED WITH A TIP ID
router.get('/get-corroborations/:tipId', (req, res, next) => {

  Corroboration.find({tip_id: req.params.tipId})
  .then(theList=>{
    res.json(theList)
  })
  .catch(err=>console.log(err))

});



module.exports = router;
