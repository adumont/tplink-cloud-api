import { AxiosResponse } from "axios";

export function checkError(response: AxiosResponse<any>): void {
  if (!response || !response.data) {
    throw new Error("response error: invalid or empty object received");
  } else if (response.data.error_code !== 0) {
    throw new ResponseError(response);
  }
}

export function buildRequestParams(
  data: any,
  termId: string,
  token?: string,
  overrides?: any
): any {
  const request = {
    data,
    method: "POST",
    url: "https://wap.tplinkcloud.com",
    headers: {
      "User-Agent":
        "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/M4B30X)",
      "Content-Type": "application/json",
    },
    params: {
      token,
      appName: "Kasa_Android",
      termID: termId,
      appVer: "1.4.4.607",
      ospf: "Android+6.0.1",
      netType: "wifi",
      locale: "es_ES",
    },
  };

  return Object.assign(request, overrides);
}

export class ResponseError extends Error {
  errorCode: number;
  response: AxiosResponse<any>;
  constructor(response: AxiosResponse<any>) {
    super(
      `response error: code=${response.data.error_code}, status="${
        response.statusText
      }", message=${JSON.stringify(response.data.msg || response.data)}`
    );
    this.errorCode = +response.data.error_code;
    this.response = response;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
  isTokenExpired(): boolean {
    return this.errorCode === -20651;
  }
}
