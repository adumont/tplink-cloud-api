import hs200 from "./hs200";

export default class HS220 extends hs200 {
  constructor(tpLink, deviceInfo) {
    super(tpLink, deviceInfo);
    this.genericType = "switch";
  }

  protected async setBrightness(brightness: number) {
    // on_off: 1 on, 0 off
    // brightness: 0-100

    return await super.passthroughRequest({
      "smartlife.iot.dimmer": {
        set_brightness: { brightness },
      },
    });
  }
}
