import { isObject } from "../shared/index";
import {
  multableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

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
export function shallowReadonly(raw) {
  return createProxyObject(raw, shallowReadonlyHandlers);
}

// 生成 proxy
function createProxyObject(raw, baseHandlers) {
  // 传入的raw必须是一个对象o
  if (!isObject(raw)) {
    console.warn(`target ${raw} 必须是一个对象的`);
    return raw;
  }

  return new Proxy(raw, baseHandlers);
}

export function isReactive(value) {
  return !!(value && value[ReactiveFlags.IS_REACTIVE]);
}
export function isReadonly(value) {
  return !!(value && value[ReactiveFlags.IS_READONLY]);
}
export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
