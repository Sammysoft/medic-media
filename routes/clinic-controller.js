const express =  require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/patient-model')
require('../models/admin-model');
const bcrypt = require('bcryptjs');
const Patient = mongoose.model('Patient');
const Admin = mongoose.model('Admin');





function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error', 'Please, Login First')
        res.redirect('/signin')
    }
 
}


router.get('/view-clinics',ensureAuthenticated, (req,res, next)=>{
    Admin.find({jobtype: "Clinics"}, (err, docs)=>{
     if(req.user.jobtype == "Admin"){
         const Admins = "Admins"
         res.render('Pages/view-clinics', {
             title: 'View Clinic',
             Admin: req.user,
             Admins,
             caption: "Dr.",
             Clinic: docs
         })
     }else{
         req.flash('error', "You are not an accreditated user...")
        res.redirect('/signin')
     }
    })
})





router.get('/add-clinic',ensureAuthenticated, (req,res,next)=>{
    if(req.user.jobtype == "Admin" ){
                 const Admin = req.user;
                 const Admins = "Admin";
                    res.render('Pages/add-clinic', {
                        title: 'Register a Clinic',
                        Admins,
                        id: req.user._id,
                        caption: "Admin. ",
                        Admin 
         })
     }else{
         req.flash('error', 'Sorry, you are not an accreditated user...')
         res.redirect('/signin');
         
     }
});


router.post('/add-clinic',ensureAuthenticated, (req,res,next)=>{
        const { firstname, lastname, phonenumber, specialty, jobtype, dateofbirth, gender, username, password, password2, facebook, linkedIn, twiter, email, imageurl} = req.body;
        //Validating Admin Registration
        let error = []
        if(!username || !password || !password2 || !email || !phonenumber || !jobtype || !lastname || !firstname  ){
            error.push({
                msg: 'Please Fill in All Credentials!'
            })
        } 
        
        if(password !== password2){
            error.push({
                msg: 'Passwords don\'t Match!'
            })
        }
        if(error.length > 0){
          res.render('Pages/add-clinic', {
              errors: error,
              username: username,
              password: password,
              password2: password2,
              email: email,
              phonenumber: phonenumber,
              jobtype: jobtype,
              imageurl: imageurl
          }) 
        }else{
            Admin.find({}, (err, result)=>{
              console.log(result)
              const arr = result;
              console.log(arr)
             const emailPresent =  arr.some(el => el.password === password)
             const NamePresent =  arr.some(el => el.username === username)
              if(!err){
                if(emailPresent &&  NamePresent){
                    error.push({
                        msg: 'User Already Exists'
                    })
                    res.render('Pages/add-clinic', {
                        errors: error,
                        username: username,
                        password: password,
                        password2: password2,
                        email: email,
                        phonenumber: phonenumber,
                        jobtype: jobtype,
                        imageurl: imageurl
                       
                    })
                }else{
                 const admin = new Admin()
                 admin.firstname = firstname;
                 admin.lastname = lastname;
                 admin.gender = gender;
                 admin.phonenumber = phonenumber;
                 admin.username = username;
                 admin.jobtype = jobtype;
                 admin.specialty = specialty;
                 admin.dateofbirth = dateofbirth;
                 admin.password = password;
                 admin.facebook = facebook;
                 admin.twiter = twiter;
                 admin.linkedIn = linkedIn;
                 admin.email = email;
                 admin.imageurl = imageurl;
 
        
                    // bcrypt
                    bcrypt.genSalt(10, function(err, salt){
                                bcrypt.hash(admin.password, salt, function(err, hash){
                                    if(err){
                                        console.log('error from password hashing',err)
                                    }else{
                                        admin.password = hash;
                                        console.log(admin.password);
                                        admin.save((err)=>{
                                            if(!err){
                                                req.flash('success_msg', 'You are now registered and can login...');
                                                res.redirect('/signin');
                                            }
                                        })
                                    }
                                })
                            })
                       
                        }
                    }
          })
        }
     
    
});


module.exports = router; 