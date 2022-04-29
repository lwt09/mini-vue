import { h } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
  name: "Foo",
  // 1. setup内要多传入一个ctx对象 ， 里面包含emit
  // 2. 调用emit时候 ， 父组件会调用组件内的onEmit方法（绑定在父组件的props同位置）
  setup(props, ctx) {
    const emit = ctx.emit;
    const emitAdd = () => {
      console.log("1. 子组件准备开始触发emit");
      // 2. 触发
      emit("add", "a", "b");
      emit("add-foo");
    };
    return { emitAdd };
  },
  render() {
    const btn = h(
      "button",
      {
        onClick: this.emitAdd,
      },
      "emitAddContent"
    );
    const foo = h("div", {}, "我是foo");

    return h(
      "div",
      { onclick: this.emitAdd, style: "border : 1px solid red" },
      [btn, foo]
    );
  },
};
