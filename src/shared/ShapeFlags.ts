export const enum ShapeFlags {
  ELEMENT = 1, // 0001
  STATEFUL_COMPONENT = 1 << 1, // 0010
  TEXT_CHILDREN = 1 << 2, //0100
  ARRAY_CHILDREN = 1 << 3, //1000
  SLOTS_CHILDREN = 1 << 4, //10000
}

// 二进制情况下  0100 | 0000 = 0100
// 二进制情况下  0100 & 0011 = 0000
// 通过这个来 设置vnode 的shapeflag 通过获取shapeflag
