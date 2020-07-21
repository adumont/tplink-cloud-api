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

import device from "./device";

// Should work for LB100, LB110, KB100, KL100, KL50, KL60
export default class LB100 extends device {
  constructor(tpLink, deviceInfo) {
    super(tpLink, deviceInfo);
    this.genericType = "bulb";
  }

  async getState() {
    const r = await super.passthroughRequest({
      "smartlife.iot.smartbulb.lightingservice": {
        get_light_state: {}
      }
    });
    return r["smartlife.iot.smartbulb.lightingservice"]["get_light_state"];
  }

  async isOn() {
    return (await this.getState()).on_off === 1;
  }

  async isOff() {
    return !(await this.isOn());
  }

  async powerOn() {
    return this.setState(1);
  }

  async powerOff() {
    return this.setState(0);
  }

  async toggle() {
    const s = await this.getState();
    return await this.setState(s.on_off === 0 ? 1 : 0);
  }

  async transition_light_state(onOff, brightness) {
    // TODO remove
    return this.setState(onOff, brightness);
  }

  protected async setState(
    onOff: number,
    brightness?: number,
    unusued?: any,
    unusued2?: any
  ) {
    // on_off: 1 on, 0 off
    // brightness: 0-100
    return await super.passthroughRequest({
      "smartlife.iot.smartbulb.lightingservice": {
        transition_light_state: { brightness, on_off: onOff }
      }
    });
  }
}
