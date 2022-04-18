import { multableHandlers, readonlyHandlers } from "./baseHandlers";
import { track, trigger } from "./effect";

export function reactive(raw) {
  return generateBaseHandler(raw, multableHandlers);
}
export function readonly(raw) {
  return generateBaseHandler(raw, readonlyHandlers);
}

// 生成 proxy
function generateBaseHandler(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}
