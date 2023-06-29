import { expect } from "@open-wc/testing";
import * as readthedocs from "../src/index.js";

describe("Main library", () => {
  it("is defined", () => {
    expect(readthedocs).to.exist;
  });
  it("setup() function is defined", () => {
    expect(readthedocs.setup).to.exist;
  });
});
