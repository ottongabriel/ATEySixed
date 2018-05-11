const express        = require('express');
const router         = express.Router();
const mongoose       = require('mongoose');
const User           = require("../models/user");
const Tip            = require("../models/tip");
const Corroboration  = require("../models/corroboration");

const ensureLogin    = require("connect-ensure-login");



/* GET home page */
router.get('/', (req, res, next) => {
  const data = {};
  // if a user is logged in
  if(req.user){
    data.user = req.user;
  }

  res.render('index', data);
});



//THIS IS THE TEST VERSION THAT I WAS WORKING ON TO TEST THE PRINCIPLES OF HOW TIPS WOULD WORK. WILL KEEP FOR TEMPORARY REFERENCE TO SOME PRINCIPLES. DELETE ON FINAL VERSION
router.get('/test-new-tip', ensureLogin.ensureLoggedIn(), (req, res, next) => {

  const data = {};

  data.user = req.user;
  data.user_id = req.user._id;
  data.tips = [];


  Tip.find()
  .then(response => {

      // for each of the tips I get back I will try to compare their owner id with the id of the user currently logged in then, if there is a match, I will append a property to that tip something along the lines of OWNER = true.

      response.map(tip => {

        const tipToAdd = {};
        Object.assign(tipToAdd, tip._doc);
        
        if(JSON.stringify(tipToAdd.owner_id) == JSON.stringify(data.user_id)){
          // console.log("============> EQUAL");
          tipToAdd.OWNER = true;

        } else {
          // console.log('====> NOT EQUAL')
        }

        data.tips.push(tipToAdd)

      });

      res.render('test-new-tip', data);
    })
    .catch(err=>console.log(err))

});



////////////////////////////////working NEW TIP
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
          // here is where the magic happens
          res.redirect('back');


        }


      })






    }
  });
});


router.post('/delete-tip/:id', (req, res, next) => {
  // first thing to do for testing
  // res.send("hello world");

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
});//endgetcharactersby:id








// &&:owner_id => took this out of the string
router.post('/corroboration/:tip_id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  // first thing to do for testing
  // res.send("hello world");
  
  const tipId = req.params.tip_id;
  const ownerId = req.user._id;
  
  

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
      console.log("it does exist already");

      theCorroboration.corroborated = !theCorroboration.corroborated;

      theCorroboration.save((error) => {
        if (error) {
          res.redirect("back", { message: "the tip exists, but there was an issue updating it" });
        }
        else{
          // here is where the magic happens
          // res.redirect('back');
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
      else{
        return;
        // here is where the magic happens
        // res.redirect('back');
      }
    })




  })
  .catch(err=>{
    console.log("there was an issue");
  })


});//end the /create/update of the corroboration







////// THIS IS THE JSON LINE EVERYTHING AFTER HERE BELONGS TO THE JSON KINGDOM


// THIS IS A TEST TO GET ALL OF THE TIPS ON A JSON CALL
router.get('/get-corroborations/:tipId', (req, res, next) => {

  Corroboration.find({tip_id: req.params.tipId})
  .then(theList=>{
    // need to pass multiple things here
    res.json(theList)
  })
  .catch(err=>console.log(err))

});














module.exports = router;
