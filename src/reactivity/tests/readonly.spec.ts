import { isProxy, isReadonly, reactive, readonly } from "../reactive";

describe("happy path readonly", () => {
  it("happy path", () => {
    // 定义一个代理对象
    const original = { foo: 1, bar: { baz: 2 } };
    const observed = readonly(original);

    expect(original).not.toBe(observed);
    expect(isReadonly(observed)).toBe(true);
    expect(isReadonly(original)).toBe(false);
    expect(isReadonly(observed.bar)).toBe(true);
    expect(isReadonly(original.bar)).toBe(false);

    expect(observed.foo).toBe(1);

    expect(isReadonly(observed)).toBe(true);

    expect(isProxy(observed)).toBe(true);
  });

  it("warn then call set ", () => {
    // not set
    console.warn = jest.fn();

    const user = readonly({ age: 10 });
    user.age++;

    expect(console.warn).toHaveBeenCalled();
  });
});
