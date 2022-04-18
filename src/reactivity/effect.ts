import { extend } from "../shared";

class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  private onStop: any;

  constructor(fn, public scheduler) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    let res = this._fn();
    return res;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0
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
  activeEffect.deps.push(dep);
}

// 通过target - key - 拿到要触发的依赖
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  if (!dep) return;

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else effect.run();
  }
}

// 通过runner --> effect实例 --> deps依赖 --> 删除当前 effect
export function stop(runner) {
  runner.effect.stop();
}

let activeEffect;
export function effect(fn, options: any = {}) {
  let _effect = new ReactiveEffect(fn, options.scheduler);

  extend(_effect, options);

  activeEffect = _effect;
  _effect.run();
  activeEffect = null;

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
