import device from "./device";
import { expect } from "chai";
import tplink from "./tplink";
import "mocha";
describe("tplink device", () => {
  const lTplink = new tplink("token", "termid");

  it("has expected properties after instantiation", () => {
    const d = new device(lTplink, {
      fwVer: "101",
      alias: "bedroom tv plug2",
      status: 1,
      deviceId: "1992",
      role: "role1",
      deviceMac: "feedbeef",
      deviceName: "name",
      deviceType: "IOT.SMARTPLUG",
      deviceModel: "model",
      appServerUrl: "/foo"
    });

    expect(d.appServerUrl).to.equal("/foo");
    expect(d.genericType).to.equal("device");
    expect(d.firmwareVersion).to.equal("101");
    expect(d.role).to.equal("role1");
    expect(d.mac).to.equal("feedbeef");
    expect(d.type).to.equal("IOT.SMARTPLUG");
    expect(d.model).to.equal("model");
    expect(d.getDeviceId()).to.equal("1992");
    expect(d.id).to.equal("1992");
    expect(d.alias).to.equal("bedroom tv plug2");
    expect(d.humanName).to.equal("bedroom tv plug2");
    expect(d.name).to.equal("name");
    expect(d.status).to.equal(1);
    expect(d.connected).to.be.true;
    expect(d.disconnected).to.be.false;

    d.device.status = 0;
    expect(d.connected).to.be.false;
    expect(d.disconnected).to.be.true;
    expect(d.status).to.equal(0);
  });
});
