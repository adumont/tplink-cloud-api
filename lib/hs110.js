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

require('babel-polyfill')

var TPLinkDevice = require('./device.js');
var HS100 = require('./hs100.js');

class HS110 extends HS100 {
  constructor(tpLink, deviceInfo) {
    super(tpLink, deviceInfo);
  }

  async getPowerUsage() {
    let r = await super.tplink_request({"emeter": {"get_realtime": null}})

    const resultParse = JSON.parse(r).result

    if (!resultParse) {
      return null
    }

    return JSON.parse(resultParse.responseData).emeter.get_realtime
  }

  async getDayStats(year, month) {
    let r = await super.tplink_request({"emeter": {"get_daystat": { 'year': year, 'month': month }}})

    const resultParse = JSON.parse(r).result

    if (!resultParse) {
      return null
    }

    return JSON.parse(resultParse.responseData).emeter.get_daystat.day_list
  }

  async getMonthStats(year) {
    let r = await super.tplink_request({"emeter": {"get_monthstat": { 'year': year }}})
    const resultParse = JSON.parse(r).result

    if (!resultParse) {
      return null
    }

    return JSON.parse(resultParse.responseData).emeter.get_monthstat.month_list
  }

  async isDeviceOn() {
    let res = await super.tplink_request({
      "smartlife.iot.smartbulb.lightingservice": {
        "get_light_state": {}
      }
    });
    res = JSON.parse(res);
    try {
      return res.result.responseData['smartlife.iot.smartbulb.lightingservice'].get_light_state.on_off === 1;
    } catch (_) {
      return false;
    }
  }
}

module.exports = HS110;

