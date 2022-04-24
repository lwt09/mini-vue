import { h } from "../../lib/guide-mini-vue.esm.js";

window.self = null;
export const App = {
  // 先不做 template 模板编译
  render() {
    window.self = this;

    //   ui (tag ,  props  , children / text)
    return h(
      "div",
      { id: "root", class: ["red", "small"] },
      // 带this this.msg / this.$el / this.$data
      "Hello World , hi " + this.msg
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
