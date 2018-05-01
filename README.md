# Smart[Fleet] Device Simulator

본 시뮬레이터는 SKT의 Smart[Fleet] 플랫폼 프로토콜을 따르는 ``GPS``, ``OBD``, ``ADAS``, ``BlackBox`` 단말의 동작을 나타내는 시뮬레이터입니다. 

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

본 시뮬레이터에서 제공하는 단말 타입은 ``GPS``, ``OBD``, ``ADAS``, ``BlackBox`` 이며 아래의 파일에 시뮬레이션 과정이 코딩되어 있습니다.

* device.js

### Device Simulator 실행 방법

본 시뮬레이터를 동작을 위해서는 기본적으로 ``node.js``가 설치되어 있어야 합니다. ``node.js``의 설치 방법은 [node.js 홈페이지](https://nodejs.org)를 참고하시길 부탁 드립니다.

```
git clone https://github.com/skt-smartfleet/device-simulator.git

npm install

node device
```

### Device Simulator 설정 방법

본 시뮬레이터 동작을 위한 설정은 본 Repository의 ``config.js`` 파일에 기술되어 있으며, 해당 설정을 수정하므로, 각자에 상황에 맞추어 시뮬레이션을 수행할 수 있습니다.

아래 코드의 내용 중에서 수정이 필요한 사항은 다음과 같습니다.

Key                 |  Description                            |
--------------------|-----------------------------------------|
userName            | MQTT Conection에 명시하는 ``username`` 항목으로 해당 항목에는 Smart[Fleet]에 정상적으로 등록된 단말임을 증명하는 ``AccessToken``값을 기입해야합니다. 시뮬레이션을 위한 20자리의 Token 값을 발급 받기위해서는 Repository Issue([Link](https://github.com/skt-smartfleet/device-simulator/issues))에 이슈 등록 부탁 드립니다.
updateInterval      | 단말이 메시지를 업로드 하는 주기를 명시합니다. (msec)
microtripcnt        | 단말이 주기 정보를 보내는 총 갯수를 명시합니다.
deviceType          | 시뮬레이션을 돌리고자 하는 디바이스 타입을 명시합니다. ``GPS``, ``OBD``, ``ADAS``, ``BlackBox``
messageCompression  | 단말 메시지 압축 필요 여부를 ``true``, ``false`` 로 명시합니다. 자세한 압축에 대한 내용은 http://smart-fleet-docs.readthedocs.io/ko/latest/bestpractice/#message-compression 을 참고 부탁 드립니다.
qos                 | 단말이 Smart[Fleet]에 전송하는 메시지 QoS를 명시합니다. MQTT QoS 개념이며, 모든 메시지는 ``1 - At least once`` 입니다.



```
module.exports = {
    Host : 'smartfleet.sktelecom.com',
    Port : '9900',
    
    userName : '{{User Token}}',
    
    updateInterval : 1000,
    microTripCnt : 10,
    deviceType : 'BlackBox',
    messageCompression : 'true',
    qos : 1
}
```
### Device Simulator 정상 동작 예시

정상적으로 설정된 Device Simulator의 동작 예시입니다.

[GPS Device - Compression]

``MessagePack``을 통해서 메시지를 압축하여 전송하는 경우에 대한 예입니다. 이 경우에는 아래와 같이 JSON이 Byte String으로 압축되어 전송되는 것을 볼 수 있으며, 압축률에 대해서 볼 수 있습니다.

추가로 Smart[Fleet]의 RPC 제어 API를 활용하여 제어를 수신하여 단말이 제어 결과를 전송하는 시뮬레이션 결과도 위의 명시된 Flow 번호를 통하여 확인하실 수 있습니다.

```
Connecting to Smart[Fleet] Platform
=================== Configuration =================
ClientID : trfbe821878
Device Type : GPS
MessagePack Compression Enabled : true
===================================================
[Flow #1] Connected Smart[Fleet] Platform

[Flow #2] Successfully Subscribe the RPC topic to Smart[Fleet] Platform

[Flow #3] Successfully sending a Compressed MicroTrip message to Smart[Fleet] Platform
Compression Ratio : 41.49%
Message [MessagePack | 196 Bytes] : 83a2747902a27473cf000001631a122d83a3706c649388a3746964cd012da36c6f6eca42fe2002a36c6174ca42160a8ba3616c7470a2737044a3646f700ba36e6f7305a3636c74cf000001631a122d7988a3746964cd012da36c6f6eca42fe2002a36c6174ca42160a8ba3616c746ba2737055a3646f700aa36e6f7305a3636c74cf000001631a122d7e88a3746964cd012da36c6f6eca42fe2002a36c6174ca42160a8ba3616c7464a2737033a3646f700ea36e6f7304a3636c74cf000001631a122d83

Message [JSON | 335 Bytes] : {
  "ty": 2,
  "ts": 1525150788995,
  "pld": [
    {
      "tid": 301,
      "lon": 127.062512,
      "lat": 37.510296,
      "alt": 112,
      "sp": 68,
      "dop": 11,
      "nos": 5,
      "clt": 1525150788985
    },
    {
      "tid": 301,
      "lon": 127.062512,
      "lat": 37.510296,
      "alt": 107,
      "sp": 85,
      "dop": 10,
      "nos": 5,
      "clt": 1525150788990
    },
    {
      "tid": 301,
      "lon": 127.062512,
      "lat": 37.510296,
      "alt": 100,
      "sp": 51,
      "dop": 14,
      "nos": 4,
      "clt": 1525150788995
    }
  ]
}

[Flow #3] Successfully sending a Compressed MicroTrip message to Smart[Fleet] Platform
Compression Ratio : 60.00%
Message [MessagePack | 134 Bytes] : 83a2747901a27473cf000001631a123176a3706c648ca3746964cd012da3737474cf000001631a122d83a3656474cf000001631a123173a3646973cd03fea573746c6174ca4216095ca573746c6f6eca42fe205fa565646c6174ca42160a8ba565646c6f6eca42fe2002a4687374735aa46d65737038a3667776a5312e302e31a46474767466

Message [JSON | 335 Bytes] : {
  "ty": 2,
  "ts": 1525150790003,
  "pld": [
    {
      "tid": 301,
      "lon": 127.063228,
      "lat": 37.509141,
      "alt": 110,
      "sp": 66,
      "dop": 20,
      "nos": 4,
      "clt": 1525150789993
    },
    {
      "tid": 301,
      "lon": 127.063228,
      "lat": 37.509141,
      "alt": 116,
      "sp": 52,
      "dop": 15,
      "nos": 6,
      "clt": 1525150789998
    },
    {
      "tid": 301,
      "lon": 127.063228,
      "lat": 37.509141,
      "alt": 111,
      "sp": 85,
      "dop": 13,
      "nos": 6,
      "clt": 1525150790003
    }
  ]
}

[Flow #3] Successfully sending a Compressed Trip message to Smart[Fleet] Platform
Compression Ratio : 37.67%
Message [MessagePack | 134 Bytes] : 83a2747901a27473cf000001631a123176a3706c648ca3746964cd012da3737474cf000001631a122d83a3656474cf000001631a123173a3646973cd03fea573746c6174ca4216095ca573746c6f6eca42fe205fa565646c6174ca42160a8ba565646c6f6eca42fe2002a4687374735aa46d65737038a3667776a5312e302e31a46474767466

Message [JSON | 215 Bytes] : {
  "ty": 1,
  "ts": 1525150790006,
  "pld": {
    "tid": 301,
    "stt": 1525150788995,
    "edt": 1525150790003,
    "dis": 1022,
    "stlat": 37.509141,
    "stlon": 127.063228,
    "edlat": 37.510296,
    "edlon": 127.062512,
    "hsts": 90,
    "mesp": 56,
    "fwv": "1.0.1",
    "dtvt": 102
  }
}

[Flow #3] Successfully sending a Compressed MicroTrip message to Smart[Fleet] Platform
Compression Ratio : 41.49%
Message [MessagePack | 196 Bytes] : 83a2747902a27473cf000001631a123560a3706c649388a3746964cd012ea36c6f6eca42fe2002a36c6174ca42160a8ba3616c7466a273704ea3646f7010a36e6f7306a3636c74cf000001631a12355688a3746964cd012ea36c6f6eca42fe2002a36c6174ca42160a8ba3616c7474a273704da3646f700ea36e6f7303a3636c74cf000001631a12355b88a3746964cd012ea36c6f6eca42fe2002a36c6174ca42160a8ba3616c7464a273703ba3646f700da36e6f7305a3636c74cf000001631a123560

Message [JSON | 335 Bytes] : {
  "ty": 2,
  "ts": 1525150791008,
  "pld": [
    {
      "tid": 302,
      "lon": 127.062512,
      "lat": 37.510296,
      "alt": 102,
      "sp": 78,
      "dop": 16,
      "nos": 6,
      "clt": 1525150790998
    },
    {
      "tid": 302,
      "lon": 127.062512,
      "lat": 37.510296,
      "alt": 116,
      "sp": 77,
      "dop": 14,
      "nos": 3,
      "clt": 1525150791003
    },
    {
      "tid": 302,
      "lon": 127.062512,
      "lat": 37.510296,
      "alt": 100,
      "sp": 59,
      "dop": 13,
      "nos": 5,
      "clt": 1525150791008
    }
  ]
}

[Flow #3] Successfully sending a Compressed MicroTrip message to Smart[Fleet] Platform
Compression Ratio : 60.00%
Message [MessagePack | 134 Bytes] : 83a2747901a27473cf000001631a12394da3706c648ca3746964cd012ea3737474cf000001631a123560a3656474cf000001631a12394ca3646973cd03fea573746c6174ca4216095ca573746c6f6eca42fe205fa565646c6174ca42160a8ba565646c6f6eca42fe2002a4687374735aa46d65737038a3667776a5312e302e31a46474767466

Message [JSON | 335 Bytes] : {
  "ty": 2,
  "ts": 1525150792012,
  "pld": [
    {
      "tid": 302,
      "lon": 127.063228,
      "lat": 37.509141,
      "alt": 117,
      "sp": 84,
      "dop": 12,
      "nos": 5,
      "clt": 1525150792002
    },
    {
      "tid": 302,
      "lon": 127.063228,
      "lat": 37.509141,
      "alt": 119,
      "sp": 60,
      "dop": 14,
      "nos": 6,
      "clt": 1525150792007
    },
    {
      "tid": 302,
      "lon": 127.063228,
      "lat": 37.509141,
      "alt": 119,
      "sp": 65,
      "dop": 11,
      "nos": 6,
      "clt": 1525150792012
    }
  ]
}

[Flow #3] Successfully sending a Compressed Trip message to Smart[Fleet] Platform
Compression Ratio : 37.67%
Message [MessagePack | 134 Bytes] : 83a2747901a27473cf000001631a12394da3706c648ca3746964cd012ea3737474cf000001631a123560a3656474cf000001631a12394ca3646973cd03fea573746c6174ca4216095ca573746c6f6eca42fe205fa565646c6174ca42160a8ba565646c6f6eca42fe2002a4687374735aa46d65737038a3667776a5312e302e31a46474767466

Message [JSON | 215 Bytes] : {
  "ty": 1,
  "ts": 1525150792013,
  "pld": {
    "tid": 302,
    "stt": 1525150791008,
    "edt": 1525150792012,
    "dis": 1022,
    "stlat": 37.509141,
    "stlon": 127.063228,
    "edlat": 37.510296,
    "edlon": 127.062512,
    "hsts": 90,
    "mesp": 56,
    "fwv": "1.0.1",
    "dtvt": 102
  }
}

[Flow #3] Successfully sending a Compressed MicroTrip message to Smart[Fleet] Platform
Compression Ratio : 41.49%
Message [MessagePack | 196 Bytes] : 83a2747902a27473cf000001631a123d38a3706c649388a3746964cd012fa36c6f6eca42fe2002a36c6174ca42160a8ba3616c7476a273704ba3646f7011a36e6f7304a3636c74cf000001631a123d2e88a3746964cd012fa36c6f6eca42fe2002a36c6174ca42160a8ba3616c7477a2737047a3646f700ba36e6f7302a3636c74cf000001631a123d3388a3746964cd012fa36c6f6eca42fe2002a36c6174ca42160a8ba3616c746aa273704ea3646f700ca36e6f7303a3636c74cf000001631a123d38

Message [JSON | 335 Bytes] : {
  "ty": 2,
  "ts": 1525150793016,
  "pld": [
    {
      "tid": 303,
      "lon": 127.062512,
      "lat": 37.510296,
      "alt": 118,
      "sp": 75,
      "dop": 17,
      "nos": 4,
      "clt": 1525150793006
    },
    {
      "tid": 303,
      "lon": 127.062512,
      "lat": 37.510296,
      "alt": 119,
      "sp": 71,
      "dop": 11,
      "nos": 2,
      "clt": 1525150793011
    },
    {
      "tid": 303,
      "lon": 127.062512,
      "lat": 37.510296,
      "alt": 106,
      "sp": 78,
      "dop": 12,
      "nos": 3,
      "clt": 1525150793016
    }
  ]
}

[Flow #5] Receive the RPC Message from Smart[Fleet]
Topic :v1/sensors/me/rpc/request/7c598030-4cfc-11e8-abb5-7994c152274f
Message : {
  "method": "d",
  "params": {
    "pin": "23",
    "value": 1
  }
}

[Flow #6] Successfully sending a RPC Response message to Smart[Fleet] Platform
Message : {
  "results": 2000
}

[Flow #3] Successfully sending a Compressed MicroTrip message to Smart[Fleet] Platform
Compression Ratio : 60.00%
Message [MessagePack | 134 Bytes] : 83a2747901a27473cf000001631a124123a3706c648ca3746964cd012fa3737474cf000001631a123d38a3656474cf000001631a124122a3646973cd03fea573746c6174ca4216095ca573746c6f6eca42fe205fa565646c6174ca42160a8ba565646c6f6eca42fe2002a4687374735aa46d65737038a3667776a5312e302e31a46474767466

Message [JSON | 335 Bytes] : {
  "ty": 2,
  "ts": 1525150794018,
  "pld": [
    {
      "tid": 303,
      "lon": 127.063228,
      "lat": 37.509141,
      "alt": 109,
      "sp": 74,
      "dop": 10,
      "nos": 6,
      "clt": 1525150794008
    },
    {
      "tid": 303,
      "lon": 127.063228,
      "lat": 37.509141,
      "alt": 103,
      "sp": 71,
      "dop": 11,
      "nos": 6,
      "clt": 1525150794013
    },
    {
      "tid": 303,
      "lon": 127.063228,
      "lat": 37.509141,
      "alt": 117,
      "sp": 64,
      "dop": 19,
      "nos": 5,
      "clt": 1525150794018
    }
  ]
}

[Flow #3] Successfully sending a Compressed Trip message to Smart[Fleet] Platform
Compression Ratio : 37.67%
Message [MessagePack | 134 Bytes] : 83a2747901a27473cf000001631a124123a3706c648ca3746964cd012fa3737474cf000001631a123d38a3656474cf000001631a124122a3646973cd03fea573746c6174ca4216095ca573746c6f6eca42fe205fa565646c6174ca42160a8ba565646c6f6eca42fe2002a4687374735aa46d65737038a3667776a5312e302e31a46474767466

Message [JSON | 215 Bytes] : {
  "ty": 1,
  "ts": 1525150794019,
  "pld": {
    "tid": 303,
    "stt": 1525150793016,
    "edt": 1525150794018,
    "dis": 1022,
    "stlat": 37.509141,
    "stlon": 127.063228,
    "edlat": 37.510296,
    "edlon": 127.062512,
    "hsts": 90,
    "mesp": 56,
    "fwv": "1.0.1",
    "dtvt": 102
  }
}

[Flow #3] Successfully sending a Compressed MicroTrip message to Smart[Fleet] Platform
Compression Ratio : 41.49%
Message [MessagePack | 196 Bytes] : 83a2747902a27473cf000001631a12450ea3706c649388a3746964cd0130a36c6f6eca42fe2002a36c6174ca42160a8ba3616c746da2737054a3646f7011a36e6f7302a3636c74cf000001631a12450488a3746964cd0130a36c6f6eca42fe2002a36c6174ca42160a8ba3616c7472a2737052a3646f700ba36e6f7305a3636c74cf000001631a12450988a3746964cd0130a36c6f6eca42fe2002a36c6174ca42160a8ba3616c7468a2737039a3646f7011a36e6f7303a3636c74cf000001631a12450e

Message [JSON | 335 Bytes] : {
  "ty": 2,
  "ts": 1525150795022,
  "pld": [
    {
      "tid": 304,
      "lon": 127.062512,
      "lat": 37.510296,
      "alt": 109,
      "sp": 84,
      "dop": 17,
      "nos": 2,
      "clt": 1525150795012
    },
    {
      "tid": 304,
      "lon": 127.062512,
      "lat": 37.510296,
      "alt": 114,
      "sp": 82,
      "dop": 11,
      "nos": 5,
      "clt": 1525150795017
    },
    {
      "tid": 304,
      "lon": 127.062512,
      "lat": 37.510296,
      "alt": 104,
      "sp": 57,
      "dop": 17,
      "nos": 3,
      "clt": 1525150795022
    }
  ]
}

[Flow #8] Successfully sending a RPC Result to Smart[Fleet] Platform
Message : {
  "results": 2000,
  "additionalInfo": {
    "rusage": {
      "recv": 100,
      "stime": 200
    }
  }
}
```

[BlackBox Device - Non-Compression]

아래 예제는 블랙박스 단말이 메시지 압축 없이 메세지를 전송하고 RPC 제어를 하는 예정입니다. 

```
Connecting to Smart[Fleet] Platform
=================== Configuration =================
ClientID : trf9f81a2f2
Device Type : BlackBox
MessagePack Compression Enabled : false
===================================================
[Flow #1] Connected Smart[Fleet] Platform

[Flow #2] Successfully Subscribe the RPC topic to Smart[Fleet] Platform

[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform

Message [JSON | 114 Bytes] : {
  "ty": 8,
  "try": 1,
  "ts": 1525151137435,
  "pld": {
    "tid": 301,
    "lon": 127.062512,
    "lat": 37.510296,
    "try": 1,
    "sp": 75,
    "rssi": 1023
  }
}

[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform

Message [JSON | 114 Bytes] : {
  "ty": 8,
  "try": 1,
  "ts": 1525151139438,
  "pld": {
    "tid": 301,
    "lon": 127.061969,
    "lat": 37.511334,
    "try": 1,
    "sp": 89,
    "rssi": 1023
  }
}

[Flow #5] Receive the RPC Message from Smart[Fleet]
Topic :v1/sensors/me/rpc/request/4b3dac50-4cfd-11e8-abb5-7994c152274f
Message : {
  "method": "d",
  "params": {
    "pin": "23",
    "value": 1
  }
}

[Flow #6] Successfully sending a RPC Response message to Smart[Fleet] Platform
Message : {
  "results": 2000
}

[Flow #3] Successfully sending a MicroTrip message to Smart[Fleet] Platform

Message [JSON | 114 Bytes] : {
  "ty": 8,
  "try": 1,
  "ts": 1525151141440,
  "pld": {
    "tid": 301,
    "lon": 127.063228,
    "lat": 37.509141,
    "try": 1,
    "sp": 75,
    "rssi": 1023
  }
}

[Flow #3] Successfully sending a Trip message to Smart[Fleet] Platform

Message [JSON | 97 Bytes] : {
  "ty": 7,
  "ts": 1525151141441,
  "pld": {
    "tid": 301,
    "lat": 37.511334,
    "lon": 127.061969,
    "try": 1,
    "vlt": 12.1
  }
}

[Flow #8] Successfully sending a RPC Result to Smart[Fleet] Platform
Message : {
  "results": 2000,
  "additionalInfo": {
    "rusage": {
      "recv": 100,
      "stime": 200
    }
  }
}
```



