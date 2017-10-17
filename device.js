'use strict';

// for logging
var colors = require('colors');
var util = require('util');

// for importing mqtt
var mqtt = require('mqtt');

// for importing configuration
var config = require('./config');
var utils = require('./utils');


var clientIdSession = utils.smartFleetClientId();

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

var eventMarker = [ "00", "01", "00", "00", "10", "00", "00", "00", "00", "00", 
                       "00", "04", "00", "00", "00", "00", "00", "00", "04", "00", 
                       "00", "04", "00", "00", "20", "00", "10", "00", "00", "00", 
                       "00", "00", "10", "00", "00", "00", "00", "10", "00", "00", 
                       "00", "02", "00", "00", "00", "00", "00", "00", "00", "00" ];
   
   /*  
         0000 0001 :  01  - 급출발
         0000 0010 :  02  - 급좌회전
         0000 0100 :  04  - 급우회전
         0010 0000 :  20  - 급가속
         0001 0000 :  10  - 급감속
         0100 1000 :  48  - 급정지 & 급유턴 
         0001 0010 :  12  - 급감속 & 급좌회전
         0010 1010 :  2a  - 급가속 & 급유턴 & 급좌회전 
   
   */


var sequence = 0;
var IntervalFunction;
var tid = 300;
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

    console.log(colors.green('[Flow #1] Connected Smart[Fleet] Platform'));
    console.log(colors.blue('ClientID : ' + clientIdSession));
    console.log(colors.blue('Device Type : ' + config.deviceType));

    subscribeRPCTopic();
    intervalSender();

});

// Connection Error Callback
messageSender.on('error', function(error){
    console.log(colors.red(error));

});

//////////////////////////////////////////////////
// Flow #2 : Subscribe the Topic for RPC 
//////////////////////////////////////////////////

function subscribeRPCTopic(){
  
      messageSender.subscribe(utils.rpcReqTopic, {qos: 1}, function() {
        // Response it as a callback
        console.log(colors.yellow('[Flow #2] Successfully Subscribe the RPC topic to Smart[Fleet] Platform'));
        console.log(colors.yellow(''));
  
      });
  }


//////////////////////////////////////////////////
// Flow #3 : Publish MicroTrip Message
//////////////////////////////////////////////////

function sendingMicroTripMessage()
{
  sequence++;
  

  if (sequence == 1) {
    startTs = new Date().getTime();

  }
  if (sequence == config.microTripCnt) {
    endTs = new Date().getTime();
  }

  var microTrip_GPS = {
   "ty": 2,
   "ts": new Date().getTime(),
   "pld":
   [
    {
       "tid": tid,
       "lon": longitudeValue[sequence % config.microTripCnt],
       "lat": latitudeValue[sequence % config.microTripCnt],
       "alt" : utils.randomIntFromInterval(100, 120),
       "sp" : utils.randomIntFromInterval(50,90),
       "dop" : utils.randomIntFromInterval(10.5, 20.3),
       "nos" : utils.randomIntFromInterval(2,6),
       "clt" : new Date().getTime()-10
     },
     {
      "tid": tid,
      "lon": longitudeValue[sequence % config.microTripCnt],
      "lat": latitudeValue[sequence % config.microTripCnt],
      "alt" : utils.randomIntFromInterval(100, 120),
      "sp" : utils.randomIntFromInterval(50,90),
      "dop" : utils.randomIntFromInterval(10.5, 20.3),
      "nos" : utils.randomIntFromInterval(2,6),
      "clt" : new Date().getTime()-5
    },
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
  ]

  };

  var microTrip_OBD = {
    "ty": 2,
    "ts": new Date().getTime(),
    "pld": 
    [
      {
        "tid": tid,
        "fc" : utils.randomIntFromInterval(1499000, 1500000),
        "lon": longitudeValue[sequence % config.microTripCnt],
        "lat": latitudeValue[sequence % config.microTripCnt],
        "lc" : utils.randomIntFromInterval(70, 85),
        "clt" : new Date().getTime(),
        "cdlt" : utils.randomIntFromInterval(15, 25), 
        "rpm" : utils.randomIntFromInterval(1000, 1500),
        "sp" : utils.randomIntFromInterval(70, 100),
        "em" : eventMarker[ sequence ],
        "el" : utils.randomIntFromInterval(80.99, 98.99),
        "vv" : utils.randomIntFromInterval(10, 13),
        "tpos" : utils.randomIntFromInterval(80, 98)
      }
    ]
   };
   
  messageSender.publish(utils.sendingTopic, JSON.stringify(eval('microTrip_' + config.deviceType)), {qos: 0}, function(){
    console.log(colors.yellow('[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform'));
    console.log(colors.yellow('Message : ' + JSON.stringify(eval('microTrip_' + config.deviceType))));
    console.log(colors.yellow(''));
  });

  if ( sequence == config.microTripCnt ) {
    clearInterval(IntervalFunction);
    sendingTripMessage();
  }
}


//////////////////////////////////////////////////
// Flow #3 : Publish Trip Message
//////////////////////////////////////////////////

function sendingTripMessage(){

  var trip_GPS = {
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

  var trip_OBD = {
    "ty": 1,
    "ts": new Date().getTime(),
    "pld":
      {
        "tid" : tid,
        "stt" : startTs,
        "edt" : endTs,
        "dis" : 2559,
        "tdis" : 1023123,
        "fc" : utils.randomIntFromInterval(19500000, 200000000),
        "stlat" : latitudeValue[0],
        "stlon" : longitudeValue[0],
        "edlat" : latitudeValue[config.microTripCnt - 1],
        "edlon" : longitudeValue[config.microTripCnt - 1],
        "ctp" : 100,
        "coe" : 1231,
        "fct" : 1923,
        "hsts" : utils.randomIntFromInterval(90, 98),
        "mesp" : utils.randomIntFromInterval(40.1, 52.8),
        "idt" : 440,
        "btv" : 9.3,
        "gnv" : 14.6,
        "wut" : 300,
        "dtvt" : 100,
        "usm" : "010-1112-3333",
        "fwv" : "1.1.1",
        "est" : 132
      }
  };

  messageSender.publish(utils.sendingTopic, JSON.stringify(eval('trip_' + config.deviceType)), {qos: 1}, function(){
    console.log(colors.yellow('[Flow #3] Successfully sending a Trip message to Smart[Fleet] Platform'));
    console.log(colors.yellow('Message : ' + JSON.stringify(eval('trip_' + config.deviceType))));
    console.log(colors.yellow(''));
  });

  intervalSender();
}


//////////////////////////////////////////////////
// Flow #5 : Receive the RPC Message
// 본 시뮬레이터에서는 Subscribe 한 Topic에 메시지가 수신된 경우의 Callback을 5번 과정을 명시합니다.
//////////////////////////////////////////////////


messageSender.on('message', function(topic, message) {
    var msgs = message.toString();
    var topic = topic.toString();
    var requestId = topic.toString().split('/')[5];

    if (msgs != null){
      console.log(colors.magenta('[Flow #5] Receive the RPC Message'));
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

//////////////////////////////////////////////////
// Flow #6 : Publish Acknowledgement
//////////////////////////////////////////////////

function responseRPCRequest(arg){

    var sendingMessageObj = {
      "results" : 2000
    };

    var sendingMessageJSON = JSON.stringify(sendingMessageObj);

    messageSender.publish(utils.rpcResTopic + arg, sendingMessageJSON, {qos: 1}, function() {
      console.log(colors.magenta('[Flow #6] Successfully sending a RPC Response message to Smart[Fleet] Platform'));
      console.log(colors.magenta('Message : ' + sendingMessageJSON));
      console.log(colors.magenta(''));
    });


//////////////////////////////////////////////////
// Flow #7 : Operating the RPC
// 본 시뮬레이터에서는 2초 정도의 지연으로 RPC 수행을 대신합니다.
//////////////////////////////////////////////////

    setTimeout(resultRPCpublish, 2000, arg) ;
}


//////////////////////////////////////////////////
// Flow #8 : Publish RPC Result
//////////////////////////////////////////////////

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

  messageSender.publish(utils.rpcRstTopic + arg, sendingResultJSON, {qos: 1}, function() {
    console.log(colors.magenta('[Flow #8] Successfully sending a RPC Result to Smart[Fleet] Platform'));
    console.log(colors.magenta('Message : ' + sendingResultJSON));
    console.log(colors.magenta(''));
  });
}