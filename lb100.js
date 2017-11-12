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

// Should work for LB100, LB110 & LB120
class LB100 extends TPLinkDevice {
  constructor(tpLink, deviceInfo){
    super(tpLink, deviceInfo);
  }

  async transition_light_state(on_off, brightness){
    // on_off: 1 for On, 0 for Off
    // brightness: 0-100
    return await super.tplink_request( {
      "smartlife.iot.smartbulb.lightingservice": {
        "transition_light_state": { "on_off": on_off, "brightness": brightness } }
      }
    )
  }

}

module.exports = LB100;
