import { effect, stop } from "../effect";
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
    obj.number++;
    expect(temp).toBe(206);
  });

  it("scheduler", () => {
    // 1. 通过 effect 的第二个参数 传入一个 scheduler 的fn
    // 2. effect初始化时候 , 还是会执行 effect 的fn
    // 3. 当响应式对象的 set 被触发的时候 , 不会再执行 effect 的fn , 而是执行scheduler的fn
    // 4. 执行当前effect的runner时候, 会再次执行fn

    let dummy;
    let run: any;

    const scheduler = jest.fn(() => {
      run = runner;
      return "我是scheduler的返回值";
    });

    const obj = reactive({
      foo: 1,
    });

    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // // should not run yet
    expect(dummy).toBe(1);
    // // manually run
    run();
    // // should have run
    expect(dummy).toBe(2);

    obj.foo++;
    runner();
    expect(dummy).toBe(3);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ foo: 1 });
    const runner = effect(() => {
      dummy = obj.foo;
    });

    obj.foo++;
    expect(dummy).toBe(2);

    // stop 之后 , 不会再执行 effect 的fn 
    // stop内传入 dep , 将dep.deps中的dep移除
    stop(runner);
    obj.foo++;
    expect(dummy).toBe(2);

    runner();
    expect(dummy).toBe(3);
  });
});
