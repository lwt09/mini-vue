import { extend } from "./../shared/index";
import { isObject } from "../shared/index";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly = false, isShallowReadonly = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    const res = Reflect.get(target, key);

    if (isShallowReadonly) {
      return res;
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    // todo 依赖收集
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}
function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);

    // todo 触发依赖
    trigger(target, key);

    return res;
  };
}

export const multableHandlers = {
  get,
  set,
};
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`${key} 修改set失败, 因为 target 是只读的readonly类型`);
    return true;
  },
};
export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});
