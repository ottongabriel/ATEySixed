const express        = require('express');
const router         = express.Router();
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



////////////////////////////////TEST NEW TIP
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
    res.render("restaurant", { message: "Tell us what they are out of!" });
    return;
  }


  const newTip = new Tip({
    item: item,
    restaurant_id: the_id,
    owner_id: owner_id,
    });

  newTip.save((err) => {
    if (err) {
      res.render("restaurant", { message: "Something went wrong adding your tip" });
    } else {
      res.redirect('back');
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









////// THIS IS THE JSON LINE EVERYTHING AFTER HERE BELONGS TO THE JSON KINGDOM


// THIS IS A TEST TO GET ALL OF THE TIPS ON A JSON CALL
router.get('/get-all-tips', (req, res, next) => {

  Tip.find()
  .then(theList=>{
    // need to pass multiple things here
    res.json(theList)
  })
  .catch(err=>console.log(err))

});














module.exports = router;
