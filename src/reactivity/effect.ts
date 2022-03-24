class ReactiveEffect {
  private _fn: any;

  constructor(fn) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    let res = this._fn();
    activeEffect = null;
    return res;
  }
}

// target --> key --->dep
// 把依赖放到 对应的对象的属性映射表里面去
const targetMap = new Map();
export function track(target, key) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  dep.add(activeEffect);
}

// 通过target - key - 拿到要触发的依赖
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  if (!dep) return;

  for (const effect of dep) {
    effect.run();
  }
}

let activeEffect;
export function effect(fn) {
  let _effect = new ReactiveEffect(fn);
  _effect.run();

  return _effect.run.bind(_effect);
}
