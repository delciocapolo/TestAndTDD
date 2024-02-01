import { describe, test, expect } from "@jest/globals";
import { showName } from "../src";

const valueParamter = "Delcio";

describe("the value returned must be equal to the parameter", () => {
  test(`must return ${valueParamter}`, () => {
    expect(showName(valueParamter)).toBe(valueParamter);
  }, 500);
});
