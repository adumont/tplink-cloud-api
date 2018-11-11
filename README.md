[![Build Status](https://travis-ci.org/adumont/tplink-cloud-api.svg?branch=master)](https://travis-ci.org/adumont/tplink-cloud-api)

# Introduction

The `tplink-cloud-api` NPM module allows your to remotely control your TP-Link smartplugs (HS100, HS110), smart switches (HS200), and smartbulbs (LB100, LB110, LB120, LB130) using the TP-Link cloud web service, from anywhere, without the need to be on the same wifi/lan.

It's especially useful in scenarios where you want to control your devices from public web services, like IFTTT, Thinger.io, Webtasks.io, Glitch.com...

It's based on my investigation work on the TP-Link API protocol, which I have been sharing in my blog http://itnerd.com.

# Installation

You can install this module with `npm`:

```bash
npm install --save tplink-cloud-api
```

# Usage

## Authenticate

First instantiate a TP-Link object. TermID (UUIDv4) is generated if not specified:

```javascript
const { login } = require("tplink-cloud-api");
const tplink = await login("username@example.com", "Password", "TermID");
```

## Retrieve devices

Once authenticated, you can use your tplink instance to retrieve the list of your devices:

```javascript
let deviceList = await tplink.getDeviceList();
```

## Control your devices

### Smartplugs (HS100 & HS110)

Now you can toggle a plug:

```javascript
await tplink.getHS100("My Smart Plug").toggle();
```

You can also create an object and use it like this:

```javascript
let myPlug = tplink.getHS100("My Smart Plug ");
let response = await myPlug.toggle();
console.log(await myPlug.getRelayState());
```

Replace `My Smart Plug` with the alias you gave to your plug in the Kasa app (be sure to give a different alias to each device).

Instead of `toggle()`, you can use `powerOn()` or `powerOff()`. See all available methods below.

If you want to trigger multiple plugs, you can do it like this:

```javascript
await tplink.getHS100("My Smart Plug").toggle();
await tplink.getHS100("My Smart Plug 2").powerOn();
await tplink.getHS100("My Smart Plug 3").powerOff();
await tplink.getHS100("My Smart Plug 4").powerOff();
```

To retrieve power consumption data for the HS110:

```javascript
await tplink.getHS110("My Smart Plug").getPowerUsage();
```

### Smart Switches (HS200)

You can  toggle smart switches with the same API as the smart plugs.

### Smartbulbs (LB100/110/120/130)

If you have an LB100/110/120, you can change it's state with:

```javascript
await tplink.getLB100("Bedroom LB120").setState(1, 90);
```

The two parameters are:

- on_off: 1 on, 0 on_off
- brightness: 0-100

If you have an LB130, use this:

```javascript
await tplink.getLB130("Kitchen LB130").setState(1, 90, 150, 80);
```

The four parameters for LB130 are:

- on_off: 1 on, 0 on_off
- brightness: 0-100
- hue: 0-360
- saturation: 0-100

For help to choose the hue/saturation value, you can head to http://colorizer.org/.

# Example

```javascript
const { login } = require("tplink-cloud-api");
const uuidV4 = require("uuid/v4");

const TPLINK_USER = process.env.TPLINK_USER;
const TPLINK_PASS = process.env.TPLINK_PASS;
const TPLINK_TERM = process.env.TPLINK_TERM || uuidV4();

async function main() {
  // log in to cloud, return a connected tplink object
  const tplink = await login(TPLINK_USER, TPLINK_PASS, TPLINK_TERM);
  console.log("current auth token is", tplink.getToken());

  // get a list of raw json objects (must be invoked before .get* works)
  const dl = await tplink.getDeviceList();
  console.log(dl);

  let myPlug = tplink.getHS100("My Smart Plug");
  console.log("deviceId=", myPlug.getDeviceId());

  //let response = await myPlug.powerOn();
  //console.log("response=" + response );

  let response = await myPlug.toggle();
  console.log("response=" + response);

  response = await myPlug.getSysInfo();
  console.log("relay_state=" + response.relay_state);
  //console.log( JSON.parse(response).relay_state );

  console.log(await myPlug.getRelayState());

  // alternatively, map to light or plug objects that can directly be invoked (eg: .transitionLightState(...))
  for (const d of rawDevices) {
    const device = tplink.newDevice(d);

    if (device.disconnected) {
      // aka !connected
      continue; // can't operate on a device that's not connected to the internet
    }

    console.log(
      device.type,
      "(",
      device.genericType,
      ") in",
      device.humanName,
      "is..."
    ); // IOT.SMARTBULB (bulb) in Living Room is...

    if (device.genericType === "bulb") {
      // LB* type object
      // alias is the same as humanName
      if (device.alias === "Living Room") {
        // can be replaced by .toggle(), but written here for verbosity
        if (!(await device.isOn())) {
          console.log("off. turning on...");
          await device.powerOn();
        } else {
          console.log("on. turning off...");
          await device.powerOff();
        }
      }
    } else if (device.genericType === "plug") {
      // HS* type object
      if (!(await device.isOff())) {
        device.powerOff();
      }
    } else {
      // we haven't written the code... yet!
    }
  }
}

main();
```

# Available methods

## TPLink class

### login()

This _constructor_ method authenticates against the TP-Link cloud API and retrieves a token.

#### Parameters

| Parameter  | Specification | Description                         |
| ---------- | ------------- | ----------------------------------- |
| `user`     | String        | TP-Link account user name           |
| `password` | String        | TP-Link account password            |
| `termid`   | UUIDv4 String | Your client application Terminal ID |

`termid` is an arbitrary value. The API expects a UUIDv4 string, but at this time it doesn't validate this.

#### Returns

Returns the TPLink instance that you can later use to retrieve the Device List.

### getDeviceList()

This method returns an object that describe all the TP-Link devices registred to this TP-Link account.

You need to call this method once after login() in order to be able to get a particular device. Call this method every time you need to refresh the list of devices.

#### Parameters

None

#### Returns

Returns an object that describe all the TP-Link devices registred to this TP-Link account.

# Requires

Requires Node.js > v7.7 (async)
