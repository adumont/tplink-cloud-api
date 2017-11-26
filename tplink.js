/**
 * @package     tplink-cloud-api
 * @author      Alexandre Dumont <adumont@gmail.com>
 * @copyright   (C) 2017 - Alexandre Dumont
 * @license     https://www.gnu.org/licenses/gpl-3.0.txt
 * @link        http://itnerd.space
 */

/* This file is part of tplink-cloud-api.

tplink-cloud-api is free software: you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version.

tplink-cloud-api is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
tplink-cloud-api. If not, see http://www.gnu.org/licenses/. */

var axios = require('axios');
var uuidV4 = require('uuid/v4');
var HS100 = require("./hs100.js")
var HS110 = require("./hs110.js")
var LB100 = require("./lb100.js")
var LB130 = require("./lb130.js")
var find = require("lodash.find");

class TPLink {
  constructor(token, termid) {
    this.token = token;
    this.termid = termid;
  }

  static async login(user, passwd, termid = uuidV4()) {

    const params = {
      appName: 'Kasa_Android',
      termID: termid,
      appVer: '1.4.4.607',
      ospf: 'Android+6.0.1',
      netType: 'wifi',
      locale: 'es_ES'
    };

    const login_payload = {
      "method": "login", "url": "https://wap.tplinkcloud.com",
      "params": {
        "appType": "Kasa_Android",
        "cloudPassword": passwd,
        "cloudUserName": user,
        "terminalUUID": termid
      }
    };

    const request = {
      method: 'POST',
      url: 'https://wap.tplinkcloud.com',
      params: params,
      data: login_payload,
      headers: {
        'Connection': 'Keep-Alive',
        'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/M4B30X)'
      }
    };

    const response = await axios(request);
    const token = response.data.result.token;
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
      url: 'https://wap.tplinkcloud.com',
      params: { token: this.token },
      data: { method: "getDeviceList" }
    };

    const response = await axios(request)
    const deviceList = response.data.result.deviceList
    this.deviceList = deviceList

    return deviceList
  }

  // for an HS100 or HS110 smartplug
  getHS100(alias) {
    return new HS100(this, find(this.deviceList, { "alias": alias }));
  }

  getHS110(alias) {
    return new HS110(this, find(this.deviceList, { "alias": alias }));
  }

  // for an LB100, LB110 & LB120
  getLB100(alias) {
    return new LB100(this, find(this.deviceList, { "alias": alias }));
  }

  // for an LB130 lightbulb
  getLB130(alias) {
    return new LB130(this, find(this.deviceList, { "alias": alias }));
  }

}

module.exports = TPLink;
