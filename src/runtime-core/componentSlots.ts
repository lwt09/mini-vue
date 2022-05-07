import { ShapeFlags } from "../shared/ShapeFlags";

export function initSlots(instance, children) {
  // 组件&slot children
  if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeSlots(instance, children);
  }
}

function normalizeChildren(value) {
  return Array.isArray(value) ? value : [value];
}
function normalizeSlots(instance, children) {
  for (const key in children) {
    if (Object.prototype.hasOwnProperty.call(children, key)) {
      const value = children[key];
      instance.slots[key] = (prop) => normalizeChildren(value(prop));
    }
  }
}
