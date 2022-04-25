var publicPropertiesMap = {
    // 当用户调用 instance.proxy.$emit 时就会触发这个函数
    // i 就是 instance 的缩写 也就是组件实例对象
    $el: function (i) { return i.vnode.el; },
    $emit: function (i) { return i.emit; },
    $slots: function (i) { return i.slots; },
    $props: function (i) { return i.props; },
};
var PubilcInstanceHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState;
        if (key in setupState) {
            return setupState[key];
        }
        // $el 等
        if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
        }
    },
};

// 组件instance -> 通过 vnode创建，  { vnode, type(vnode.type) , setupState  , proxy  }
function createComponentInstance(vnode) {
    // 初始化组件, 返回一个对象 , 内部包含
    var component = {
        vnode: vnode,
        type: vnode.type,
        // setup 返回值
        setupState: {},
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
    // 创建代理组件对象 ， 将组件实例的数据挂载到这个代理对象上 , 调用render时候，会调用这个代理对象的方法
    instance.proxy = new Proxy({ _: instance }, PubilcInstanceHandlers);
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
    patch(vnode, container);
}
function patch(vnode, container) {
    // 处理vnode
    // 1. 判断vnode是否是一个真实的dom节点
    // console.log(vnode.type);
    if (vnode.shapeFlag & 1 /* ELEMENT */) {
        // 是string类型也就是,是普通的element类型的vnode,直接挂载到dom
        processElement(vnode, container);
    }
    else if (vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        // 2. 判断vnode是否是一个组件, 如果是组件, 则调用processComponent方法
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    // 初始化dom
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    var el = (vnode.el = document.createElement(vnode.type));
    vnode.type; var props = vnode.props, children = vnode.children;
    // 处理属性props
    for (var key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            var element = props[key];
            el.setAttribute(key, element);
        }
    }
    // 处理children / string
    if (vnode.shapeFlag & 4 /* TEXT_CHILDREN */) {
        el.innerText = children;
    }
    else if (vnode.shapeFlag & 8 /* ARRAY_CHILDREN */) {
        // 同样每个子节点也是一个vnode ， 去patch
        mountChildren(children, el);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.forEach(function (child) {
        patch(child, container);
    });
}
function processComponent(vnode, container) {
    // 分为初始化和更新
    // 1. 初始化组件 ， 因为vnode的type为组件 ， 所以需要对其进行一些数据的初始化 ， 让其变成组件实例
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    // 创建组件实例
    var instance = createComponentInstance(initialVNode);
    // 往组件实例上挂载一些数据
    setupComponent(instance);
    //   看xmind图可以发现 组件初始化全部结束了
    //   应该去调用 组件的render函数了
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    //render() { return h("div", "Hello World , hi " + this.msg); }
    // 拿到下一个vnode
    // 拿到代理对象， this指向它, render里面的this.msg -> 指向proxy上面的msg
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    // vnode -> 再次patch
    // (如果是不是组件类型 是element类型那就直接挂载到dom了)
    patch(subTree, container);
    // 把element的el传递给组件实例
    initialVNode.el = subTree.el;
}

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null,
        shapeFlag: getShapeFlag(type),
    };
    if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    else if (typeof children === "string") {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    // 判断 vnode.type 是组件还是element元素
    return typeof type === "string"
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
}

function creatApp(rootComponent) {
    // 返回一个app对象，里面带有mount方法(初始化挂载)
    return {
        mount: function (rootContainer) {
            // 根组件(render) -> vnode -> dom ->挂载到rootContainer
            // 1. 根组件 -> vnode(type type可以是vue component也可以是div等标签, props, children)
            var vnode = createVNode(rootComponent);
            // 2. 内部调用patch方法 ，进行递归的处理
            render(vnode, rootContainer);
        }
    };
}

// h函数的作用和createVNode函数是一样的，只是h函数的参数不同
function h(type, props, children) {
    return createVNode(type, props, children);
}

export { creatApp, h };
