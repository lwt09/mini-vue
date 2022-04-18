import { reactive, readonly } from "../reactive";

describe("happy path readonly", () => {
  it("happy path", () => {
    // 定义一个代理对象
    const original = { foo: 1 };
    const observed = readonly(original);

    expect(original).not.toBe(observed);

    expect(observed.foo).toBe(1);
  });

  it("warn then call set ", () => {
    // not set
    console.warn = jest.fn();

    const user = readonly({ age: 10 });
    user.age++;

    expect(console.warn).toHaveBeenCalled();
  });
});
