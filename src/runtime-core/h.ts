import { createVNode } from "./vnode";

// h函数的作用和createVNode函数是一样的，只是h函数的参数不同
export function h(type, props?, children?) {
  return createVNode(type, props, children);
}
