const express = require('express');
const router = express.Router();
const flash =  require('connect-flash');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('../models/admin-model');
require('../models/patient-model');
const Patient = mongoose.model('Patient');
const Admin = mongoose.model('Admin');

router.get('/add-doctor',ensureAuthenticated, (req,res,next)=>{
    if(req.user.jobtype == "Clinics" ){
                 const Admin = req.user;
                    res.render('Pages/add-doctor', {
                        title: 'Register a doctor',
                        Clinics,
                        id: req.user._id,
                        caption: "Clinic. ",
                        Admin 
         })
     }else if(req.user.jobtype == "Admin" ){
                const Admins = "Admin" ;
                const Admin = req.user;  
                    res.render('Pages/add-doctor', {
                        title: 'Register a doctor',
                        details: req.user.username,
                        Admins,
                        caption: "Admin. ",
                        Admin,
                        id: req.user._id,    
         })
     }
     else{
         req.flash('error', 'Sorry, you are not an accreditated user...')
         res.redirect('/signin');
         
     }
});


router.post('/add-doctor',ensureAuthenticated, (req,res,next)=>{
        const { firstname, lastname, gender, phonenumber, specialty, jobtype, dateofbirth,  username, password, password2, facebook, linkedIn, twiter, email, imageurl, appointment} = req.body;
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
          res.render('Pages/add-doctor', {
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
                    res.render('Pages/add-doctor', {
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
                 admin.appointment = appointment;
        
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
                                                res.redirect('/');
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


router.get('/update/:id',ensureAuthenticated, (req, res, next)=>{
  Admin.findById(req.params.id, (err, Update)=>{
    if(req.user.jobtype == "Admin"){
        const Admin = req.user;
        console.log(Update)
        const Admins = "Admin"
        res.render('Pages/edits',{
            title: 'Update Record',
            Admin,
            Admins,
            Update,
            caption: "Admin. "
        })
  }else if(req.user.jobtype == "Clinics"){
        const Admin = req.user
        const Clinics = "Admin"
        res.render('Pages/edits',{
            title: 'Update Record',
            Admin,
            Clinics,
            Update,
            caption: "Clinic. "
   })
  }else if(req.user.jobtype == "Physician"){
        const Admin = req.user
        console.log(Update)
        const Physicians = "Admin"
        res.render('Pages/edits',{
            title: 'Update Record',
            Admin,
            Physicians,
            Update,
            caption: "Dr. " 
   })
  }else{
            req.flash('error', "You are not ana accreditated user...")
            res.redirect('/signin');       
        }
})
})

router.post('/update/:id', ensureAuthenticated, (req, res, next)=>{
        Admin.findByIdAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, result)=>{
            console.log(req.body)
                    req.flash('success', "Done Successfully");
                    res.redirect('/dashboard');
})
});





router.post('/reports/:id', ensureAuthenticated, (req, res, next)=>{
    Admin.findById({_id: req.body._id}, (err, result)=>{
        console.log(result.comment)
        var document = req.body;
               console.log(document)
               result.comment.push(document);
               result.save();
               if(!err){
                res.redirect('/patients/view-patients')
               }else{
                   console.log(err)
               }
})
});


router.post('/appointment/:id', ensureAuthenticated, (req, res, next)=>{
    Admin.findById({_id: req.body._id}, (err, result)=>{
        var document = req.body;
               console.log(document)
               result.appointment.push(document);
               result.save();
               if(!err){
                req.flash('success', 'Successfully booked an appointment')
                res.redirect('/Physicians/view-doctors')
               }else{
                   console.log(err);
               }
}) 
});



router.get('/delete/:id', ensureAuthenticated, (req, res, next)=>{
        Admin.findByIdAndDelete(req.params.id, (err, doc)=>{
            const id = req.user._id;
            req.flash('success', "Successfully deleted");
            res.redirect(`/dashboard`);
    })
})



 router.get('/doctor/Logout', (req,res)=>{
     req.logout();
     req.flash('success', 'Successfully Logged Out')
     res.redirect('/signin');
 })


 function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error', 'Please, Login First')
        res.redirect('/signin')
    }
 
}

router.get('/view-doctors',ensureAuthenticated, (req, res, next)=>{
    if(req.user.jobtype == "Clinics"){
        const Clinics = "Clinic"
        Admin.find({jobtype: "Physician"}, (err, docs)=>{
            res.render('Pages/view-doctors',{
                title : 'Doctors',
                Physician: docs,
                caption: "Clinic. ",
                Clinics,
                Admin: req.user
            })
        })
    }else if(req.user.jobtype == "Admin"){
        const Admins = "Admin"
        Admin.find({jobtype: "Physician"}, (err, docs)=>{
            res.render('Pages/view-doctors',{
                title : 'Doctors',
                Physician: docs,
                Admin: req.user,
                caption: "Admin. ",
                Admins,
               
            })
        })
    }else if(req.user.jobtype == "Patient"){
        const Patients = "Admin"
        Admin.find({jobtype: "Physician"}, (err, docs)=>{
            res.render('Pages/view-doctors',{
                title : 'Doctors',
                Physician: docs,
                caption: "Patient. ",
                Patients,
                Admin: req.user
            })
        })
    }else{
       req.flash("error", "You are not an accreditated user...");
       res.redirect('/signin');
    }
   
})

module.exports = router;