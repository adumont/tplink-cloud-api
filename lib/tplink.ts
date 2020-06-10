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

import axios from "axios";
import { v4 } from "uuid";
import { checkError } from "./api-utils";
import device from "./device";
import hs100 from "./hs100";
import hs110 from "./hs110";
import hs200 from "./hs200";
import hs300 from "./hs300";
import lb100 from "./lb100";
import lb130 from "./lb130";

/* Example
{
  accountId: '12456',
  regTime: '2017-12-09 03:53:19',
  email: 'your-email@some-domain.com',
  token: 'feed-beef...'
}
*/
interface LoginResponse {
  accountId: string;
  regTime: string;
  email: string;
  token: string;
  // there is no refresh token in response
}

export async function login(
  user: string,
  passwd: string,
  termid: string = v4()
): Promise<TPLink> {
  if (!user) {
    throw new Error("missing required user parameter");
  } else if (!passwd) {
    throw new Error("missing required password parameter");
  }

  const request = {
    method: "POST",
    url: "https://wap.tplinkcloud.com",
    params: {
      appName: "Kasa_Android",
      termID: termid,
      appVer: "1.4.4.607",
      ospf: "Android+6.0.1",
      netType: "wifi",
      locale: "es_ES"
    },
    data: {
      method: "login",
      url: "https://wap.tplinkcloud.com",
      params: {
        appType: "Kasa_Android",
        cloudPassword: passwd,
        cloudUserName: user,
        terminalUUID: termid
      }
    },
    headers: {
      "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/M4B30X)"
    }
  };

  const response = await axios(request);
  checkError(response);
  const token = response.data.result.token;
  return new TPLink(token, termid);
}

export default class TPLink {
  token: string;
  termid: string;
  deviceList: any[];
  constructor(token: string, termid: string = v4()) {
    this.token = token;
    this.termid = termid;
  }

  getTermId(): string {
    return this.termid;
  }
  getToken(): string {
    return this.token;
  }

  async getDeviceList(): Promise<any[]> {
    const request = {
      method: "POST",
      url: "https://wap.tplinkcloud.com",
      params: {
        appName: "Kasa_Android",
        termID: this.termid,
        appVer: "1.4.4.607",
        ospf: "Android+6.0.1",
        netType: "wifi",
        locale: "es_ES",
        token: this.token
      },
      headers: {
        "User-Agent":
          "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/M4B30X)"
      },
      data: { method: "getDeviceList" }
    };

    const response = await axios(request);
    checkError(response);
    return (this.deviceList = response.data.result.deviceList);
  }

  // factory to return a new device object from a name (alias) or info object, { deviceType: ..., deviceModel: ... }
  newDevice(nameOrInfo): device {
    if (!nameOrInfo) {
      throw new Error("missing required parameter nameOrInfo");
    } else if (
      typeof nameOrInfo !== "string" &&
      typeof nameOrInfo !== "object"
    ) {
      throw new Error(
        "invalid parameter type provided for nameOrInfo; expected string or object"
      );
    }

    let deviceInfo = nameOrInfo;
    if (typeof nameOrInfo === "string") {
      deviceInfo = this.findDevice(nameOrInfo);
    }

    // https://github.com/plasticrake/tplink-smarthome-api/blob/master/src/device/index.js#L113
    const type = deviceInfo.deviceType.toLowerCase();
    const model = deviceInfo.deviceModel;
    if (type.includes("bulb")) {
      if (model && model.includes("130")) {
        return new lb130(this, deviceInfo);
      }
      return new lb100(this, deviceInfo);
    }
    if (type.includes("plug")) {
      if (model && model.includes("110")) {
        return new hs110(this, deviceInfo);
      }
      return new hs100(this, deviceInfo);
    }

    if (type.includes("switch")) {
      if (model && model.includes("200")) {
        return new hs200(this, deviceInfo);
      }
    }
    return new device(this, deviceInfo);
  }

  findDevice(alias: string): any {
    let deviceInfo;
    if (alias && this.deviceList) {
      // we first search a correspondig device by alias
      deviceInfo = this.deviceList.find(d => d.alias === alias);
      // we then search a correspondig device by deviceId
      if (!deviceInfo) {
        deviceInfo = this.deviceList.find(d => d.deviceId === alias);
      }
    }
    if (!deviceInfo) {
      throw new Error("invalid alias/deviceId: not found in device list");
    }
    return deviceInfo;
  }

  // for an HS100 smartplug
  getHS100(alias) {
    return new hs100(this, this.findDevice(alias));
  }

  // for an HS110 smartplug
  getHS110(alias) {
    return new hs110(this, this.findDevice(alias));
  }

  // for an HS200 smart switch
  getHS200(alias) {
    return new hs200(this, this.findDevice(alias));
  }

  // for an HS300 smart multi-switch
  getHS300(alias) {
    return new hs300(this, this.findDevice(alias));
  }

  // for an LB100, LB110 & LB120
  getLB100(alias): lb100 {
    return new lb100(this, this.findDevice(alias));
  }
  getLB110(alias) {
    return this.getLB100(alias);
  }
  getLB120(alias) {
    return this.getLB100(alias);
  }

  // for an LB130 lightbulb
  getLB130(alias) {
    return new lb130(this, this.findDevice(alias));
  }
}
