import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  // patch
  patch(vnode, container);
}

function patch(vnode, container) {
  // 处理vnode
  // 1. 判断vnode是否是一个真实的dom节点
  // console.log(vnode.type);
  if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
    // 是string类型也就是,是普通的element类型的vnode,直接挂载到dom
    processElement(vnode, container);
  } else if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    // 2. 判断vnode是否是一个组件, 如果是组件, 则调用processComponent方法
    processComponent(vnode, container);
  }
}

function processElement(vnode: any, container: any) {
  // 初始化dom
  mountElement(vnode, container);
}
function mountElement(vnode, container) {
  const el = (vnode.el = document.createElement(vnode.type));
  const { type, props, children } = vnode;

  // 处理属性props
  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      const element = props[key];
      if (/^on[A-Z]/.test(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event , element);
      } else {
        el.setAttribute(key, element);
      }
    }
  }

  // 处理children / string
  if (vnode.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.innerText = children;
  } else if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // 同样每个子节点也是一个vnode ， 去patch
    mountChildren(children, el);
  }
  container.append(el);
}
function mountChildren(vnode, container) {
  vnode.forEach((child) => {
    patch(child, container);
  });
}

function processComponent(vnode: any, container: any) {
  // 分为初始化和更新
  // 1. 初始化组件 ， 因为vnode的type为组件 ， 所以需要对其进行一些数据的初始化 ， 让其变成组件实例
  mountComponent(vnode, container);
}

function mountComponent(initialVNode: any, container: any) {
  // 创建组件实例
  const instance = createComponentInstance(initialVNode);
  // 往组件实例上挂载一些数据
  setupComponent(instance);

  //   看xmind图可以发现 组件初始化全部结束了
  //   应该去调用 组件的render函数了
  setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance: any, initialVNode, container: any) {
  //render() { return h("div", "Hello World , hi " + this.msg); }
  // 拿到下一个vnode
  // 拿到代理对象， this指向它, render里面的this.msg -> 指向proxy上面的msg
  const proxy = instance.proxy;
  const subTree = instance.render.call(proxy);

  // vnode -> 再次patch
  // (如果是不是组件类型 是element类型那就直接挂载到dom了)
  patch(subTree, container);

  // 把element的el传递给组件实例
  initialVNode.el = subTree.el;
}
