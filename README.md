[![Build Status](https://travis-ci.org/adumont/tplink-cloud-api.svg?branch=master)](https://travis-ci.org/adumont/tplink-cloud-api)
[![codebeat badge](https://codebeat.co/badges/14afe7d2-3666-4d35-8fd6-c2e1b027e386)](https://codebeat.co/projects/github-com-adumont-tplink-cloud-api-master)

# Introduction

The `tplink-cloud-api` NPM module allows your to remotely control your TP-Link smartplugs (HS100, HS110), smart switches (HS200), and smartbulbs (LB100, LB110, LB120, LB130, KL60, KL110, KL120, KL130, and more) using the TP-Link cloud web service, from anywhere, without the need to be on the same wifi/lan.

It's especially useful in scenarios where you want to control your devices from public web services, like IFTTT, Thinger.io, Webtasks.io, Glitch.com...

It's based on my investigation work on the TP-Link API protocol, which I have been sharing in my blog http://itnerd.space.

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

Replace `My Smart Plug` with the alias you gave to your plug in the Kasa app (be sure to give a different alias to each device). Alternatively, you can also specify the unique deviceId or each device.

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

### Smartbulbs (LB100/110/120/130, KL110/120/130)

If you have an LB100/110 or KL50/60/110 (dimmable), you can change its state with:

```javascript
await tplink.getLB100("Bedroom LB120").setState(1, 90);
```

The two parameters are:

- on_off: 1 on, 0 off
- brightness: 0-100

If you have an LB120 or KL120 (tunable white), you can also change color temperature:

```javascript
await tplink.getLB120("Lamp LB120").setState(1, 90, 2700);
```

The three parameters for LB120 or KL120 are:
- on_off: 1 on, 0 off
- brightness: 0-100
- color_temp:
  - 2500-6500 (LB120)
  - 2700-5000 (KL120)

If you have an LB130 or KL130 (multicolor), use this:

```javascript
// to set hue:
await tplink.getLB130("Kitchen LB130").setState(1, 90, 150, 80);
// or to change white color temperature:
await tplink.getLB130("Kitchen LB130").setState(1, 90, 0, 0, 2700);
```

The five parameters for LB130 or KL130 are:

- on_off: 1 on, 0 off
- brightness: 0-100
- hue: 0-360
- saturation: 0-100
- color_temp: 2500-9000

For color bulbs, color_temp overrides hue/saturation. If a bulb is in white mode, color_temp must be set to 0 in order to change colors.

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

  // find a device by alias:
  let myPlug = tplink.getHS100("My Smart Plug");
  // or find by deviceId:
  // let myPlug = tplink.getHS100("558185B7EC793602FB8802A0F002BA80CB96F401");
  console.log("myPlug:", myPlug);

  //let response = await myPlug.powerOn();
  //console.log("response=" + response );

  let response = await myPlug.toggle();
  console.log("response=" + response);

  response = await myPlug.getSysInfo();
  console.log("relay_state=" + response.relay_state);

  console.log(await myPlug.getRelayState());
}

main();
```

## Nodejs App example

You can remix this App on Glitch and call it via webhook using POST to the corresponing URL (given when you create the App):

https://glitch.com/edit/#!/tplink-api-example

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
