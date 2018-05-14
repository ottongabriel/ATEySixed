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


module.exports = router;
