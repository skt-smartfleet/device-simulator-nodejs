/**
 * Created by hb.ahn@sk.com on 11/07/2017.
 */

module.exports = {

    Host : 'smartfleet.sktelecom.com',
    Port : '8883',
    HttpPort : '9000',

    // 20-digits Device Access Token given by manufacturer
    userName : 'aaaabbbbccccddddeeeg', // Please input your access token
    //passWord : '',

    smartFleetClientId : function() {
        var PRE_FIX = 'trf';
        return PRE_FIX + Math.random().toString(16).substr(2, 8);
    },

    sendingTopic : 'v1/sensors/me/tre',
    rpcReqTopic : 'v1/sensors/me/rpc/request/+',
    rpcResTopic : 'v1/sensors/me/rpc/response/',
    rpcRstTopic : 'v1/sensors/me/rpc/result/',
    updateInterval : 2000,
    microTripCnt : 10,

}
