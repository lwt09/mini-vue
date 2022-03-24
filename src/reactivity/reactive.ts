import { track, trigger } from "./effect";

export function reactive(raw) {
  return new Proxy(raw, {
    // proxy 基础 target 对象 , 访问的对象的key
    get(target, key) {
      const res = Reflect.get(target, key);

      // todo 依赖收集
      track(target, key);

      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);

      // todo 触发依赖
      trigger(target, key);

      return res;
    },
  });
}
