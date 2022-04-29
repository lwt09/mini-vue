import { camelize, toHandlerOn } from "../shared/index";

export function emit(instance, event, ...args) {
  console.log(
    "2. 调用到子组件的emit ， 去寻找父组件传递的props里面有没有对应的函数 ， 有的话就执行"
  );

  // on Event 放在props里面， 所以要去拿的话要拿到instance.props
  // 那就要拿到insatnce 实例， 用户调用emit时候不可能传递给组件实例的，所以要在赋值emit给组件的时候
  // 就把实例bind到emit函数 上面
  const { props } = instance;

  //  去掉驼峰 加上on
  const handlerName = toHandlerOn(camelize(event));
  const handlder = props[handlerName];
  handlder && handlder(event, ...args);
}
