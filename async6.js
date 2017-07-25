var rp = require('request-promise');
var uuidV4 = require('uuid/v4');
var _ = require('lodash');

var TPLINK_USER = process.env.TPLINK_USER ;
var TPLINK_PASS = process.env.TPLINK_PASS ;
var TPLINK_TERM = process.env.TPLINK_TERM || uuidV4();

var params = {
  appName: 'Kasa_Android',
  termID: TPLINK_TERM,
  appVer: '1.4.4.607',
  ospf: 'Android+6.0.1',
  netType: 'wifi',
  locale: 'es_ES'
};

const login_payload = JSON.stringify( { "method": "login", "url": "https://wap.tplinkcloud.com",
    "params":{
      "appType": "Kasa_Android",
      "cloudPassword": TPLINK_PASS,
      "cloudUserName": TPLINK_USER,
      "terminalUUID": TPLINK_TERM
    }
  }
);

const login_request = {
  method: 'POST',
  uri: "https://wap.tplinkcloud.com",
  qs: params,
  body: login_payload,
  headers: {
    'Connection': 'Keep-Alive',
    'Content-Type': 'application/json',
    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/M4B30X)'
  },
};

function get_device( deviceList, alias ) {
    return _.find( deviceList , { "alias": alias } );
}

function hs100_set_relay_state( myDevice, state) {
  /* list: TPLink device list
     alias: the alias of your HS100 plug
     state: the state you want to switch your plug to (1: on, 0: off)
  */

  let power_payload = {
    "method":"passthrough",
    "params": {
      "deviceId": myDevice.deviceId,
      "requestData": JSON.stringify( {"system":{"set_relay_state":{"state": state }}} )
    }
  }

  let power_request = { method: 'POST',
    url: myDevice.appServerUrl,
    qs: params,
    headers:
     { 'cache-control': 'no-cache',
       'content-type': 'application/json' },
    body: JSON.stringify( power_payload )
  }

  return rp( power_request )
}

async function hs100_get_sysinfo( myDevice ) {
  /* list: TPLink device list
     alias: the alias of your HS100 plug
     state: the state you want to switch your plug to (1: on, 0: off)
  */

  let sysinfo_payload = {
    "method":"passthrough",
    "params": {
      "deviceId": myDevice.deviceId,
      "requestData": JSON.stringify( {"system":{"get_sysinfo":null},"emeter":{"get_realtime":null}} )
    }
  }

  let sysinfo_request = { method: 'POST',
    url: myDevice.appServerUrl,
    qs: params,
    headers:
     { 'cache-control': 'no-cache',
       'content-type': 'application/json' },
    body: JSON.stringify( sysinfo_payload )
  }

  let result = await rp( sysinfo_request );
  return JSON.parse(result).result.responseData;
}

async function doRequests() {
  let response, token

  // Step 1: login to TP-Link cloud API and get a token
  response = await rp( login_request )

  token = JSON.parse(response).result.token;
  params.token = token

  var tplink_getDeviceList = {
    method: 'POST',
    uri: 'https://wap.tplinkcloud.com',
    qs: { token: token },
    body: JSON.stringify( {method:"getDeviceList"} ),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  response = await rp( tplink_getDeviceList )
  deviceList = JSON.parse(response).result.deviceList

  let myPlug=get_device(deviceList, "My Smart Plug");

  // Example: Power On/Off a plug (blocking call and get response)
  response = await hs100_set_relay_state(myPlug, 1);
  console.log(response)

  // Example: retrieve a plug state information (blocking call and get response)
  response = await hs100_get_sysinfo( myPlug );
  var relay_state=JSON.parse(response).system.get_sysinfo.relay_state;
  console.log("relay_state: " + relay_state);

  // non-blocking calls, don't wait for response (multiple plugs in parallel):

  // hs100_set_relay_state( get_device(deviceList, "My Smart Plug 1"), 1);
  // hs100_set_relay_state( get_device(deviceList, "My Smart Plug 2"), 0);
  // hs100_set_relay_state( get_device(deviceList, "My Smart Plug 3"), 2);
}

doRequests().catch(err => console.log) // Don't forget to catch errors
