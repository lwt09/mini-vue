'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var extend = Object.assign;
function isObject(val) {
    return val !== null && typeof val === "object";
}
var hasOwn = function (raw, key) { return raw.hasOwnProperty(key); };
//   add-foo --> addFoo
var camelize = function (str) {
    return str.replace(/-(\w)/g, function (match, group1) {
        //str--> 'add-foo' ,  match ---> '-f'  , group1 --(\w)--> 'f'
        return group1 ? group1.toUpperCase() : "";
    });
};
//   event('add') --> Add
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
//   Add --> onAdd
var toHandlerOn = function (event) {
    return "on" + capitalize(event);
};

// target --> key --->dep
// 把依赖放到 对应的对象的属性映射表里面去
var targetMap = new Map();
// 通过target - key - 拿到要触发的依赖
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    var dep = depsMap.get(key);
    if (!dep)
        return;
    // 触发dep的所有依赖
    triggerEffect(dep);
}
function triggerEffect(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else
            effect_1.run();
    }
}

var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly, isShallowReadonly) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (isShallowReadonly === void 0) { isShallowReadonly = false; }
    return function get(target, key) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        var res = Reflect.get(target, key);
        if (isShallowReadonly) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        var res = Reflect.set(target, key, value);
        // todo 触发依赖
        trigger(target, key);
        return res;
    };
}
var multableHandlers = {
    get: get,
    set: set,
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, value) {
        console.warn(key + " \u4FEE\u6539set\u5931\u8D25, \u56E0\u4E3A target \u662F\u53EA\u8BFB\u7684readonly\u7C7B\u578B");
        return true;
    },
};
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});

function reactive(raw) {
    return createProxyObject(raw, multableHandlers);
}
function readonly(raw) {
    return createProxyObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createProxyObject(raw, shallowReadonlyHandlers);
}
// 生成 proxy
function createProxyObject(raw, baseHandlers) {
    // 传入的raw必须是一个对象o
    if (!isObject(raw)) {
        console.warn("target " + raw + " \u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61\u7684");
        return raw;
    }
    return new Proxy(raw, baseHandlers);
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    console.log("2. 调用到子组件的emit ， 去寻找父组件传递的props里面有没有对应的函数 ， 有的话就执行");
    // on Event 放在props里面， 所以要去拿的话要拿到instance.props
    // 那就要拿到insatnce 实例， 用户调用emit时候不可能传递给组件实例的，所以要在赋值emit给组件的时候
    // 就把实例bind到emit函数 上面
    var props = instance.props;
    //  去掉驼峰 加上on
    var handlerName = toHandlerOn(camelize(event));
    var handlder = props[handlerName];
    handlder && handlder.apply(void 0, __spreadArray([event], args, false));
}

function initProps(instance, rawProps) {
    // 把vnode上面的props传递给instance上面的props
    instance.props = rawProps || {};
}

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
        var setupState = instance.setupState, props = instance.props;
        // if (key in setupState) {
        //   return setupState[key];
        // }
        // 判断对象内有没有这个key
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        // $el 等
        if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
        }
    },
};

function initSlots(instance, children) {
    // 组件&slot children
    if (instance.vnode.shapeFlag & 16 /* SLOTS_CHILDREN */) {
        normalizeSlots(instance, children);
    }
}
function normalizeChildren(value) {
    return Array.isArray(value) ? value : [value];
}
function normalizeSlots(instance, children) {
    var _loop_1 = function (key) {
        if (Object.prototype.hasOwnProperty.call(children, key)) {
            var value_1 = children[key];
            instance.slots[key] = function (prop) { return normalizeChildren(value_1(prop)); };
        }
    };
    for (var key in children) {
        _loop_1(key);
    }
}

// 组件instance -> 通过 vnode创建，  { vnode, type(vnode.type) , setupState  , proxy  , 组件的render函数 }
function createComponentInstance(vnode) {
    // 初始化组件, 返回一个对象 , 内部包含
    var component = {
        vnode: vnode,
        type: vnode.type,
        // setup 返回值
        setupState: {},
        // props:
        props: {},
        // emit
        emit: function () { },
        // slots
        slots: {},
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // initProps 把h函数(createVNode)传递过来的props  赋值给组件实例的props
    initProps(instance, instance.vnode.props);
    // initSlots
    initSlots(instance, instance.vnode.children);
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
        //   setup可以返回一个 object 或者一个function , 再在setup里面被接收
        var setupResult = setup(shallowReadonly(instance.props), {
            // 传入emit给子组件， 让子组件可以调用父组件的emit
            emit: instance.emit,
        });
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
            if (/^on[A-Z]/.test(key)) {
                var event_1 = key.slice(2).toLowerCase();
                el.addEventListener(event_1, element);
            }
            else {
                el.setAttribute(key, element);
            }
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
    // 拿到代理对象， this指向它, render里面的this.msg -> 指向proxy上面的msg -> 会去拿setupState.msg
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
    // 判断是children是数组还是text
    if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    else if (typeof children === "string") {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    // 判断children是不是slot (obj & 组件)
    if (vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        if (typeof children === "object") {
            vnode.shapeFlag |= 16 /* SLOTS_CHILDREN */;
        }
    }
    return vnode;
}
function getShapeFlag(type) {
    // 判断 vnode.type 是组件还是element元素
    return typeof type === "string"
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
}

function createApp(rootComponent) {
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

function renderSlots(slots, key, data) {
    // slots  -> Array<VNode>
    // return createVNode('div' , {} , slots)
    // slots -> obj<key:vnode>
    var slot = slots[key];
    if (slot) {
        if (typeof slot === "function") {
            return createVNode("div", {}, slot(data));
        }
    }
}

exports.createApp = createApp;
exports.h = h;
exports.renderSlots = renderSlots;
