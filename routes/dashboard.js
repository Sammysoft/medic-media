const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res, next)=>{
    res.render('Pages/dashboard', {
        title: 'Medic Media'
    })
});
router.get('/', (req,res, next)=>{
    res.render('Pages/Homepage', {
        title: "Medic Media"
    })
})


module.exports = router; 