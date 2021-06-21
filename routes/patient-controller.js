const express =  require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('../models/patient-model')
require('../models/admin-model');

const Patient = mongoose.model('Patient');
const Admin = mongoose.model('Admin');

router.get('/add-patient', ensureAuthenticated, (req, res, next)=>{
   if(req.user.jobtype == "Admin"){
                const Admin = req.user
                const Admins = "Admins"
                res.render('Pages/patient-signup', {
                    title: 'Patient Sign up', 
                    Admin,
                    caption: "Admin. ",
                    Admins,
                })
   }else if(req.user.jobtype == "Physician"){
    const Admin = req.user
    const Physicians = "Physicians"
    res.render('Pages/patient-signup', {
        title: 'Patient Sign up', 
        Admin,
        caption: "Dr. ",
        Physicians,
    })
   }else if(req.user.jobtype == "Clinics"){
    const Admin = req.user
    const Clinics = "Clinics"
    res.render('Pages/patient-signup', {
        title: 'Patient Sign up', 
        Admin,
        caption: "Clinic. ",
        Clinics,
    })
   }else{
       req.flash('error', "You are not an accreditated user");
       res.redirect('/')
   }
});


router.get('/accounts', (req, res, next)=>{
    res.render('Pages/account', {
        title: 'Patients'
    })
});

router.get('/register', (req,res,next)=>{
    res.render('Pages/patient-signup', {
        title: 'Patients Signup'
    })
})



function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error', 'Please, Login First')
        res.redirect('/signin')
    }
 
}


router.get('/update/:id', (req, res, next)=>{
    res.render("Pages/update", {
        title: "Update Record"
    })
})

router.get('/view-patients',ensureAuthenticated,  (req, res, next)=>{
    if(req.user.jobtype == "Clinics"){
        Admin.find({jobtype: "Patient"}, (err, Patient)=>{
          
               const Clinics = "Clinic";
                if(!err){
                    res.render('Pages/view-patients', {
                        title: 'Patients of Medic Media',
                        Patient,
                        Clinics,
                        Admin: req.user,
                        caption: "Clinic. "
                    })
                }else{
                    console.log(err)
                }    
           })
        }else if(req.user.jobtype == "Physician"){
            Admin.find({jobtype: "Patient"}, (err, Patient)=>{
                
                const Physicians = "Physician";
                    if(!err){
                        res.render('Pages/view-patients', {
                            title: 'Patients of Medic Media',
                            Patient,
                            Physicians,
                            Admin: req.user,
                            caption: "Dr. "
                        })
                    }else{
                        console.log(err)
                    }
                })
            }else if(req.user.jobtype == "Admin"){
                const Admins = "Admin"
                Admin.find({jobtype: "Patient"},(err, Patient)=>{
                    
                        if(!err){
                            res.render('Pages/view-patients', {
                                title: 'Patients of Medic Media',
                                Patient,
                                Admins,
                                Admin: req.user,
                                caption: "Admin. "
                            })
                        }else{
                            console.log(err)
                        }
                    })          
                }else{
            req.flash('error', 'Sorry, you are not an accreditated user....')
            res.redirect('/signin');
           
        }
            
           
})

router.get('/patients-signin', (req, res, next)=>{
    res.render('Pages/patient-signin', {
        title: 'Patient Sign in'
    })
});


router.get('/patient-signup', (req, res, next)=>{
    res.render('Pages/patient-signup', {
        title: 'Patient Sign Up'
    })
});



module.exports = router;