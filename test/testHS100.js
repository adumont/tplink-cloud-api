'use strict'

const expect = require('chai').expect
const tplink = require('../distribution/tplink')

describe('HS100', () => {

  it('should be able to login', async () => {
    const myTPLink = await tplink.login(process.env.TEST_LOGIN_EMAIL, process.env.TEST_LOGIN_PASSWORD)

    expect(myTPLink.token).to.exist
    expect(myTPLink.termid).to.exist

    console.log(myTPLink)

    const deviceList = await myTPLink.getDeviceList()
    console.log(deviceList)

    expect(deviceList).that.is.not.empty

    //var myPlug = myTPLink.getHS100("My Smart Plug");
    var myPlug = myTPLink.getHS100(process.env.TEST_TPLINK_ALIAS);

    console.log("deviceId=" + myPlug.getDeviceId())

    console.log(myPlug);

    const relay_state = await myPlug.get_relay_state();

    console.log(relay_state)

    //expect(power.power).to.exist
  })

})
