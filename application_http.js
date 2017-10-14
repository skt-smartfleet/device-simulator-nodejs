'use strict';

var colors = require('colors');
var config = require('./config');
var httpReq = require('./promise-http').request;


var resultReq;


console.log('Application RPC Request and Response Simulator Start!');

httpReq({
  options : {
    host: config.TREHost,
    port: config.TREHttpPort,
    path: '/api/plugins/rpc/twoway/' + config.sensorId,
    method: 'POST',
    headers: {
            'Content-Type' : 'application/json',
            'X-Authorization' : 'bearer ' + config.jwt_token
    }
  },
  body : {
    method : 'factoryReset',
    param : 'test'
  }

  }).then(function(data){
     console.log(colors.red('HTTP Response'));
     console.log(colors.red('StatusCode :' + data.statusCode));
     console.log(colors.red('response :' + data.data));
   }).catch(function(err){
     console.log(colors.red('#####################################'));
     console.log(err);
   });
