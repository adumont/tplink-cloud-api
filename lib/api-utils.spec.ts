import { expect } from "chai";
import "mocha";
import { checkError } from "./api-utils";
describe("api-utils module", () => {
  describe("checkError()", () => {
    it("should detect errors", () => {
      expect(checkError).to.exist;
      expect(() => checkError({})).to.not.throw();
      expect(() => checkError({ data: { error_code: 0 } })).to.not.throw(Error);
      expect(() => checkError({ data: { error_code: 10 } })).to.throw(Error);
      expect(() => checkError({ data: { error_code: -1 } })).to.throw(Error);
    });
  });
});
