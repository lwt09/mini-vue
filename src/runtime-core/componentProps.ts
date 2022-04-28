export function initProps(instance, rawProps) {
  // 把vnode上面的props传递给instance上面的props
  instance.props = rawProps || {};
}
