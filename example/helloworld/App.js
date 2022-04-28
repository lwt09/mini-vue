import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export const App = {
  // 先不做 template 模板编译
  name: "App",
  render() {
    window.self = this;

    //   ui (tag ,  props  , children / text)
    //   通过bind绑定 this 指向当前组件实例的proxy 访问proxy的属性和方法，被代理到instance的setupState\props等上面
    return h(
      "div",
      {
        id: "root",
        class: ["red", "small"],
        onClick: () => {
          console.log("click");
        },
        onMouseenter() {
          console.log("mouseenter");
        },
      },
      // 带this this.msg / this.$el / this.$data
      [h("div", {}, "hello" + this.msg), h(Foo, { count: this.msg })]
      // string
      // "hello wihtout this.msg"
      // array
      // [
      //   h("p", { class: "red" }, "i am child1 without this.msg"),
      //   h("p", { class: "blue" }, "i am child2"),
      // ]
    );
  },

  setup(props) {
    return {
      msg: "mini - vue - lwt",
    };
  },
};
