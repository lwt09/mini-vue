import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js";

export default {
  name: "Foo",
  setup() {
    return {
      fooMsg: "子msg",
    };
  },
  render() {
    const fooContainer = h("div", {}, "fooContainer");

    // 2. 拿个app传递的slot , $slots , 放到 Foo组件的children中
    console.log(this.$slots);
    // 3. this.$slots传递过来的是一个数组 那就要把vnode数组展开或者丢进一个新的h函数中进行处理

    // 4. 需要把$slots转成一个对象传递过来(需要把slot放到对应的位置) (具名插槽)

    // 5. 作用域插槽
    return h("div", { style: "border:1px solid red" }, [
      renderSlots(this.$slots, "header", {
        data: this.fooMsg,
      }),
      fooContainer,
      renderSlots(this.$slots, "footer", {
        data: this.fooMsg,
      }),
    ]);
  },
};
