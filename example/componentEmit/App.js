import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    const self = this;
    return h("div", {}, [
      h("div", {}, "App"),
      h(Foo, {
        // on + Event
        onAdd(a, b) {
          // 3. 被触发了
          self.handleAdd(a, b);
        },
        // add-foo
        onAddFoo() {
          console.log("add-foo");
        },
      }),
    ]);
  },
  setup(props) {
    const handleAdd = (a, b) => {
      console.log("3. 父组件emit被触发了 , 参数为", a, b);
    };
    return {
      handleAdd,
    };
  },
};
