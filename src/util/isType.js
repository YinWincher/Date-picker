function isType(type){
    return function(val){
        return Object.prototype.toString.call(val) === `[object ${type}]`;
    };
}
export const isArray = isType("Array");
export const isNull = isType("Null");
export const isUndefined = isType("Undefined");
export const isString = isType("Function");
export const isFunction = isType("Function");
export const isBoolean = isType("Boolean");
export const isDate = isType("Date");