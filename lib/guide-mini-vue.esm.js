function createComponentInstance(vnode) {
    // 初始化组件, 返回一个对象 , 内部包含
    var component = {
        vnode: vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    // initProps
    // initSlots
    // initState (添加方法， 让组件实例处理调用setup之后的返回值) , 有状态的组件
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    // 调用setup 拿到setup之后的返回值 ,
    // instance 里面包含有type ，也就是当前的组件(App对象)
    var Component = instance.type;
    var setup = Component.setup;
    if (setup) {
        //   setup可以返回一个 object 或者一个function
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
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
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    // patch
    patch(vnode);
}
function patch(vnode, container) {
    // 处理vnode
    // 1. 判断vnode是否是一个真实的dom节点 skipnow
    // 2. 判断vnode是否是一个组件, 如果是组件, 则调用processComponent方法
    processComponent(vnode);
}
function processComponent(vnode, container) {
    // 1. 初始化组件 ， 因为vnode的type为组件 ， 所以需要对其进行一些数据的初始化 ， 让其变成组件实例
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    // 创建组件实例
    var instance = createComponentInstance(vnode);
    // 往组件实例上挂载一些数据
    setupComponent(instance);
    //   看xmind图可以发现 组件初始化全部结束了
    //   应该去调用 组件的render函数了
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    //render() { return h("div", "Hello World , hi " + this.msg); }
    // 拿到下一个vnode
    var subTree = instance.render();
    // vnode -> 再次patch
    // (如果是不是组件类型 是element类型那就直接挂载到dom了)
    patch(subTree);
}

function createVNode(type, props, children) {
    var vnode = { type: type, props: props, children: children };
    return vnode;
}

function creatApp(rootComponent) {
    // 返回一个app对象，里面带有mount方法(初始化挂载)
    return {
        mount: function (rootContainer) {
            debugger;
            // 根组件(render) -> vnode -> dom ->挂载到rootContainer
            // 1. 根组件 -> vnode(type type可以是vue component也可以是div等标签, props, children)
            var vnode = createVNode(rootComponent);
            // 2. 内部调用patch方法 ，进行递归的处理
            render(vnode);
        }
    };
}

// h函数的作用和createVNode函数是一样的，只是h函数的参数不同
function h(type, props, children) {
    return createVNode(type, props, children);
}

export { creatApp, h };
