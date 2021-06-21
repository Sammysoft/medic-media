const mongoose = require('mongoose');
const commentSchema = mongoose.Schema({
    body:{type: String},
    date:{type: String},
})
const appointmentSchema = mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    phonenumber: {
        type: String
    },
    nameofdoc:{
        type: String
    }
});

const AdminSchema = mongoose.Schema({
    firstname:{
        type: String,
       
    },
    lastname:{
        type: String,
        
    },
    dateofbirth:{
        type: String,
       
    },
    specialty: {
        type: String,
        
    },
    phonenumber:{
        type: Number,
      
    },
    gender:{
        type: String,
      
    },
    email:{
        type: String,
        required: true
    },
    imageurl:{
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    jobtype:{
        type: String,
        required: true
    },
    facebook:{
        type: String,
    },
    twiter:{
        type: String
    },
    linkedIn:{
        type: String,
    },
    about:{
        type: String
    },
    appointment:[
     appointmentSchema
    ],
    comment:[
       commentSchema
    ]
   
})


mongoose.model('Admin', AdminSchema);