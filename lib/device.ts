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
import tplink from "./tplink";
import { checkError, buildRequestParams } from "./api-utils";

export interface TPLinkDeviceInfo {
  fwVer: string;
  alias: string;
  status: number;
  deviceId: string;
  role: string;
  deviceMac: string;
  deviceName: string;
  deviceType: string;
  deviceModel: string;
  appServerUrl: string;
}

export default class TPLinkDevice {
  genericType: string;
  device: TPLinkDeviceInfo;
  private token: string;
  private termId: string;

  constructor(tpLink: tplink, deviceInfo: TPLinkDeviceInfo) {
    if (!tpLink) {
      throw new Error("missing required parameter tpLink");
    } else if (!deviceInfo) {
      throw new Error("missing required paramemter deviceInfo");
    } else if (typeof deviceInfo !== "object") {
      throw new Error("invalid type passed for deviceInfo, expected object.");
    }

    this.genericType = "device";
    this.device = deviceInfo;
    this.token = tpLink.token;
    this.termId = tpLink.termid;
  }

  get firmwareVersion() {
    return this.device.fwVer;
  }
  get role() {
    return this.device.role;
  }
  get mac() {
    return this.device.deviceMac;
  }
  get model() {
    return this.device.deviceModel;
  }
  get type() {
    return this.device.deviceType;
  }
  get name() {
    return this.device.deviceName;
  }
  get disconnected() {
    return this.status !== 1;
  }
  get connected() {
    return this.status === 1;
  }
  get status() {
    return this.device.status;
  }
  get humanName() {
    return this.device.alias;
  }
  get alias() {
    return this.device.alias;
  }
  get id() {
    return this.device.deviceId;
  }
  getDeviceId() {
    return this.device.deviceId;
  }
  get appServerUrl() {
    return this.device.appServerUrl;
  }

  async getSystemInfo() {
    const r = await this.passthroughRequest({ system: { get_sysinfo: {} } });
    return r.system.get_sysinfo;
  }

  async passthroughRequest(command) {
    const data = {
      method: "passthrough",
      params: {
        deviceId: this.device.deviceId,
        requestData: JSON.stringify(command),
      },
    };

    const request = buildRequestParams(data, this.termId, this.token, {
      url: this.device.appServerUrl,
    });

    const response = await axios(request);
    checkError(response);

    return response.data &&
      response.data.result &&
      response.data.result.responseData
      ? JSON.parse(response.data.result.responseData)
      : response.data;
  }
}
