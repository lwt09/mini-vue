import { ReactiveEffect } from "./effect";


class ComputedImpl {
  private _getter: any;
  private _value: any;
  private _dirty: boolean = true;
  private _effect: any;

  constructor(getter) {
    this._getter = getter;
    // 创建 reactive类对应的 effect ， 当reactive数据改变时候， 触发scheduler ， 让computed不走缓存
    this._effect = new ReactiveEffect(getter, () => {
      this._dirty = true;
    });
  }

  get value() {
    // 当依赖 改变时候 dirty 为 true  ， 不走缓存
    if (this._dirty) {
      // 让 effect 执行 同时把当前的 effect 放到响应式对象的依赖里面
      this._value = this._effect.run();
      this._dirty = false;
    }
    return this._value;
  }
}

// 传入一个fn(getter)  , 当依赖改变时候再触发fn
// 同时具有缓存机制，访问get时候 当依赖没有变化时候，不会触发fn
export function computed(getter) {
  return new ComputedImpl(getter);
}
