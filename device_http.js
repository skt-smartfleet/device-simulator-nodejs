'use strict';

var colors = require('colors');
var config = require('./config');
var httpReq = require('./promise-http').request;

var IntervalFunction;
var resultReq;

var i = 0;

var latitudeValue = [ 37.380646, 37.381709, 37.380241, 37.378891, 37.377187, 37.376293, 37.375395, 37.377185, 37.379274, 37.380005 ];
var longitudeValue = [ 127.117784, 127.116573, 127.114513, 127.112602, 127.110394, 127.111222, 127.112336, 127.114857, 127.117786, 127.118527 ];

console.log('Device Simulator Start!');

function IntervalProcess(){
   i++;
   httpReq({
     options : {
       host: config.TREHost,
       port: config.TREPort,
       path : '/api/v1/'+config.userName+'/telemetry',
       method: 'POST',
       headers : {
               'Content-Type': 'application/json'
       }
     },
     body : {
       fuelEfficient : (Math.floor(Math.random() * 10) + 10).toString(),
       speed : (Math.floor(Math.random() * 50) + 80).toString(),
       brake : (Math.floor(Math.random() * 1) + 0).toString(),
       longitude : longitudeValue[i % 10],
       latitude : latitudeValue[i % 10]
    }


  }).then(function(data){
     console.log(data.responseHeader);
   }).catch(function(err){
     console.log(colors.red('#####################################'));
     console.log(err);
   });
}

IntervalFunction = setInterval(IntervalProcess, config.updateInterval);
