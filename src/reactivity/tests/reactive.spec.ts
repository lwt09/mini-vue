import { isProxy, isReactive, reactive } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    const original = { foo: 1 };
    const observed = reactive(original);

    expect(original).not.toBe(observed);

    expect(observed.foo).toBe(1);

    // isReactive
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);

    // isProxy
    expect(isProxy(observed)).toBe(true);
  });

  it("nested reactive", () => {
    // 深层嵌套 reactive
    const original = {
      foo: {
        bar: 1,
      },
      array: [{ bar: 2 }],
    };
    const observed = reactive(original);
    expect(isReactive(observed.foo)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
});
