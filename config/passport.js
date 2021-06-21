const LocalStrategy = require('passport-local').Strategy;
require('../models/admin-model');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = mongoose.model('Admin');


module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'username'}, (username, password, done)=>{
       Admin.findOne({username: username})
       .then(user => {
           if(!user){
              
                        return done(null, false, {message: 'User does not exist'})
                    }
                 
           //Match Passwords
           bcrypt.compare(password, user.password, (err, isMatch)=>{
          if(isMatch){
              return done(null, user)
          }else{
              return done(null, false, {message: 'Password is Wrong!'})
          }
           })
       })
      .catch(err => console.log(err));
    })
 )
passport.serializeUser((user, done)=>{
    return done(null, user.id)
})
passport.deserializeUser((id, done)=>{
    Admin.findById(id, (err, user)=>{
    done(err, user )
    })
   
})
}