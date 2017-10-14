# Smart[Fleet] Device Simulator

본 시뮬레이터는 SKT의 Smart[Fleet] 플랫폼 프로토콜을 따르는 ``GPS``, ``OBD`` 단말의 동작을 나타내는 시뮬레이터입니다. 

본 시뮬레이터는 Smart[Fleet] 플랫폼의 [기술문서](http://smart-fleet-docs.readthedocs.io/ko/latest/)를 기반으로 구성되어 있습니다. 상세한 프로토콜은 상기 기술문서를 참고하세요.
<br>
<br>
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
<br>

### Device Simulator 구성

본 시뮬레이터는 ``node.js`` 기반으로 구현되어 있으며, 기술 규격에 따라 ``MQTT``프로토콜에 준수하여 개발이 되어 있습니다.

본 시뮬레이터에서 제공하는 단말 타입은 ``GPS``, ``OBD``이며, 각각의 단말 시뮬레이터의 파일명은 아래와 같습니다.

* device_GPS.js
* device_OBD.js

### Device Simulator 실행 방법

본 시뮬레이터를 동작을 위해서는 기본적으로 ``node.js``가 설치되어 있어야 합니다. ``node.js``의 설치 방법은 [node.js 홈페이지](https://nodejs.org)를 참고하시길 부탁 드립니다.

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
    userName : '{Please input your access token}',
    updateInterval : 2000,
    microTripCnt : 10,

}

```
### Device Simulator 정상 동작 예시

정상적으로 설정된 Device Simulator의 동작 예시입니다.

[GPS Device]

```
Connecting to Smart[Fleet] Platform
[Flow #1] Connected Smart[Fleet] Platform
ClientID : trf3c541487
[Flow #2] Successfully Subscribe the RPC topic to Smart[Fleet] Platform

[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform
Message : {"ty":2,"ts":1507968690899,"ap":0,"pld":{"tid":1,"lon":127.062512,"lat":37.510296,"alt":118,"sp":62,"dop":20,"nos":3,"clt":1507968690899}}

[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform
Message : {"ty":2,"ts":1507968692903,"ap":0,"pld":{"tid":1,"lon":127.061969,"lat":37.511334,"alt":116,"sp":62,"dop":13,"nos":2,"clt":1507968692903}}

[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform
Message : {"ty":2,"ts":1507968694909,"ap":0,"pld":{"tid":1,"lon":127.061426,"lat":37.512353,"alt":102,"sp":74,"dop":21,"nos":4,"clt":1507968694909}}

[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform
Message : {"ty":2,"ts":1507968696911,"ap":0,"pld":{"tid":1,"lon":127.060685,"lat":37.513743,"alt":118,"sp":84,"dop":20,"nos":2,"clt":1507968696911}}

[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform
Message : {"ty":2,"ts":1507968698915,"ap":0,"pld":{"tid":1,"lon":127.060067,"lat":37.51477,"alt":104,"sp":51,"dop":17,"nos":2,"clt":1507968698915}}

[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform
Message : {"ty":2,"ts":1507968700918,"ap":0,"pld":{"tid":1,"lon":127.0592,"lat":37.516314,"alt":111,"sp":82,"dop":14,"nos":3,"clt":1507968700918}}

[Flow #5] Receive the RPC Message
Topic :v1/sensors/me/rpc/request/4f355b10-b0b7-11e7-8c12-ed6c4a5c999b
{"method":"d","params":{"pin":"23","value":1}}

[Flow #6] Successfully sending a RPC Response message to Smart[Fleet] Platform
Message : {"results":2000}

[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform
Message : {"ty":2,"ts":1507968702924,"ap":0,"pld":{"tid":1,"lon":127.058356,"lat":37.517931,"alt":118,"sp":65,"dop":18,"nos":2,"clt":1507968702924}}

[Flow #8] Successfully sending a RPC Result to Smart[Fleet] Platform
Message : {"results":2000,"additionalInfo":{"rusage":{"recv":100,"stime":200}}}

[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform
Message : {"ty":2,"ts":1507968704929,"ap":0,"pld":{"tid":1,"lon":127.057246,"lat":37.519846,"alt":115,"sp":70,"dop":16,"nos":3,"clt":1507968704929}}

[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform
Message : {"ty":2,"ts":1507968706933,"ap":0,"pld":{"tid":1,"lon":127.056837,"lat":37.520759,"alt":101,"sp":61,"dop":20,"nos":6,"clt":1507968706933}}

[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform
Message : {"ty":2,"ts":1507968708933,"ap":0,"pld":{"tid":1,"lon":127.063228,"lat":37.509141,"alt":120,"sp":84,"dop":18,"nos":3,"clt":1507968708933}}

[Flow #3] Successfully sending a Trip message to Smart[Fleet] Platform
Message : {"ty":1,"ts":1507968708934,"pld":{"tid":1,"stt":1507968690899,"edt":1507968708933,"dis":1022,"stlat":37.509141,"stlon":127.063228,"edlat":37.520759,"edlon":127.056837,"hsts":90,"mesp":56,"fwv":"1.0.1","dtvt":102}}
```





