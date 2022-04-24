import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  // patch
  patch(vnode, container);
}

function patch(vnode, container) {
  // 处理vnode
  // 1. 判断vnode是否是一个真实的dom节点 skipnow

  // 2. 判断vnode是否是一个组件, 如果是组件, 则调用processComponent方法
  processComponent(vnode, container);
}
function processComponent(vnode: any, container: any) {
  // 1. 初始化组件 ， 因为vnode的type为组件 ， 所以需要对其进行一些数据的初始化 ， 让其变成组件实例
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container: any) {
  // 创建组件实例
  const instance = createComponentInstance(vnode);
  // 往组件实例上挂载一些数据
  setupComponent(instance);

  //   看xmind图可以发现 组件初始化全部结束了
  //   应该去调用 组件的render函数了
  setupRenderEffect(instance, container);
}
function setupRenderEffect(instance: any, container: any) {
  //render() { return h("div", "Hello World , hi " + this.msg); }
  // 拿到下一个vnode
  const subTree = instance.render();

  // vnode -> 再次patch
  // (如果是不是组件类型 是element类型那就直接挂载到dom了)
  patch(subTree, container);
}
