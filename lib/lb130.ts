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

import lb100 from "./lb100";

// Should work for LB130, KB130, KL130
export default class LB130 extends lb100 {
  constructor(tpLink, deviceInfo) {
    super(tpLink, deviceInfo);
  }

  async setState(
    onOff: number,
    brightness?: number,
    hue?: number,
    saturation?: number,
    color_temp?: number
  ) {
    // on_off: 1 on, 0 off
    // brightness: 0-100
    // hue: 0-360
    // saturation: 0-100,
    // See HSB in http://colorizer.org/
    // color_temp: 2500-9000
    return await super.passthroughRequest({
      "smartlife.iot.smartbulb.lightingservice": {
        transition_light_state: {
          brightness,
          hue,
          saturation,
          color_temp,
          on_off: onOff
        }
      }
    });
  }
}
