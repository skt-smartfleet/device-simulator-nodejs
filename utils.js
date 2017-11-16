module.exports = {
        
    randomIntFromInterval : function (min, max)
    {
        return Math.floor(Math.random() * ( max - min + 1 ) + min);
    },

    smartFleetClientId : function() {
        var PRE_FIX = 'trf';
        return PRE_FIX + Math.random().toString(16).substr(2, 8);
    },

    sendingTopic : 'v1/sensors/me/tre',
    telemetryTopic : 'v1/sensors/me/telemetry',    
    rpcReqTopic : 'v1/sensors/me/rpc/request/+',
    rpcResTopic : 'v1/sensors/me/rpc/response/',
    rpcRstTopic : 'v1/sensors/me/rpc/result/',
}