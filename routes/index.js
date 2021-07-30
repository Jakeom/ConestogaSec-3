var express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { stringify } = require('querystring');
const nodemailer = require('nodemailer');
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


  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'JakeomCa@gmail.com',  // gmail Account
      pass: '!1234qwer'          // gmail pass
    }
  });

  let mailOptions = {
    from: 'JakeomCa@gmail.com',    // my account
    to: req.body.to ,                     // send email address
    subject: 'Hello, I am Jakeom.',   // subject
    text: req.body.text  // content
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    }
    else {
      console.log('Email sent: ' + info.response);
    }
  });

  return res.json({ success: true, msg: 'Eamil success!!' });
});

module.exports = router;
