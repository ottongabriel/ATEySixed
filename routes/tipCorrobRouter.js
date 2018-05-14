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
    // don't save anything
    owner_id = "";
  }
  if (item === "") {
    return;
  }

  const newTip = new Tip({
    item: item,
    restaurant_id: the_id,
    owner_id: owner_id,
    });

  newTip.save( (err) => {
    if (err) {
      res.render("restaurant", { message: "Something went wrong adding your tip" });
    } 
    else {
      const newCorroboration = new Corroboration({
        corroborated: true,
        tip_id: newTip._id,
        owner_id: newTip.owner_id,
      })

      newCorroboration.save((err) => {
        if (err) {
          //resrender problem here
          res.render("restaurant", { message: "Something went wrong adding the CORROBORATION for your tip" });
        }
        else{
          res.redirect('back');
        }
      })
    }
  });
});// END ADD-NEW-TIP



// DELET TIP BY ID
router.post('/delete-tip/:id', (req, res, next) => {

  Tip.findByIdAndRemove(req.params.id)
    .then(theTip=>{
      // console.log('theTip: ', theTip);
      // res.json(theTip)
      res.redirect('back');
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
  
  // Find the first corroboration that matcheds the id of the tip being looked and has the same owner as the user currently logged ins
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

      theCorroboration.corroborated = !theCorroboration.corroborated;

      theCorroboration.save((error) => {
        if (error) {
          res.redirect("back", { message: "the tip exists, but there was an issue updating it" });
        }
      })

      return;
    }
    // then it doesnt exist and it needs to be created

    const newCorroboration = new Corroboration({
      corroborated: true,
      tip_id: tipId,
      owner_id: ownerId,
    });

    newCorroboration.save((error) => {
      if (error) {
        //resrender problem here
        res.redirect("back", { message: "Something went wrong adding the CORROBORATION for that tip" });
      }
    })

  })
  .catch(err=>{
    console.log("there was an issue");
  })
});//END CREATE/UPDATE CORROBORATION



// GET ALL CORROBORATIONS ASSOCIATED WITH A TIP ID
router.get('/get-corroborations/:tipId', (req, res, next) => {

  Corroboration.find({tip_id: req.params.tipId})
  .then(theList=>{
    // need to pass multiple things here
    res.json(theList)
  })
  .catch(err=>console.log(err))

});



module.exports = router;
