import { expect } from "chai";
import "mocha";
import { checkError, ResponseError } from "./api-utils";
import { AxiosResponse } from "axios";

function mockAxiosResponse(
  code: number = 0,
  status: number = 200
): AxiosResponse<any> {
  return {
    status,
    data: { error_code: code },
    statusText: "OK",
    headers: {},
    config: {}
  };
}

describe("api-utils module", () => {
  describe("checkError()", () => {
    it("should detect errors", () => {
      expect(checkError).to.exist;
      expect(() => checkError(null)).to.throw(Error);
      expect(() =>
        checkError({
          data: {},
          status: 200,
          statusText: "OK",
          headers: {},
          config: {}
        })
      ).to.throw(ResponseError);
      expect(() => checkError(mockAxiosResponse())).to.not.throw(ResponseError);
      expect(() => checkError(mockAxiosResponse(10))).to.throw(ResponseError);
      expect(() => checkError(mockAxiosResponse(-1))).to.throw(ResponseError);
      expect(() => checkError(mockAxiosResponse(-1, 400))).to.throw(
        ResponseError
      );
    });
  });
  describe("ResponseError", () => {
    describe("should allow error introspection for", () => {
      it("token expiration", () => {
        let e = new ResponseError(mockAxiosResponse());
        expect(e.isTokenExpired()).to.be.false;
        e = new ResponseError(mockAxiosResponse(-20651));
        expect(e.isTokenExpired()).to.be.true;
      });
    });
  });
});
