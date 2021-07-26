var express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { stringify } = require('querystring');
//var sender = require('emailsender');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Jakeom' });
});

// router.get('/about', (req,res,next)=>{
//   res.render('about', {title : 'About', testPage : 'dasdfasdfasdfasdf'});
// })

//app.post('/subscribe', async (req, res) => {
router.post('/subscribe', async (req, res, next) => {

  const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  var isValidation = false;
  // Check Email format
  if (req.body.to.trim() == "" || req.body.to.match(regExp) == null) { 
    isValidation = true;
  }
  if (req.body.text == null || req.body.text.trim() == "") { 
    isValidation = true;
  }
  if(isValidation){
    return res.json({ success: false, msg: 'Please, Check the Values.' });
  }
console.log(req.body);
  if (!req.body.captcha)
    return res.json({ success: false, msg: 'Please select captcha' });

  // Secret key
  const secretKey = '6Lc40LobAAAAABHXOBUj3K_bhgLOKvG0VJTAE4G9';

  // Verify URL
  const query = stringify({
    secret: secretKey,
    response: req.body.captcha,
    remoteip: req.connection.remoteAddress
  });

  const verifyURL = "https://google.com/recaptcha/api/siteverify?"+query;

  // Make a request to verifyURL
  const body = await fetch(verifyURL).then(res => res.json());

  // If not successful
  if (body.success !== undefined && !body.success)
    return res.json({ success: false, msg: 'Failed captcha verification' });


  var mailConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'JakeomCa@gmail.com',
      pass: '!1234qwer'
    }
  }
  //var _sender = new sender(mailConfig)

  var mailOptions = {
    from: 'JakeomCa@gmail.com',
    to: req.body.to,
    text: req.body.text
  }

  var callback = function(err, info){
    //callback handle
    //console.log(err);
  }

//_sender.send(mailOptions, callback)

  // If successful
  return res.json({ success: true, msg: 'Eamil success!!' });
});

module.exports = router;
