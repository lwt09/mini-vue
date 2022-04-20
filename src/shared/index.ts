export const extend = Object.assign;

export function isObject(val) {
  return val !== null && typeof val === "object";
}

export function isChanged(oldVal, newVal) {
  return Object.is(oldVal, newVal) ? false : true;
}
