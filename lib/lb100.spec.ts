import tplink from "./tplink";
import { expect } from "chai";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import "mocha";
import LB100 from "./lb100";

describe("lb100", () => {
  const lTplink = new tplink("token", "termid");
  describe("can toggle light state", () => {
    it("reads correctly", async () => {
      const mock = new AxiosMockAdapter(axios);
      // off
      mock
        .onPost("/mock-server")
        .replyOnce(200, {
          error_code: 0,
          result: {
            responseData:
              '{"smartlife.iot.smartbulb.lightingservice":{"get_light_state":{"on_off":0,"dft_on_state":{"mode":"normal","hue":0,"saturation":0,"color_temp":2700,"brightness":10},"err_code":0}}}'
          }
        })
        .onPost("/mock-server")
        .replyOnce(200, {
          error_code: 0,
          result: {
            responseData:
              '{"smartlife.iot.smartbulb.lightingservice":{"get_light_state":{"on_off":0,"dft_on_state":{"mode":"normal","hue":0,"saturation":0,"color_temp":2700,"brightness":10},"err_code":0}}}'
          }
        })
        // turn on
        .onPost("/mock-server")
        .replyOnce(200, {
          error_code: 0,
          result: {
            responseData:
              '{"smartlife.iot.smartbulb.lightingservice":{"get_light_state":{"on_off":1,"dft_on_state":{"mode":"normal","hue":0,"saturation":0,"color_temp":2700,"brightness":10},"err_code":0}}}'
          }
        })
        // on
        .onPost("/mock-server")
        .replyOnce(200, {
          error_code: 0,
          result: {
            responseData:
              '{"smartlife.iot.smartbulb.lightingservice":{"get_light_state":{"on_off":1,"dft_on_state":{"mode":"normal","hue":0,"saturation":0,"color_temp":2700,"brightness":10},"err_code":0}}}'
          }
        })
        .onPost("/mock-server")
        .replyOnce(200, {
          error_code: 0,
          result: {
            responseData:
              '{"smartlife.iot.smartbulb.lightingservice":{"get_light_state":{"on_off":1,"dft_on_state":{"mode":"normal","hue":0,"saturation":0,"color_temp":2700,"brightness":10},"err_code":0}}}'
          }
        })
        // power off
        .onPost("/mock-server")
        .replyOnce(200, {
          error_code: 0,
          result: {
            responseData:
              '{"smartlife.iot.smartbulb.lightingservice":{"get_light_state":{"on_off":0,"dft_on_state":{"mode":"normal","hue":0,"saturation":0,"color_temp":2700,"brightness":10},"err_code":0}}}'
          }
        })
        .onAny("/mock-server")
        .reply(400, { error_code: 2, msg: "bad request" });

      let d = new LB100(lTplink, {
        appServerUrl: "/mock-server",
        fwVer: "101",
        alias: "bedroom light",
        status: 1,
        deviceId: "1992",
        role: "role1",
        deviceMac: "feedbeef",
        deviceName: "name",
        deviceType: "IOT.SMARTBULB",
        deviceModel: "model"
      });

      expect(d.genericType).to.equal("bulb");

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
