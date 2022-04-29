import { render } from "./renderer"
import { createVNode } from "./vnode"

export function createApp(rootComponent){
    // 返回一个app对象，里面带有mount方法(初始化挂载)
    return {
        mount(rootContainer){
            // 根组件(render) -> vnode -> dom ->挂载到rootContainer
 
            // 1. 根组件 -> vnode(type type可以是vue component也可以是div等标签, props, children)
            const vnode  = createVNode(rootComponent)

            // 2. 内部调用patch方法 ，进行递归的处理
            render(vnode, rootContainer)
        }
    }
}
