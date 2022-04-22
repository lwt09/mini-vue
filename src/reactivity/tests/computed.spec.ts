import { computed } from "../computed";
import { reactive } from "../reactive";

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({
      age: 1,
    });
    const age = computed(() => user.age);
    // expect(age.value).toBe(1);
    user.age = 2;
    expect(age.value).toBe(2);
  });

  it("should compute lazily", () => {
    const value = reactive({ foo: 1 });
    const getter = jest.fn(() => value.foo);

    const cvalue = computed(getter);

    expect(getter).not.toHaveBeenCalled();

    expect(cvalue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // 计算属性缓存
    // 再次访问 不重复执行getter
    expect(cvalue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // 变更值 ， 当时不调用getter ， 再次访问时候才调用
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // 再次访问
    expect(cvalue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not compute again
    cvalue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
