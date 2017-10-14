/**
 * Created by hb.ahn@sk.com on 11/07/2017.
 * This is only for test
 */

'use strict';

// for logging
var colors = require('colors');
var util = require('util');

// for importing mqtt
var mqtt = require('mqtt');

// for importing configuration
var config = require('./config');
var utils = require('./utils');


var clientIdSession = config.smartFleetClientId();

var latitudeValue = [ 37.509141, 37.510296, 37.511334, 37.512353, 37.513743, 37.514770, 37.516314, 37.517931, 37.519846, 37.520759, 
                      37.522624, 37.524782, 37.526018, 37.527895, 37.528641, 37.529740, 37.530824, 37.531986, 37.533009, 37.532616,
                      37.531939, 37.531624, 37.531418, 37.530502, 37.527543, 37.526463, 37.525050, 37.523405, 37.521730, 37.520683,
                      37.519330, 37.518079, 37.516871, 37.516062, 37.515373, 37.515084, 37.514828, 37.514556, 37.514016, 37.513697,
                      37.513428, 37.513010, 37.511564, 37.510118, 37.508683, 37.506780, 37.507256, 37.507813, 37.508235, 37.508747 ];

var longitudeValue = [ 127.063228, 127.062512, 127.061969, 127.061426, 127.060685, 127.060067, 127.059200, 127.058356, 127.057246, 127.056837, 
                       127.055780, 127.054697, 127.054908, 127.056011, 127.056456, 127.057057, 127.057673, 127.058318, 127.059712, 127.061573,
                       127.063994, 127.065731, 127.066625, 127.066153, 127.064765, 127.064304, 127.063639, 127.062914, 127.063069, 127.063960,
                       127.065430, 127.066148, 127.066492, 127.066610, 127.066717, 127.065204, 127.063488, 127.061846, 127.059270, 127.057246,
                       127.055474, 127.053350, 127.054029, 127.054846, 127.055550, 127.056604, 127.058326, 127.060275, 127.061543, 127.063367 ];


var sequence = 0;
var IntervalFunction;
var tid = 0;
var startTs;
var endTs;

// connection Smart[Fleet] Platform

console.log(colors.green('Connecting to Smart[Fleet] Platform'));

//////////////////////////////////////////////////
// Flow #1 : Request Connection 
//////////////////////////////////////////////////

var messageSender = mqtt.connect('mqtts://' + config.Host, {
    username:config.userName,
    clientId:clientIdSession,
    clean:true,
    keepalive:60,
    rejectUnauthorized: true
});

messageSender.on('connect', function() {

    console.log(colors.green('Connected Smart[Fleet] Platform'));
    console.log(colors.blue('ClientID : ' + clientIdSession));

    subscribeRPCTopic();
    intervalSender();

});

// Connection Error Callback
messageSender.on('error', function(error){
    console.log(colors.red(error));

});

// messageArrived callback
messageSender.on('message', function(topic, message) {
    var msgs = message.toString();
    var topic = topic.toString();
    var requestId = topic.toString().split('/')[5];

    if (msgs != null){
      console.log(colors.magenta('Received RPC Message'));
      console.log(colors.magenta('Topic :' + topic));
      console.log(colors.magenta(msgs));
      console.log(colors.magenta(''));

      responseRPCRequest(requestId);
    }
});

function intervalSender(){

    tid++;
    sequence=0;
    IntervalFunction = setInterval(sendingMicroTripMessage, config.updateInterval);
  
}


function sendingMicroTripMessage()
{
  sequence++;
  

  if (sequence == 1) {
    startTs = new Date().getTime();

  }
  if (sequence == config.microTripCnt) {
    endTs = new Date().getTime();
  }

  var microTrip = {

   "ty": 2,
   "ts": new Date().getTime(),
   "ap": 0,
   "pld": 
    {
       "tid": tid,
       "lon": longitudeValue[sequence % config.microTripCnt],
       "lat": latitudeValue[sequence % config.microTripCnt],
       "alt" : utils.randomIntFromInterval(100, 120),
       "sp" : utils.randomIntFromInterval(50,90),
       "dop" : utils.randomIntFromInterval(10.5, 20.3),
       "nos" : utils.randomIntFromInterval(2,6),
       "clt" : new Date().getTime()
     }
  };

  messageSender.publish(config.sendingTopic, JSON.stringify(microTrip), {qos: 0}, function(){
    console.log(colors.yellow('Successfully sending a MicroTrip message to Smart[Fleet] Platform'));
    console.log(colors.yellow('Message : ' + JSON.stringify(microTrip)));
    console.log(colors.yellow(''));
  });

  if ( sequence == config.microTripCnt ) {
    clearInterval(IntervalFunction);
    sendingTripMessage();
  }
}

function sendingTripMessage(){

  var trip = {
    "ty": 1,
    "ts": new Date().getTime(),
    "pld":
      {
        "tid" : tid,
        "stt" : startTs,
        "edt" : endTs,
        "dis" : 1022,
        "stlat" : latitudeValue[0],
        "stlon" : longitudeValue[0],
        "edlat" : latitudeValue[config.microTripCnt - 1],
        "edlon" : longitudeValue[config.microTripCnt - 1],
        "hsts" : 90,
        "mesp" : 56,
        "fwv" : "1.0.1",
        "dtvt" : 102
      }
  };

  messageSender.publish(config.sendingTopic, JSON.stringify(trip), {qos: 1}, function(){
    console.log(colors.yellow('Successfully sending a Trip message to Smart[Fleet] Platform'));
    console.log(colors.yellow('Message : ' + JSON.stringify(trip)));
    console.log(colors.yellow(''));
  });

  intervalSender();
}

// Subscribe the RPC topic
function subscribeRPCTopic(){

    messageSender.subscribe(config.rpcReqTopic, {qos: 1}, function() {
      // Response it as a callback
      console.log(colors.yellow('Successfully Subscribe the RPC topic to Smart[Fleet] Platform'));
      console.log(colors.yellow(''));

    });
}

// Publish the RPC Result
function responseRPCRequest(arg){

    var sendingMessageObj = {
      "results" : 2000
    };

    var sendingMessageJSON = JSON.stringify(sendingMessageObj);

    messageSender.publish(config.rpcResTopic + arg, sendingMessageJSON, {qos: 1}, function() {
      console.log(colors.magenta('Successfully sending a RPC Response message to Smart[Fleet] Platform'));
      console.log(colors.magenta('Message : ' + sendingMessageJSON));
      console.log(colors.magenta(''));
    });

    setTimeout(resultRPCpublish, 2000, arg) ;
}

function resultRPCpublish(arg){

  var sendingMessageObj = {
    "results" : 2000,
    "additionalInfo" : {
      "rusage" : {
          "recv" : 100,
          "stime" : 200
      } 
    }
  };

  var sendingResultJSON = JSON.stringify(sendingMessageObj);

  messageSender.publish(config.rpcRstTopic + arg, sendingResultJSON, {qos: 1}, function() {
    console.log(colors.magenta('Successfully sending a RPC Result to Smart[Fleet] Platform'));
    console.log(colors.magenta('Message : ' + sendingResultJSON));
    console.log(colors.magenta(''));
  });
}