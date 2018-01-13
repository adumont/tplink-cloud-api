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

var TPLinkDevice = require('./device.js');

class HS100 extends TPLinkDevice {
  constructor(tpLink, deviceInfo){
    super(tpLink, deviceInfo);
  }

  async powerOn() {
    return await this.set_relay_state(1)
  }

  async powerOff() {
    return await this.set_relay_state(0)
  }

  async set_relay_state(state){
    return await super.tplink_request( {"system":{"set_relay_state":{"state": state }}} )
  }

  async getScheduleRules(){
    return await super.tplink_request( {"schedule":{"get_rules":{}}} )
  }

  async toggle(){
    let s = await this.get_relay_state()
    return await this.set_relay_state( (s==0)?1:0)
  }

  async get_relay_state(){
    let r = await this.getSysInfo()
    return r.relay_state
  }

  async getSysInfo(){
    let r = await super.tplink_request( {"system":{"get_sysinfo":null},"emeter":{"get_realtime":null}} )
    return JSON.parse( JSON.parse(r).result.responseData ).system.get_sysinfo
  }

}

module.exports = HS100;
