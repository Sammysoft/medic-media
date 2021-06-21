const mongoose = require('mongoose');
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

mongoose.model("Appointment", appointmentSchema);