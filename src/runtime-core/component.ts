// 组件instance -> 通过 vnode创建，  { vnode, type(vnode.type) , setupState  , proxy  , 组件的render函数 }

import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PubilcInstanceHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode) {
  // 初始化组件, 返回一个对象 , 内部包含
  const component = {
    vnode,
    type: vnode.type,
    // setup 返回值
    setupState: {},
    // props:
    props: {},

    // emit
    emit: () => {},
    // slots
    slots: {},
  };

  component.emit = emit.bind(null, component) as any;

  return component;
}

export function setupComponent(instance) {
  // initProps 把h函数(createVNode)传递过来的props  赋值给组件实例的props
  initProps(instance, instance.vnode.props);
  // initSlots
  initSlots(instance, instance.vnode.children);
  // initState (添加方法， 让组件实例处理调用setup之后的返回值) , 有状态的组件
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  // 调用setup 拿到setup之后的返回值 ,
  // instance 里面包含有type ，也就是当前的组件(App对象)
  const Component = instance.type;

  // 创建代理组件对象 ， 将组件实例的数据挂载到这个代理对象上 , 调用render时候，会调用这个代理对象的方法
  instance.proxy = new Proxy({ _: instance }, PubilcInstanceHandlers);

  const { setup } = Component;
  if (setup) {
    // 储存instance
    setCurrentInstance(instance);

    //   setup可以返回一个 object 或者一个function , 再在setup里面被接收
    const setupResult = setup(shallowReadonly(instance.props), {
      // 传入emit给子组件， 让子组件可以调用父组件的emit
      emit: instance.emit,
    });

    // 清空instance
    setCurrentInstance(null);

    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance: any, setupResult: any) {
  // setupResult 可能是一个object 或者一个function
  //   如果是一个function, 则调用这个function skipnow
  //      setup(){cosnt count =ref(0); return ()=>{'div' , count.value}}

  //   如果是一个object, 则直接赋值给instance.state
  //      setup(){return {msg:'mini-vue'}}
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }

  //   组件数据初始化结束，要判断是否有render方法
  finishComponentSetup(instance);
}
function finishComponentSetup(instance: any) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}

// setup内部获取instance
let currentInstance = null;
export function getCurrentInstance() {
  return currentInstance;
}
function setCurrentInstance(instance) {
  currentInstance = instance;
}
