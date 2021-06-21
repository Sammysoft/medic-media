const express = require('express');
const passport = require('passport');
require('../models/admin-model');
require('../models/patient-model');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = mongoose.model('Admin');
const Patient = mongoose.model('Patient')


const flash = require('connect-flash');

const router = express.Router();


 router.get('/doctor/Logout', (req,res)=>{
     req.logout();
     req.flash('success', 'Successfully Logged Out')
     res.redirect('/signin');
 })




router.get('/signin', (req, res, next)=>{
    res.render('Pages/sign-in', {
    title: 'Sign in to Hospital'
    })
});

router.get('/signup', (req, res, next)=>{
    res.render('Pages/signup', {
    title: 'Sign up for treatments'
    })
});


function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error', 'Please, Login First')
        res.redirect('/')
    }
 
}


router.post('/signup', (req,res)=>{
     
      const { firstname, lastname, phonenumber, specialty, imageurl, jobtype,  gender,  username, password, password2, facebook, linkedIn, twiter, email, comment, appointment} = req.body;
      //Validating Admin Registration
      let error = []
      
      if(!username || !password || !password2 || !email  || !jobtype  ){
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
        res.render('Pages/signup', {
            errors: error,
            username: username,
            password: password,
            password2: password2,
            email: email,
           
            jobtype: jobtype,
          //   filename: filename
        }) 
      }else{
          Admin.find({}, (err, result)=>{
           
            const arr = result;
           
           const emailPresent =  arr.some(el => el.password === password)
           const NamePresent =  arr.some(el => el.username === username)
            if(!err){
              if(emailPresent &&  NamePresent){
                  error.push({
                      msg: 'User Already Exists'
                  })
                  res.render('Pages/signup', {
                      errors: error,
                      username: username,
                      password: password,
                      password2: password2,
                      email: email,
                      jobtype: jobtype,
                     
                  })
              }else{
               const admin = new Admin()
               admin.gender = gender;
               admin.username = username;
               admin.jobtype = jobtype;
               admin.imageurl = imageurl;
               admin.password = password;
               admin.email = email;
               admin.appointment = appointment;
               admin.comment = comment;
              
      
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
   
  
  })






router.post('/register', (req,res)=>{

    
                 
    const { firstname, lastname, phonenumber, imageurl, jobtype,  gender,  username, password, password2, comment, email} = req.body;
    //Validating Admin Registration
    let error = []
    
    if(!username || !password || !password2 || !email  || !jobtype  ){
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
      res.render('Pages/signup', {
          errors: error,
          username: username,
          password: password,
          password2: password2,
          email: email,
          jobtype: jobtype,
        //   filename: filename
      }) 
    }else{
        Patient.find({}, (err, result)=>{
         
          const arr = result;
         
         const emailPresent =  arr.some(el => el.password === password)
         const NamePresent =  arr.some(el => el.username === username)
          if(!err){
            if(emailPresent &&  NamePresent){
                error.push({
                    msg: 'User Already Exists'
                })
                res.render('Pages/signup', {
                    errors: error,
                    username: username,
                    password: password,
                    password2: password2,
                    email: email,
                    jobtype: jobtype,
                    
                   
                })
            }else{
             const patient = new Patient()
             patient.username = username;
             patient.jobtype = jobtype;
             patient.password = password;
             patient.email = email;
             patient.comment = comment;
             patient.firstname = firstname;
             patient.lastname = lastname;
             patient.imageurl = imageurl;
             
    
                // bcrypt
                bcrypt.genSalt(10, function(err, salt){
                            bcrypt.hash(patient.password, salt, function(err, hash){
                                if(err){
                                    console.log('error from password hashing',err)
                                }else{
                                    patient.password = hash;
                                    console.log(patient.password);
                                    patient.save((err)=>{
                                        if(!err){
                                            req.flash('success_msg', 'You are now registered and can login...');
                                            res.redirect('/signin');
                                        }else{
                                            console.log(err)
                                        }
                                    })
                                }
                            })
                        })
                   
                    }
                }
      })
    }
 

})


module.exports = router;