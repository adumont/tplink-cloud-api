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

import hs100 from "./hs100";
import HS300child from "./hs300child";
import TPLink from "./tplink";

export default class HS300 extends hs100 {
  children: any[];
  tpLink: TPLink;

  constructor(tpLink:TPLink, deviceInfo) {
    super(tpLink, deviceInfo);
    this.tpLink = tpLink;
    this.genericType = "switch";
  }

  async getChildren() {
    // const r = await this.getSysInfo();
    const r = {
      "sw_ver": "1.0.19 Build 200224 Rel.090814",
      "hw_ver": "1.0",
      "model": "HS300(US)",
      "deviceId": "redacted",
      "oemId": "5C9E6254BEBAED63B2B6102966D24C17",
      "hwId": "redacted",
      "rssi": -59,
      "longitude_i": -1224174,
      "latitude_i": 377759,
      "alias": "TP-LINK_Power Strip_2A54",
      "status": "new",
      "mic_type": "IOT.SMARTPLUGSWITCH",
      "feature": "TIM:ENE",
      "mac": "redacted",
      "updating": 0,
      "led_off": 0,
      "children": [
        {
          "id": "8006070807D6C11B3D3B5B61455944531BF7C62200",
          "state": 1,
          "alias": "Plug 1",
          "on_time": 99381,
          "next_action": {
            "type": -1
          }
        },
        {
          "id": "8006070807D6C11B3D3B5B61455944531BF7C62201",
          "state": 1,
          "alias": "Plug 2",
          "on_time": 254051,
          "next_action": {
            "type": -1
          }
        },
        {
          "id": "8006070807D6C11B3D3B5B61455944531BF7C62202",
          "state": 1,
          "alias": "Plug 3",
          "on_time": 254051,
          "next_action": {
            "type": -1
          }
        },
        {
          "id": "8006070807D6C11B3D3B5B61455944531BF7C62203",
          "state": 1,
          "alias": "Plug 4",
          "on_time": 174221,
          "next_action": {
            "type": -1
          }
        },
        {
          "id": "8006070807D6C11B3D3B5B61455944531BF7C62204",
          "state": 1,
          "alias": "Plug 5",
          "on_time": 9718,
          "next_action": {
            "type": 1,
            "schd_sec": 75600,
            "action": 0
          }
        },
        {
          "id": "8006070807D6C11B3D3B5B61455944531BF7C62205",
          "state": 1,
          "alias": "Plug 6",
          "on_time": 13318,
          "next_action": {
            "type": 1,
            "schd_sec": 72000,
            "action": 0
          }
        }
      ],
      "child_num": 6,
      "err_code": 0
    }
    return(this.children = r.children);
  }

  findChild(alias: string): any {
    let child: any;
    if (alias && this.children) {
      // we first search a correspondig device by alias
      child = this.children.find(d => d.alias === alias);
      // we then search a correspondig device by deviceId
      if (!child) {
        child = this.children.find(d => d.id === alias);
      }
    }
    if (!child) {
      throw new Error("invalid alias/id: not found in children list");
    }
    return child;
  }

  getChild(alias) {
    return new HS300child(this.tpLink, this.device, this.findChild(alias));
  }
}
