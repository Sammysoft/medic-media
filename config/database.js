const mongoose = require('mongoose');

require('dotenv').config();
const uri = process.env.MONGODB_URI;
const mongoURI = process.env.MONGODB_ATLAS;

mongoose.connect(mongoURI, {useNewUrlParser: true}, function(err, result){
  if(!err){
    console.log('Connection made to Database')
  }else{
      console.log(err)
  }
})
    
   require('../models/admin-model'); 