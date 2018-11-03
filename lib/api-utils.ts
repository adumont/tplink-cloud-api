import { AxiosResponse } from "axios";

export function checkError(response: AxiosResponse<any>): void {
  if (!response || !response.data) {
    throw new Error("response error: invalid or empty object received");
  } else if (response.data.error_code !== 0) {
    throw new ResponseError(response);
  }
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
