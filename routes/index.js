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

router.post('/test-new-tip', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const item = req.body.item;
  const owner_id = req.user._id;

  if (item === "") {
    res.render("test-new-tip", { message: "Tell us what they are out of!" });
    return;
  }


  const newTip = new Tip({
    item: item,
    owner_id: owner_id,
    });

  newTip.save((err) => {
    if (err) {
      res.render("test-new-tip", { message: "Something went wrong adding your tip" });
    } else {
      res.redirect("/test-new-tip");
    }
  });
});



// THIS WAS THE CODE TO HAVE AN INDIVIDUAL PAGE WITH ALL OF THE TIPS BUT I AM SHOWING THEM IN THE ADD TIP PAGE NOW.
// router.get('/test-all-tips', (req, res, next) => {
//   const data = {};
//   // if a user is logged in
//   if(req.user){
//     data.user = req.user;
//   }

//   Tip.find()
//     .then(response => {
//       data.tips = response;
//       res.render('test-all-tips', data);
//     })
//     .catch(err=>console.log(err))

// });












module.exports = router;
