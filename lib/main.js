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

var TPLink = require("./tplink.js")
var uuidV4 = require('uuid/v4');
//var HS100 = require("./hs100.js")

const TPLINK_USER = process.env.TPLINK_USER;
const TPLINK_PASS = process.env.TPLINK_PASS;
const TPLINK_TERM = process.env.TPLINK_TERM || uuidV4();

async function main(){
  let response

  var myTPLink = await TPLink.login(TPLINK_USER, TPLINK_PASS,TPLINK_TERM);

  console.log( myTPLink.getToken() )

  var dl = await myTPLink.getDeviceList();

  console.log( dl )

  var myPlug = myTPLink.getHS100("My Smart Plug");

  console.log("deviceId=" + myPlug.getDeviceId())

  //var response = await myPlug.powerOn();
  //console.log("response=" + response );

  response = await myPlug.toggle();
  console.log("response=" + response );

  response = await myPlug.getSysInfo();
  console.log("relay_state=" + response.relay_state );
  //console.log( JSON.parse(response).relay_state );

  console.log( await myPlug.get_relay_state() )
}

main();
