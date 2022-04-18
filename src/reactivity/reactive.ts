import { multableHandlers, readonlyHandlers } from "./baseHandlers";
import { track, trigger } from "./effect";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return createProxyObject(raw, multableHandlers);
}
export function readonly(raw) {
  return createProxyObject(raw, readonlyHandlers);
}

// 生成 proxy
function createProxyObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

export function isReactive(value) {
  return !!(value && value[ReactiveFlags.IS_REACTIVE]);
}
export function isReadonly(value) {
  return !!(value && value[ReactiveFlags.IS_READONLY]);
}
