import { hasOwn } from "../shared/index";

const publicPropertiesMap = {
  // 当用户调用 instance.proxy.$emit 时就会触发这个函数
  // i 就是 instance 的缩写 也就是组件实例对象
  $el: (i) => i.vnode.el,
  $emit: (i) => i.emit,
  $slots: (i) => i.slots,
  $props: (i) => i.props,
};

export const PubilcInstanceHandlers = {
  get({ _: instance }, key) {
    const { setupState, props } = instance;
    // if (key in setupState) {
    //   return setupState[key];
    // }

    // 判断对象内有没有这个key
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }

    // $el 等
    if (key in publicPropertiesMap) {
      return publicPropertiesMap[key](instance);
    }
  },
};
