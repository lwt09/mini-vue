import { h, getCurrentInstance } from "../../lib/guide-mini-vue.esm.js";
import Foo from "./Foo.js";

export default {
  name: "app",
  setup(props, ctx) {
    const instance = getCurrentInstance();
    console.log(instance);
  },
  render() {
    return h("div", {}, [h("div", {}, "app"), h(Foo)]);
  },
};
