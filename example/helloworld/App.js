import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  // 先不做 template 模板编译
  render() {
    //   ui (tag ,  props  , children / text)
    return h(
      "div",
      { id: "root", class: ["red", "small"] },
      // "Hello World , hi " + this.msg
      // "hello wihtout this.msg"
      [
        h("p", { class: "red" }, "i am child1 without this.msg"),
        h("p", { class: "blue" }, "i am child2"),
      ]
    );
  },

  setup(props) {
    return {
      msg: "mini - vue - lwt",
    };
  },
};
