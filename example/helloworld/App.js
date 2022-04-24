import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  // 先不做 template 模板编译
  render() {
    //   ui (tag ,  props  , children / text)
    return h("div", "Hello World , hi " + this.msg);
  },

  setup(props) {
    return {
      msg: "mini - vue - lwt",
    };
  },
};
