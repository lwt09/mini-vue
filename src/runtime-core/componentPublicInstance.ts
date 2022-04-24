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
    const { setupState } = instance;
    if (key in setupState) {
      return setupState[key];
    }

    // $el 等
    if (key in publicPropertiesMap) {
      return publicPropertiesMap[key](instance);
    }
  },
};
