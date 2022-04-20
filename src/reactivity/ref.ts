import { isChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffect } from "./effect";
import { reactive } from "./reactive";

// ref和reactive 的区别在于 ref是一个可变的值，reactive是一个可变的对象
// ref接受的参数是一个值，reactive接受的参数是一个对象
// 所以reactive接受的参数可以被proxy监听到get 和 set
// ref接受的参数不可以被proxy监听到get 和 set ， 所以定义了一个类  ， 来监听 ref.value的变化

class RefImpl {
  private _value;
  public dep;
  private _rawValue: any;

  constructor(value) {
    this._rawValue = value;
    // value 不是对象的话，直接赋值，如果是对象的话，要用reactive包裹一下
    this._value = isObject(value) ? reactive(value) : value;
    this.dep = new Set();
  }

  get value() {
    if (isTracking()) trackEffects(this.dep);

    return this._value;
  }
  set value(newValue) {
    // 比较有没有变化， 有变化的话才trigger
    if (isChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = isObject(newValue) ? reactive(newValue) : newValue;
      triggerEffect(this.dep);
    }
  }
}

export function ref(value) {
  return new RefImpl(value);
}
