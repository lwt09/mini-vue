import { h, getCurrentInstance } from "../../lib/guide-mini-vue.esm.js";

export default {
  name: "foo",
  setup(props, ctx) {
    const instance = getCurrentInstance();
    console.log(instance);
  },
  render() {
    return h("div", {}, "foo");
  },
};
