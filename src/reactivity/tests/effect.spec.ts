import { effect } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
      number: 1,
    });
    let nextAge;

    // 触发user proxy 的get,同时将fn作为依赖收集到user 的依赖当中去
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    // update
    // user.number++; // bug待解决 activeEffect的影响没有被清除,在别的属性调用get的时候又触发了
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("effect runner", () => {
    // effect(fn) --> 返回一个函数 称作runner 调用runner --->返回fn -->调用fn再返回fn的return值
    let temp = 1;
    let runner = effect(() => {
      temp += 10;
      return "我是fn的返回值";
    });
    expect(temp).toBe(11);
    let res = runner();
    expect(temp).toBe(21);
    expect(res).toBe("我是fn的返回值");
  });

  it("effect set activeEffect into null", () => {
    const obj = reactive({
      age: 1,
      number: 100,
    });
    let temp = 0;
    effect(() => {
      temp += obj.age;
    });
    expect(temp).toBe(1);

    obj.age++;
    expect(temp).toBe(3);
    obj.number++;
    expect(temp).toBe(3);
    effect(() => {
      temp += obj.number;
    });
    expect(temp).toBe(104);
    obj.number++
    expect(temp).toBe(206);

  });
});
