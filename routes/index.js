var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PrjectTrackerSec3' });
});

router.get('/about', (req,res,next)=>{
  res.render('about', {title : 'About', testPage : 'dasdfasdfasdfasdf'});
})

module.exports = router;
