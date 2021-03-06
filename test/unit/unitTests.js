const utils = require('../../api/utils');
const chai = require('chai');
const expect = chai.expect;
// add
describe("add two numbers", () => {
  it("shoud be 1 + 1 = 2", () => {
    expect(utils.add(1, 1)).to.eqls(2);
  });
  it("shoud be -1 + 1 = 0", () => {
    expect(utils.add(-1, 1)).to.eqls(0);
  });
  it("shoud be 0 + 0 = 0", () => {
    expect(utils.add(0, 0)).to.eqls(0);
  });
  it("shoud be 1.5 + 1 = 2.5", () => {
    expect(utils.add(1.5, 1)).to.eqls(2.5);
  });
  it("shoud be -1 + -1 = -2", () => {
    expect(utils.add(-1, -1)).to.eqls(-2);
  });
});

// divide
describe("divide two numbers", () => {
  it("shoud be 1 / 1 = 1", () => {
    expect(utils.divide(1, 1)).to.eqls(1);
  });
  it("shoud be -1 / 1 = -1", () => {
    expect(utils.divide(-1, 1)).to.eqls(-1);
  });
  it("shoud be 1.5 / 1 = 1.5", () => {
    expect(utils.divide(1.5, 1)).to.eqls(1.5);
  });
  it("shoud be -1 / -1 = 1", () => {
    expect(utils.divide(-1, -1)).to.eqls(1);
  });
});

// multiply
describe("multiply two numbers", () => {
  it("shoud be 1 * 1 = 1", () => {
    expect(utils.multiply(1, 1)).to.eqls(1);
  });
  it("shoud be -1 * 1 = -1", () => {
    expect(utils.multiply(-1, 1)).to.eqls(-1);
  });
  it("shoud be 0 * 0 = 0", () => {
    expect(utils.multiply(0, 0)).to.eqls(0);
  });
  it("shoud be 1.5 * 1.5 = 2.25", () => {
    expect(utils.multiply(1.5, 1.5)).to.eqls(2.25);
  });
  it("shoud be -1 * -1 = 1", () => {
    expect(utils.multiply(-1, -1)).to.eqls(1);
  });
});

// subtract
describe("subtract two numbers", () => {
  it("shoud be 1 - 1 = 0", () => {
    expect(utils.subtract(1, 1)).to.eqls(0);
  });
  it("shoud be -1 - 1 = -2", () => {
    expect(utils.subtract(-1, 1)).to.eqls(-2);
  });
  it("shoud be 0 - 0 = 0", () => {
    expect(utils.subtract(0, 0)).to.eqls(0);
  });
  it("shoud be 1.5 - 1 = .5", () => {
    expect(utils.subtract(1.5, 1)).to.eqls(.5);
  });
  it("shoud be -1 - -1 = 0", () => {
    expect(utils.subtract(-1, -1)).to.eqls(0);
  });
});