import { h } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
  render() {
    // 1.通过 父组件h(Foo, { count: this.msg }) 的方式调用， 初始化Foo的props，绑定到instance.props上
    // 2.通过setup传入setup内，让其内部可以使用
    // 3.通过this.count可以直接访问this.$props.count
    return h(
      "div",
      {},
      `foo: ${this.$props.count} ；访问调用方式2 ${this.count}`
    );
  },

  setup(props) {
    // 4.不可以被修改 shallowReadonly
    props.count = '1243'
    console.log(props);
  },
};
