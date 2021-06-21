const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
app.use(express.static('public'));
const port = process.env.PORT || 3001;
require('./models/patient-model');
require('./models/admin-model');
require('./models/appointment');
const Patient = mongoose.model('Patient');
const Admin = mongoose.model('Admin');
const Appointment = mongoose.model('Appointment')
const account_controller = require('./routes/account-controller');
const admin_controller = require('./routes/admin-controller');
const dashboard = require('./routes/dashboard');
const patients = require('./routes/patient-controller');
const clinic = require('./routes/clinic-controller');


app.listen(port, '0.0.0.0', ()=>{
    console.log(`Server running smoothly on port ${port}`)
})



app.use(bodyparser());
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());


//Setting up Views Engine
app.engine('hbs', hbs({extname:'hbs', defaultLayout: 'MainLayout',  layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, '/views/'));
app.set('view engine', 'hbs'); 
 

require('./config/passport')(passport);
require('./config/database');

//Express session

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());
//Global Vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success');
    next();
})
//setMasterAdmiconfig


app.get('*', (req,res,next)=>{
    res.locals.user = req.user || null;
    next();
})


app.get('/schedule', (req,res,next)=>{
    res.render('Pages/schedule', {
        title: "Doctor's Schedule"
    })
})


app.get('/profile/:id',ensureAuthenticated, (req,res,next)=>{
    Admin.findById(req.params.id, (err, doc)=>{
        if(req.user.jobtype == "Clinics"){
            const Clinic = req.user
            const Clinics = "Clinic"
            res.render('Pages/Profile', {
                title: 'Profile',
                Profile: doc,
                Admin: req.user,
                Clinic,
                Clinics,
                caption: "Clinic."
            })
        }else if(req.user.jobtype == "Physician"){
        const Physician = req.user
        const Physicians = "Physicians";
            res.render('Pages/Profile', {
                title: 'Profile',
                Profile: doc,
                Admin: req.user,
                Physician,
                Physicians,
                caption: "Dr."
            })
        }else if(req.user.jobtype == "Patient"){
            const patients = req.user;
            const Patients = "Patients"
            res.render('Pages/Profile', {
                title: 'Profile',
                Profile: doc,
                Admin: req.user,
                patients,
                Patients
            })
        }else if(req.user.jobtype == "Admin"){
            req.flash('error', "Sorry you cannot edit the Admin Account")
            res.redirect('/')
        }else{
            req.flash('error', 'You are not an accreditated user...');
            res.redirect('/')
        }
       
    })
})




app.post('/login',  (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    })(req,res,next)
 })
 
 function ensureAuthenticated(req,res,next){
     if(req.isAuthenticated()){
         return next();
     }else{
         req.flash('error', 'Please, Login First')
         res.redirect('/')
     }
  
 }


 app.get('/video-chat', (req, res, next)=>{
     res.render('Pages/teleconference', {
         title: 'Medic Media | Teleconference'
     })
 });
 
 app.get('/dashboard', ensureAuthenticated, (req, res, next)=>{
     if(req.user.jobtype == "Physician"){
         const Physicians = "Physicians";
            Admin.find({jobtype: "Physician"}, (err, Physician)=>{  
                Admin.find({jobtype: "Clinics"}, (err, Clinic)=>{
                    Admin.find({jobtype: "Patient"}, (err, Patient)=>{
                        res.render('Pages/dashboard', {
                            title: 'Dashboard',
                            Admin: req.user,
                            id: req.user._id,
                            Patient,
                            caption: "Dr.",
                            Physicians,
                            Physician,
                            Clinic
                        })  
                    })
                   
            })
          
         }) 
     }else if(req.user.jobtype == "Admin"){
        Admin.find({jobtype: "Patient"}, (err, Patient)=>{
            Admin.find({jobtype: "Clinics"}, (err, Clinic)=>{
                Admin.find({jobtype: 'Physician'}, (err, Physician)=>{
                    const Admins = "Admin"
                    res.render('Pages/dashboard', {
                        title: 'Dashboard',
                        Admin: req.user,
                        Clinic,
                        Admins,
                        id: req.user._id,
                        caption: "Admin. ",
                        Patient,
                        Physician
                    })  
                })
            })
           
       
         })
        }
     else if(req.user.jobtype == "Clinics"){
            Admin.find({jobtype: "Clinics"}, (err, Clinic)=>{
                const Clinics = "Clinic";
                Admin.find({jobtype: 'Physician'}, (err, Physician)=>{
                   Admin.find({jobtype: "Patient"}, (err, Patient)=>{
                    res.render('Pages/dashboard', {
                        title: 'Dashboard',
                        Admin: req.user,
                        Clinic,
                        id: req.user._id,
                        caption: "Clinic.",
                        Patient,
                        Clinics,
                        Physician
                    })  
                   })
            })
         })
     }else{
        Admin.find({jobtype: "Patient"}, (err, Patient)=>{
            Admin.find({jobtype: "Physician"}, (err, Physician)=>{
                Admin.find({jobtype: "Clinics"}, (err, Clinic)=>{
                    const Patients = "Patient"
                        res.render('Pages/dashboard', {
                            title: 'Dashboard',
                            Admin: req.user,
                            Clinic,
                            Physician,
                            id: req.user._id,
                            caption: "Patient ",
                            Patients,
                            Patient: Patient,
                        })  
                })
            })          
         })
     }  
});



app.get('/appointment', ensureAuthenticated, (req, res, next)=>{
    const Patients = "Patients";
    Admin.find({jobtype: "Physician"}, (err, Physician)=>{
        const Admin = req.user
        res.render('Pages/appointment', {
            title: "Book an Appointment", 
            Physician,
            Admin,
            Patients
        })
    })
})



app.get('/view-appointment', ensureAuthenticated, (req, res, next)=>{
    const Admin  = req.user;
    const Clinic = "Clinic";
    if(req.user.jobtype == "Admin"){
       req.flash('error', 'You are not a Physician');
       res.redirect('/signin');
    }else if(req.user.jobtype == "Clinics"){
        req.flash('error', 'You are not a Physician');
        res.redirect('/signin');
    }else if(req.user.jobtype == "Physician"){
        const Physicians = "Hello";
            const Admin = req.user;
            console.log(Admin)
            res.render('Pages/view-appointment', {
                title: "Book an Appointment", 
                Admin,
                Physicians,
                caption: "Dr. "
        })
    }else{
        req.flash('error', 'You are not an accreditated user')
        res.redirect('/signin')
    }
})



app.get('/patients', (req,res, next)=>{
    res.render('Pages/patient-signup', {
        title: 'Sign up as patient'
    })
})


app.use('/', admin_controller);
app.use('/physicians', admin_controller);
app.use('/doctor', admin_controller);
app.use('/', account_controller );
app.use('/', dashboard );
app.use('/patients', patients );
app.use('/Clinics', clinic);

