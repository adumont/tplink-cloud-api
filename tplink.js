var rp = require('request-promise');

class TPLink {
  constructor(token, termid){
    this.token = token;
    this.termid = token;
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

  getToken() {
    return this.token;
  }

  async getDeviceList() {

    const params = {
      appName: 'Kasa_Android',
      termID: this.termid,
      appVer: '1.4.4.607',
      ospf: 'Android+6.0.1',
      netType: 'wifi',
      locale: 'es_ES',
      token: this.token
    };

    const request = {
      method: 'POST',
      uri: 'https://wap.tplinkcloud.com',
      qs: { token: this.token },
      body: JSON.stringify( {method:"getDeviceList"} ),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await rp( request )
    const deviceList = JSON.parse(response).result.deviceList
    this.deviceList = deviceList

    return deviceList
  }

}

module.exports = TPLink;
