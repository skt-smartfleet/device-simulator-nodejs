# Smart[Fleet] Device Simulator

본 시뮬레이터는 SKT의 Smart[Fleet] 플랫폼 프로토콜을 따르는 ``GPS``, ``OBD`` 단말의 동작을 나타내는 시뮬레이터입니다. 

본 시뮬레이터는 Smart[Fleet] 플랫폼의 [기술문서](http://smart-fleet-docs.readthedocs.io/ko/latest/)를 기반으로 구성되어 있습니다. 상세한 프로토콜은 상기 기술문서를 참고하세요.

## Smart[Fleet] Device Simulator Flow

본 시뮬레이터는 아래의 Flow를 기반으로 작성되어 있으며, 아래의 Flow는 [단말 프로시저 규격](http://smart-fleet-docs.readthedocs.io/ko/latest/procedure/)와 [단말 전송 메시지 규격](http://smart-fleet-docs.readthedocs.io/ko/latest/message/)을 참고 바랍니다.

![Connectionflow](https://github.com/skt-smartfleet/device-simulator/blob/master/images/flow_1.png)

하기 제공되는 각 단말 시뮬레이터의 코드에는 상기 Flow의 순서가 주석으로 표기되어 있으니, 각 순서를 코드와 매핑하여 이해하시면 됩니다.

```
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
```

### Device Simulator 구성

본 시뮬레이터는 ``node.js`` 기반으로 구현되어 있으며, 기술 규격에 따라 ``MQTT``프로토콜에 준수하여 개발이 되어 있습니다.

본 시뮬레이터에서 제공하는 단말 타입은 ``GPS``, ``OBD``이며, 각각의 단말 시뮬레이터의 파일명은 아래와 같습니다.

* device_GPS.js
* device_OBD.js

### Device Simulator 실행 방법

본 시뮬레이터를 동작을 위해서는 기본적으로 ``node.js``가 설치되어 있어야 합니다. ``node.js``의 섦치 방법은 [node.js 홈페이지](https://nodejs.org)를 참고하시길 부탁 드립니다.

```
git clone https://github.com/skt-smartfleet/device-simulator.git

npm install

node device_GPS
```

### Device Simulator 설정 방법

본 시뮬레이터 동작을 위한 설정은 본 Repository의 ``config.js`` 파일에 기술되어 있으며, 해당 설정을 수정하므로, 각자에 상황에 맞추어 시뮬레이션을 수행할 수 있습니다.

아래 코드의 내용 중에서 수정이 필요한 사항은 다음과 같습니다.

Key                 |  Description                            |
--------------------|-----------------------------------------|
userName            | MQTT Conection에 명시하는 ``username`` 값으로 본 값은 사전에 시뮬레이터 사용을 인가 받은 업체 만 접속이 가능하며, 시뮬레이터 사용을 위해서는 본 Repository Issue([Link](https://github.com/skt-smartfleet/device-simulator/issues))에 이슈 등록 부탁 드립니다.
updateInterval      | 단말이 메시지를 업로드 하는 주기를 명시합니다. (msec)
microtripcnt        | 단말이 주기 정보를 보내는 총 갯수를 명시합니다.



```
module.exports = {

    Host : 'smartfleet.sktelecom.com',
    Port : '8883',
    HttpPort : '9000',

    // 20-digits Device Access Token given by manufacturer
    // Please input your access token
    userName : 'aaaabbbbccccddddeeeg', 
    
    updateInterval : 2000,
    microTripCnt : 10,

}
```




