export function createComponentInstance(vnode) {
  // 初始化组件, 返回一个对象 , 内部包含
  const component = {
    vnode,
    type: vnode.type,
  };
  return component;
}

export function setupComponent(instance) {
  // initProps
  // initSlots

  // initState (添加方法， 让组件实例处理调用setup之后的返回值) , 有状态的组件
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  // 调用setup 拿到setup之后的返回值 ,
  // instance 里面包含有type ，也就是当前的组件(App对象)
  const Component = instance.type;
  const { setup } = Component;
  if (setup) {
    //   setup可以返回一个 object 或者一个function
    const setupResult = setup();

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
