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

export default class HS300child extends device {
  private child;

  constructor(tpLink, deviceInfo, child) {
    super(tpLink, deviceInfo);
    this.genericType = "plug";
    this.child = child;
  }

  async powerOn() {
    return await this.setRelayState(1);
  }

  async powerOff() {
    return await this.setRelayState(0);
  }

  async setRelayState(state) {
    return await super.passthroughRequest({
      context: { child_ids: [this.child.id] },
      system: { set_relay_state: { state } },
    });
  }
  async set_relay_state(state) {
    // TODO remove
    return this.setRelayState(state);
  }

  async getScheduleRules() {
    return await super.passthroughRequest({
      context: { child_ids: [this.child.id] },
      schedule: { get_rules: {} },
    });
  }

  async editScheduleRule(rule) {
    return await super.passthroughRequest({
      context: { child_ids: [this.child.id] },
      schedule: { edit_rule: rule },
    });
  }

  async setLedState(on: boolean) {
    // weird api in tplink: we send 0 to set on and 1 to set off
    const offState = on ? 0 : 1;

    return await super.passthroughRequest({
      context: { child_ids: [this.child.id] },
      system: { set_led_off: { off: offState } },
    });
  }

  async isOn() {
    return (await this.getRelayState()) === 1;
  }

  async isOff() {
    return !(await this.isOn());
  }

  async toggle() {
    const s = await this.getRelayState();
    return await this.setRelayState(s === 0 ? 1 : 0);
  }

  async get_relay_state() {
    // TODO remove
    return this.getRelayState();
  }
  async getRelayState() {
    const r = await this.getSysInfo();
    return r.relay_state;
  }

  async getSysInfo() {
    const r = await super.passthroughRequest({
      context: { child_ids: [this.child.id] },
      system: { get_sysinfo: null },
      emeter: { get_realtime: null },
    });
    return r.system.get_sysinfo;
  }
}
