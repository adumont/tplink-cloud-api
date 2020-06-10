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
    const r = await this.getSysInfo();
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
