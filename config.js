
module.exports = {

    Host : 'smartfleet.sktelecom.com',
    // Staging Server
    // for production service, email "admin@smartfleet.sktelecom.com"
    Port : '9900',
    
    // 20-digits Device Access Token given by manufacturer in the {{User Token}} placeholder
    userName : 'hti97123451234512345',
    
    // Interval of microtrip (unit : msec)
    updateInterval : 2000,
    // Total count of Microtrips in a Trip 
    // ex) microTripCnt : 100 --> A Trip is (100 microtrips + 1 Trip)
    microTripCnt : 3,
    // Device Types : OBD, GPS, ADAS, BlackBox
    deviceType : 'BlackBox',
    // Message Pack Compression Message Compression : True or False
    messageCompression : 'false',
    // QoS configuration
    qos : 1
}
