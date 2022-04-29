export const extend = Object.assign;

export function isObject(val) {
  return val !== null && typeof val === "object";
}

export function isChanged(oldVal, newVal) {
  return Object.is(oldVal, newVal) ? false : true;
}

export const hasOwn = (raw, key) => raw.hasOwnProperty(key);

//   add-foo --> addFoo
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (match, group1) => {
    //str--> 'add-foo' ,  match ---> '-f'  , group1 --(\w)--> 'f'
    return group1 ? group1.toUpperCase() : "";
  });
};
//   event('add') --> Add
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
//   Add --> onAdd
export const toHandlerOn = (event: string) => {
  return `on${capitalize(event)}`;
};
