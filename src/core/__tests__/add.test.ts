import { add } from "..";

describe("test add fun", () => {
  test("1 +2 = 3", () => {
    expect(add(1, 2)).toBe(3);
  });
});
