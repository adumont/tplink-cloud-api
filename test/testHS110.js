'use strict'

const expect = require('chai').expect
const tplink = require('../distribution/tplink')

describe('HS110', () => {

  it('should be able to login', async () => {
    const myTPLink = await tplink.login(process.env.TEST_LOGIN_EMAIL, process.env.TEST_LOGIN_PASSWORD)
    expect(myTPLink.token).to.exist
    expect(myTPLink.termid).to.exist
    // console.log(myTPLink)
    const deviceList = await myTPLink.getDeviceList()
    // console.log(deviceList)
    expect(deviceList).that.is.not.empty
    const power = await myTPLink.getHS110(process.env.TEST_TPLINK_ALIAS).getPowerUsage()
    // console.log(power)
    expect(power.power).to.exist
  })

})
