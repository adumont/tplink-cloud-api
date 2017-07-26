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

var rp = require('request-promise');

class HS100 {
  constructor(tpLink, deviceInfo){
    this.tpLink = tpLink;
    this.device = deviceInfo;
    this.params = {
      appName: 'Kasa_Android',
      termID: tpLink.termid,
      appVer: '1.4.4.607',
      ospf: 'Android+6.0.1',
      netType: 'wifi',
      locale: 'es_ES',
      token: tpLink.token
    };
  }

  getDeviceId() {
    return this.device.deviceId;
  }

  async powerOn() {
    return await this.set_relay_state(1)
  }

  async powerOff() {
    return await this.set_relay_state(0)
  }

  async set_relay_state(state){
    return await this.tplink_request( {"system":{"set_relay_state":{"state": state }}} )
  }

  async getScheduleRules(){
    return await this.tplink_request( {"schedule":{"get_rules":{}}} )
  }

  async get_relay_state(){
    let r = await this.getSysInfo()
    return r.relay_state
  }

  async getSysInfo(){
    let r = await this.tplink_request( {"system":{"get_sysinfo":null},"emeter":{"get_realtime":null}} )
    return JSON.parse( JSON.parse(r).result.responseData ).system.get_sysinfo
  }

  async tplink_request(command){
    let payload = {
      "method":"passthrough",
      "params": {
        "deviceId": this.device.deviceId,
        "requestData": JSON.stringify( command )
      }
    }

    let request = { method: 'POST',
      url: this.device.appServerUrl,
      qs: this.params,
      headers:
       { 'cache-control': 'no-cache',
         'content-type': 'application/json' },
      body: JSON.stringify( payload )
    }

    return await rp( request );
  }

}

module.exports = HS100;
