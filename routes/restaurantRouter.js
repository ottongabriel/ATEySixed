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


  const apiKey = 'HNg-HmXwymizCIqWdt0SaxiQL6-IvKha9xjF76DuFXCcmb0MrZPz06OcejVqNXTSSZKwFtxYbYdu04CwGJDCnnNocVAS8E_k0e6UH7tdBiCOxr8L_uEH1i1cS57wWnYx';
  
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
router.get('/restaurant/:id', (req, res, next) => {
  const data = {};
  // if a user is logged in
  if(req.user){
    data.user = req.user;
  }
  data.restaurantId = req.params.id;
  // data.restaurantName = req.params.name;
  // data.restaurantAlias = req.params.alias;
  // data.restaurantPhone = req.params.phone;
  // data.restaurantAddress = req.params.address;
  // data.restaurantCity = req.params.city;
  // data.restaurantZipCode = req.params.zip;
  

  res.render('restaurant-single', data);
});





module.exports = router;
