//The server that runs the api


//BASE SETUP
// =================================

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 9999;

var signerObj = require('./apps/models/signer')

//ROUTES FOR API
// =================================

var router = express.Router();

//middleware
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});

router.get('/', function(req, res) {
  res.json({
    message: 'hooray! welcome'
  });
});

router.route('/getAccess').post(function(req, res) {
  //call the faucet function
  try {
    signerObj.signAndSend();
    res.json({
      message: 'Congrats, Say thank you'
    });
  } catch (err) {
    res.send(err);
  }
});

//REGISTER ROUTES
// =================================

app.use('/api', router);

//START THE SERVER
// =================================

app.listen(port);
console.log('stuff happens');
