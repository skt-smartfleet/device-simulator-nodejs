module.exports = {
        
    randomIntFromInterval : function (min, max)
    {
        return Math.floor(Math.random() * ( max - min + 1 ) + min);
    },

    compressRatio : function (compressed, origin)
    {
        return (((origin - compressed)/origin) * 100).toFixed(2);
    },

    smartFleetClientId : function() {
        var PRE_FIX = 'trf';
        return PRE_FIX + Math.random().toString(16).substr(2, 8);
    },

    JSONStringify : function (object) {
        for (var i = 0; i < object.length; i++) {
            console.log(JSON.stringify(object[i], 0, 2));
        }
    },

    sendingTopic : 'v1/sensors/me/tre',   
    rpcReqTopic : 'v1/sensors/me/rpc/request/+',
    rpcResTopic : 'v1/sensors/me/rpc/response/',
    rpcRstTopic : 'v1/sensors/me/rpc/result/',
    msgpackTopic : 'v1/sensors/me/mp/tre'
}