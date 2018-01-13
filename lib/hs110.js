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
var HS100 = require('./hs100.js');

class HS110 extends HS100 {
  constructor(tpLink, deviceInfo) {
    super(tpLink, deviceInfo);
  }

  async getPowerUsage() {
    let r = await super.tplink_request({"emeter": {"get_realtime": null}})
    return JSON.parse(JSON.parse(r).result.responseData).emeter.get_realtime
  }
}

module.exports = HS110;

