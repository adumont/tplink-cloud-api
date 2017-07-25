var rp = require('request-promise');
var _ = require('lodash');

class HS100 {
  constructor(tpLink, alias){
    this.tpLink = tpLink;
    this.alias = alias;
    this.deviceInfo = _.find( tpLink.deviceList , { "alias": alias } );
  }

  getDeviceId() {
    return this.deviceInfo.deviceId;
  }

  static async login(user,passwd,termid){

    const params = {
      appName: 'Kasa_Android',
      termID: termid,
      appVer: '1.4.4.607',
      ospf: 'Android+6.0.1',
      netType: 'wifi',
      locale: 'es_ES'
    };

    const login_payload = JSON.stringify( { "method": "login", "url": "https://wap.tplinkcloud.com",
        "params":{
          "appType": "Kasa_Android",
          "cloudPassword": passwd,
          "cloudUserName": user,
          "terminalUUID": termid
        }
      }
    );

    const request = {
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

    const response = await rp( request );
    const token = JSON.parse(response).result.token;
    return new TPLink(token, termid);
  }

}

module.exports = HS100;
