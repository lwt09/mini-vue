import { createVNode } from "../vnode";

export function renderSlots(slots, key, data) {
  // slots  -> Array<VNode>
  // return createVNode('div' , {} , slots)

  // slots -> obj<key:vnode>
  let slot = slots[key];
  if (slot) {
    if (typeof slot === "function") {
      return createVNode("div", {}, slot(data));
    }
  }
}
