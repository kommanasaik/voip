
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const apn = require('apn');
const env= require('dotenv').config();
const request = require('request');
const PORT = process.env.PORT;
const AUTH_KEY =process.env.AUTH_KEY;
const BOOSTLINGO_EMAIL=process.env.BOOSTLINGO_EMAIL;
const BOOSTLINGO_PASSWORD=process.env.BOOSTLINGO_PASSWORD;
const BOOSTLINGO_BASEURL=process.env.BOOSTLINGO_BASEURL; 
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
function sendNotificationToIos(JsonObj) {
console.log(JsonObj);
  var options = {
    token: {
      key: process.env.VOIP_KEYFILE,
      keyId: process.env.VOIP_KEYID,
      teamId: process.env.VOIP_TEAMID
    },
    production: true
  };
var apnProvider = new apn.Provider(options);
console.log(JsonObj.DeviceToken);
deviceId=JsonObj.notification.DeviceToken;

var note = new apn.Notification();
// note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
note.expiry=0;  
note.badge = 3;
note.priority=10;
  note.payload = JsonObj;
  note.topic = process.env.VOIP_BUNDLEID;
  apnProvider.send(note, deviceId).then( (result) => { 
    console.log(JSON.stringify(result));
  });
}


function smssendNotificationToIos(JsonObj) {
console.log('sms');
console.log(JsonObj);
  var options = {
    token: {
      key: process.env.VOIP_KEYFILES,
      keyId: process.env.VOIP_KEYIDS,
      teamId: process.env.VOIP_TEAMIDS
    },
    production:false
  };
console.log(options);
var apnProvider = new apn.Provider(options);
console.log(JsonObj.DeviceToken);
deviceId=JsonObj.notification.DeviceToken;

var note = new apn.Notification();
// note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
note.expiry=0;
note.badge = 3;
note.priority=10;
  note.payload = JsonObj;
  note.topic = process.env.VOIP_BUNDLEIDS;
  apnProvider.send(note, deviceId).then( (result) => {
    console.log(JSON.stringify(result));
  });
}



app.get('/', function(req, res) {
var key = req.headers && req.headers.authorization? req.headers.authorization: null;
  if(AUTH_KEY == key) {
    res.send({'status': 200, 'serverStatus': 'running'})
  } else {
    res.sendStatus(401);
  }
});
//------ Send Voip Notification to IOS Devices ----------//
app.post('/sendvoIPNotification', function(req, res) {

 var key = req.headers && req.headers.authorization? req.headers.authorization: null;
console.log(req.headers.authorization);
  if(AUTH_KEY == key) {
    var JsonObj=req.body;   
    sendNotificationToIos(JsonObj);
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});



//-------- While VRI End Call to call this api-------------//
app.post('/voIPEndCall', function(req, res) {
var key = req.headers && req.headers.authorization? req.headers.authorization: null;
  if(AUTH_KEY == key) {
    var EndJsonObj=req.body;     
    sendNotificationToIos(EndJsonObj);
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});



app.post('/smssendvoIPNotification', function(req, res) {
console.log('smsionline');
 var key = req.headers && req.headers.authorization? req.headers.authorization: null;
console.log(req.headers.authorization);
  if(AUTH_KEY == key) {
    var JsonObj=req.body;
    smssendNotificationToIos(JsonObj);
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});



//-------- While VRI End Call to call this api-------------//
app.post('/smsvoIPEndCall', function(req, res) {
var key = req.headers && req.headers.authorization? req.headers.authorization: null;
  if(AUTH_KEY == key) {
    var EndJsonObj=req.body;
    smssendNotificationToIos(EndJsonObj);
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});





//------ Getting AuthToken for Boostlingo Calls ----------//

app.get('/get-boostlingo-token', function(req, ressponse) {
  request.post(BOOSTLINGO_BASEURL, {
    json: {
      email: BOOSTLINGO_EMAIL,password:BOOSTLINGO_PASSWORD
    }
  }, (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
    ResponseObj=body;
    ressponse.json(ResponseObj);
  });
});




//app.get('/get-boostlingo-token', function(req, ressponse) {
 // request.post(BOOSTLINGO_BASEURL, {
   // json: {
     // email: BOOSTLINGO_EMAIL,password:BOOSTLINGO_PASSWORD
   // }
  //}, (error, res, body) => {
   // if (error) {
     // console.error(error)
     // return
   // }
   // ResponseObj=body;
   // ressponse.json(ResponseObj);
 // });
//});

app.listen(PORT, function(){
  console.log('Server is running on Port:',PORT);
});
