export function debounce(func, wait = 20, immediate = true) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
export function throttle(func, wait, options) {
    var timeout, context, args;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function() {
        var now = new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
    };
    return throttled;
}
export function isParentOfTarget(selector, target, until=document.documentElement) {
    let parent = target;
    while(parent !== until) {
        if(parent.matches(selector)) {
            return parent;
        }
        parent = parent.parentNode;
    }
    return false;
}

//事件委托   element:委托的元素  selsctor:触发元素的选择器
export function delegate(element, selector, event, hanlder) {
    element.addEventListener(event, function(event) {
        const target = event.target;
        const res = isParentOfTarget(selector, target, element);
        if(!res) {
            return;
        }
        hanlder.call(res, event);
    }, false);
}

