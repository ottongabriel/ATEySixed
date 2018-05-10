require('dotenv').config();

const express        = require('express');
const router         = express.Router();
const User           = require("../models/user");
const Tip            = require("../models/tip");
const Corroboration  = require("../models/corroboration");

const yelp           = require('yelp-fusion');




/* GET home page */
router.get('/restaurant-search', (req, res, next) => {
  const data = {};
  // if a user is logged in
  if(req.user){
    data.user = req.user;
  }

  res.render('restaurant-search', data);
});



router.get('/search/restaurants/:theTerm/:theLocation', (req,res,next) =>{


  const apiKey = process.env.API_KEY;
  
  const searchRequest = {};
  
  searchRequest.term = req.params.theTerm;
  searchRequest.location = req.params.theLocation;
  searchRequest.categories = "Food Restaurants";
  
  const client = yelp.client(apiKey);
  
  client.search(searchRequest)
    .then(response => {
      const businesses = response.jsonBody.businesses;

      res.json(businesses);
    
    })
    .catch(e => {
      console.log(e);
    });
})




// /restaurant/:id/:name/:alias/:phone/:address/:city/:zip
router.get('/restaurant&&:id&&:name&&:alias&&:phone&&:address&&:city&&:zip', (req, res, next) => {
  const data = {};
  // if a user is logged in
  if(req.user){
    data.user = req.user;
    data.user_id = req.user._id;
  }
  data.restaurantId = req.params.id;
  data.restaurantName = req.params.name;
  data.restaurantAlias = req.params.alias;
  data.restaurantPhone = req.params.phone;
  data.restaurantAddress = req.params.address;
  data.restaurantCity = req.params.city;
  data.restaurantZipCode = req.params.zip;





//FINDING ALL TIPS NOW, NEED TO MAKE IT SO THAT THEY ARE ONLY THE ONES FROM THIS RESTAURANT.

  data.tips = [];
  Tip.find({restaurant_id: data.restaurantId})
  .then(response => {
    response.map(tip => {

      const tipToAdd = {};
      Object.assign(tipToAdd, tip._doc);
      
      if(JSON.stringify(tipToAdd.owner_id) == JSON.stringify(data.user_id)){
        tipToAdd.OWNER = true;
      } 

      if(req.user){
        tipToAdd.loggedInUser = req.user._id;
      }
      data.tips.push(tipToAdd)

    });

    res.render('restaurant', data);
  })
  .catch(err=>console.log(err))








  


});





module.exports = router;
