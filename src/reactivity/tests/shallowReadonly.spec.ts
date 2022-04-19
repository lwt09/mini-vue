import { effect } from "../effect";
import { isProxy, isReadonly, reactive, readonly, shallowReadonly } from "../reactive";

describe("shalloReadonly", () => {
  it("shalloReadonly", () => {
    // 外层响应式对象 内层不响应式对象
    const dummy = shallowReadonly({
      foo: 1,
      bar: { baz: 2 },
    });

    expect(dummy.foo).toBe(1);
    expect(isReadonly(dummy)).toBe(true);
    expect(isReadonly(dummy.bar)).toBe(false);

    expect(isProxy(dummy)).toBe(true);
  });

  it("warn then call set ", () => {
    // not set
    console.warn = jest.fn();

    const user = shallowReadonly({ age: 10 });
    user.age++;

    expect(console.warn).toHaveBeenCalled();
  });
});
