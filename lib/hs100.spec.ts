import axios from "axios";
import axiosMockAdapter from "axios-mock-adapter";
import { expect } from "chai";
import "mocha";
import hs100 from "./hs100";
import tplink from "./tplink";

describe("hs100", () => {
  const lTplink = new tplink("token", "termid");
  describe("can toggle plug state", () => {
    it("reads correctly", async () => {
      const mock = new axiosMockAdapter(axios);
      // off
      mock
        .onPost("/mock-server")
        .replyOnce(200, {
          error_code: 0,
          result: {
            responseData: '{"system":{"get_sysinfo":{"relay_state": 0}}}'
          }
        })
        .onPost("/mock-server")
        .replyOnce(200, {
          error_code: 0,
          result: {
            responseData: '{"system":{"get_sysinfo":{"relay_state": 0}}}'
          }
        })
        // turn on
        .onPost("/mock-server")
        .replyOnce(200, {
          error_code: 0,
          result: {
            responseData: '{"system":{"get_sysinfo":{"relay_state": 1}}}'
          }
        })
        // on
        .onPost("/mock-server")
        .replyOnce(200, {
          error_code: 0,
          result: {
            responseData: '{"system":{"get_sysinfo":{"relay_state": 1}}}'
          }
        })
        .onPost("/mock-server")
        .replyOnce(200, {
          error_code: 0,
          result: {
            responseData: '{"system":{"get_sysinfo":{"relay_state": 1}}}'
          }
        })
        // power off
        .onPost("/mock-server")
        .replyOnce(200, {
          error_code: 0,
          result: {
            responseData: '{"system":{"get_sysinfo":{"relay_state": 0}}}'
          }
        })
        .onAny("/mock-server")
        .reply(400, { error_code: 2, msg: "bad request" });

      const d = new hs100(lTplink, {
        appServerUrl: "/mock-server",
        fwVer: "1011",
        alias: "bedroom tv",
        status: 1,
        deviceId: "19921",
        role: "role12",
        deviceMac: "feedbeefd",
        deviceName: "name",
        deviceType: "IOT.SMARTPLUG",
        deviceModel: "model"
      });

      expect(d.genericType).to.equal("plug");

      let isOn = await d.isOn();
      expect(isOn).to.be.false;

      let isOff = await d.isOff();
      expect(isOff).to.be.true;

      await d.powerOn();

      isOn = await d.isOn();
      expect(isOn).to.be.true;

      isOff = await d.isOff();
      expect(isOff).to.be.false;

      await d.powerOff();
    });
  });
});
