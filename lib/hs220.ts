import hs200 from "./hs200";

export default class HS220 extends hs200 {
  constructor(tpLink, deviceInfo) {
    super(tpLink, deviceInfo);
    this.genericType = "switch";
  }

  public async setBrightness(brightness: number) {
    return await super.passthroughRequest({
      "smartlife.iot.dimmer": {
        set_brightness: { brightness },
      },
    });
  }
}
