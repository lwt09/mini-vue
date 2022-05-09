import { h, createTextNode } from "../../lib/guide-mini-vue.esm.js";
import Foo from "./Foo.js";

export default {
  name: "App",
  render() {
    const app = h("div", {}, this.msg);
    // 1. 组件createApp 创建组件时候 (第三个参数就是传递给子组件的 slot 参数)
    // const foo = h(Foo, {}, [h("p", {}, "app传递给foo的内容") , h("p", {}, "app传递给foo的内容2")]);
    // 4. 转对象
    const foo = h(
      Foo,
      {},
      {
        // header: h("p", {}, "app传递给foo的内容,我是header"),
        // footer: h("p", {}, "app传递给foo的内容,我是footer"),

        // 5. 作用域插槽
        header: ({ data }) => [
          h(
            "p",
            {},
            "app传递给foo的内容,我是header , 接收到子组件给我的信息: " + data
          ),
          createTextNode("你好呀"),
        ],
        footer: ({ data }) =>
          h(
            "p",
            {},
            "app传递给foo的内容,我是footer , 接收到子组件给我的信息: " + data
          ),
      }
    );
    return h("div", {}, [app, foo]);
  },
  setup() {
    return {
      msg: "App-container",
    };
  },
};
