const mongoose = require('mongoose');
const commentSchema = mongoose.Schema({
    body:{String},
    date:{String},
})
const PatientSchema = mongoose.Schema({
    email:{
        type: String,
       
    },nameofdoc:{
        type: String,
    },
    password:{
        type: String
    },
    username:{
        type: String
    },
    imageurl:{
        type: String
    },
    age:{
        type: Number
    },
    phonenumber:{
        type:Number
    },
    hailment:{
        type:String
    },
    firstname:{
        type: String
    },
    lastname:{
        type: String
    },
    ward: {
        type: String
    },
    staffonduty:{
        type: String
    },
    date:{
        type: String
    },
    comment:[
       commentSchema
    ]
});

mongoose.model('Patient', PatientSchema);