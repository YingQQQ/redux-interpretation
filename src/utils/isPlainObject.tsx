const objectProto = Object.prototype;
const funcToString = Function.prototype.toString;
// 检查原型
const hasOwnProperty = objectProto.hasOwnProperty;
const toString = objectProto.toString;
const symToString: any = Symbol ? Symbol.toString : undefined;
// 获取'Object'的 'constructor';
const objectCtorString = funcToString.call(Object);

const getValueTag = (value): string => {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  /**
   * var sym = Symbol("foo");
   * var obj = {[sym]: 1};
   * obj[sym]; ==> 1
   * obj[Object(sym)];    still 1
   */
  if (!(symToString && symToString in Object(value))) {
    return toString.call(value);
  }
  const isOwn = hasOwnProperty.call(value, symToString);
  const tag = value[symToString];
  let canMasked = false;
  try {
    value[symToString] = undefined;
    canMasked = true;
  /* tslint:disable-next-line: no-empty */
  } catch (e) {};

  const result: string = toString.call(value);
  if (canMasked) {
    value[symToString] = tag;
  } else {
    delete value[symToString];
  }
  return result;
};

const isObjectLike = (value): boolean => value != null && typeof value === 'object';

export default (value): boolean => {
  if (!isObjectLike(value) || getValueTag(value) !== '[object Object]') {
    return false;
  }
  /*
  当 const something = Object.creat(null);
   */
  const proto = Object.getPrototypeOf(value);
  if (!proto) {
    return true;
  }
  const ctor = hasOwnProperty.call(value, 'constructor') && proto.constructor;

  return typeof ctor === 'function' && funcToString.call(value) === objectCtorString;
};
