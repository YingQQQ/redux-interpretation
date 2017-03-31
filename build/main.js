/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ((...funcs) => {
    if (funcs.length === 0) {
        return arg => arg;
    }
    if (funcs.length === 1) {
        return funcs[0];
    }
    // 解决深度套嵌
    return funcs.reduce((a, b) => (...args) => a(b(...args)));
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_symbol_observable__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_symbol_observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_symbol_observable__);
/* harmony export (immutable) */ __webpack_exports__["a"] = createStore;

/**
 * Redux 私有的初始化值.
 * 没有设置任何 actions 你就能返回这个初始值.
 */
const ActionTypes = {
    INIT: '@@redux/INIT'
};
/* harmony export (immutable) */ __webpack_exports__["b"] = ActionTypes;

function createStore(reducer, preloadedState, enhancer) {
    /**
     * 判断参数类型
     */
    if (typeof preloadedState === 'function' && enhancer === undefined) {
        enhancer = preloadedState;
        preloadedState = undefined;
    }
    if (enhancer !== undefined) {
        return enhancer(createStore)(reducer, preloadedState);
    }
    /**
     * 初始化数据
     */
    let currentReducer = reducer;
    let currentState = preloadedState;
    let currentListeners = [];
    let nextListeners = currentListeners;
    let isDispatching = false;
    /**
     * 创建复制的新数组
     */
    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice();
        }
    }
    /**
     * 获取当前状态
     */
    function getState() {
        return currentState;
    }
    /**
     * 添加更改侦听器。随时调用动作
     * 状态树的某些部分可能会发生变化。你可以
     * 从更改侦听器中调用`dispatch(),其实就是观察者模式的运用
     * 返回unsubscribe利用闭包调整队列
     */
    function subscribe(listener) {
        let isSubscribe = true;
        ensureCanMutateNextListeners();
        nextListeners.push(listener);
        return function unsubscribe() {
            if (!isSubscribe) {
                return;
            }
            isSubscribe = false;
            /**
             * 更新当前的监听队列
             */
            ensureCanMutateNextListeners();
            const index = nextListeners.indexOf(listener);
            nextListeners.splice(index, 1);
        };
    }
    function dispatch(action) {
        try {
            isDispatching = true;
            currentState = currentReducer(currentState, action);
        }
        finally {
            isDispatching = false;
        }
        const listeners = currentListeners = nextListeners;
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }
        return action;
    }
    /**
     * 重新定义接口函数
     * 并且初始化
     * @param  {function} nextReducer 新的函数
     * @return none
     */
    function replaceReducer(nextReducer) {
        currentReducer = nextReducer;
        dispatch({
            type: ActionTypes.INIT
        });
    }
    /**
     * 最小化的观察者模式
     */
    function observable() {
        const outerSubscribe = subscribe;
        return {
            subscribe(observer) {
                if (typeof observer !== 'object') {
                    throw new TypeError('Expected the observer to be an object.');
                }
                function observeState() {
                    if (observer.next) {
                        observer.next(getState());
                    }
                }
                observeState();
                const unsubscribe = outerSubscribe(observeState);
                return { unsubscribe };
            },
            [__WEBPACK_IMPORTED_MODULE_0_symbol_observable___default.a]() {
                return this;
            }
        };
    }
    /**
     * 手动定义初始值
     */
    dispatch({
        type: ActionTypes.INIT
    });
    return {
        dispatch,
        subscribe,
        getState,
        replaceReducer,
        [__WEBPACK_IMPORTED_MODULE_0_symbol_observable___default.a]: observable
    };
}
;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compose__ = __webpack_require__(0);

/* harmony default export */ __webpack_exports__["a"] = ((...middlewares) => {
    return (createStore) => (reducer, preloadedState, enhancer) => {
        const store = createStore(reducer, preloadedState, enhancer);
        let dispatch = store.dispatch;
        const middlewaresApi = {
            getState: store.getState,
            dispatch: action => dispatch(action)
        };
        const chain = middlewares.map(middleware => middleware(middlewaresApi));
        dispatch = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__compose__["a" /* default */])(...chain)(store.dispatch);
        return Object.assign({ dispatch }, store);
    };
});


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_warning__ = __webpack_require__(7);

const hasOwnProperty = {}.hasOwnProperty;
const bindActionCreator = (actionCreator, dispatch) => (...args) => dispatch(actionCreator(...args));
/* harmony default export */ __webpack_exports__["a"] = ((actionCreators, dispatch) => {
    if (typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch);
    }
    if (typeof actionCreators !== 'object' || actionCreators === null) {
        throw new Error('please check your actionCreators type');
    }
    const boundActionCreators = {};
    for (let key in actionCreators) {
        const actionCreator = actionCreators[key];
        if (hasOwnProperty.call(actionCreators, key) && typeof actionCreator === 'function') {
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
        }
        else {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_warning__["a" /* default */])(`bindActionCreators expected a function actionCreator for key '${key}', instead received type '${typeof actionCreator}'.`);
        }
    }
    return boundActionCreators;
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_isPlainObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__createStore__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["a"] = combineReducers;


function getUndefinedStateErrorMessage(key, action) {
    const actionType = action && action.type;
    const actionName = (actionType && `"${actionType.toString()}"`) || 'an action';
    return (`Given action ${actionName}, reducer "${key}" returned undefined. ` +
        `To ignore an action, you must explicitly return the previous state. ` +
        `If you want this reducer to hold no value, you can return null instead of undefined.`);
}
function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
    const reducerKeys = Object.keys(reducers);
    const argumentName = action && action.type === __WEBPACK_IMPORTED_MODULE_1__createStore__["b" /* ActionTypes */].INIT ?
        'preloadedState argument passed to createStore' :
        'previous state received by the reducer';
    if (reducerKeys.length === 0) {
        return ('Store does not have a valid reducer. Make sure the argument passed ' +
            'to combineReducers is an object whose values are reducers.');
    }
    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_isPlainObject__["a" /* default */])(inputState)) {
        return (`The ${argumentName} has unexpected type of "` +
            ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] +
            `". Expected argument to be an object with the following ` +
            `keys: "${reducerKeys.join('", "')}"`);
    }
    const unexpectedKeys = Object.keys(inputState).filter(key => !reducers.hasOwnProperty(key) &&
        !unexpectedKeyCache[key]);
    unexpectedKeys.forEach(key => {
        unexpectedKeyCache[key] = true;
    });
    if (unexpectedKeys.length > 0) {
        return (`Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
            `"${unexpectedKeys.join('", "')}" found in ${argumentName}. ` +
            `Expected to find one of the known reducer keys instead: ` +
            `"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`);
    }
}
function assertReducerSanity(reducers) {
    Object.keys(reducers).forEach(key => {
        const reducer = reducers[key];
        const initialState = reducer(undefined, { type: __WEBPACK_IMPORTED_MODULE_1__createStore__["b" /* ActionTypes */].INIT });
        if (typeof initialState === 'undefined') {
            throw new Error(`Reducer "${key}" returned undefined during initialization. ` +
                `If the state passed to the reducer is undefined, you must ` +
                `explicitly return the initial state. The initial state may ` +
                `not be undefined. If you don't want to set a value for this reducer, ` +
                `you can use null instead of undefined.`);
        }
        const type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
        if (typeof reducer(undefined, { type }) === 'undefined') {
            throw new Error(`Reducer "${key}" returned undefined when probed with a random type. ` +
                `Don't try to handle ${__WEBPACK_IMPORTED_MODULE_1__createStore__["b" /* ActionTypes */].INIT} or other actions in "redux/*" ` +
                `namespace. They are considered private. Instead, you must return the ` +
                `current state for any unknown actions, unless it is undefined, ` +
                `in which case you must return the initial state, regardless of the ` +
                `action type. The initial state may not be undefined, but can be null.`);
        }
    });
}
/**
 * 把reducer函数对象整合为单一reducer函数，它会遍历所有的子reducer成员，并把结果整合进单一状态树
 * 这个状态树对象的key值和函数名保持一致
 *
 * 参数即为reducers对象
 *
 * 返回的函数在执行的时候，会遍历reducers返回结果
 *
 */
function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers);
    const finalReducers = {};
    for (let i = 0; i < reducerKeys.length; i++) {
        const key = reducerKeys[i];
        if (process.env.NODE_ENV !== 'production') {
            if (typeof reducers[key] === 'undefined') {
                // warning(`No reducer provided for key "${key}"`);
            }
        }
        if (typeof reducers[key] === 'function') {
            finalReducers[key] = reducers[key];
        }
    }
    const finalReducersKeys = Object.keys(finalReducers);
    let unexpectedKeyCache;
    if (process.env.NODE_ENV !== 'production') {
        unexpectedKeyCache = {};
    }
    let sanityError;
    try {
        // 检查每个reducer
        assertReducerSanity(finalReducers);
    }
    catch (e) {
        sanityError = e;
    }
    return function combination(state = {}, action) {
        if (sanityError) {
            throw sanityError;
        }
        // dev开发中的错误处理
        if (process.env.NODE_ENV !== 'production') {
            const warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
            if (warningMessage) {
                // warning(warningMessage);
            }
        }
        const nextState = {};
        let hasChanged = false;
        for (let i = 0; i < finalReducersKeys.length; i++) {
            const key = finalReducersKeys[i];
            const reducer = finalReducers[key];
            const previousStateForKey = state[key];
            const nextStateForKey = reducer(previousStateForKey, action);
            if (typeof nextStateForKey === 'undefined') {
                const errorMessage = getUndefinedStateErrorMessage(key, action);
                throw new Error(errorMessage);
            }
            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        return hasChanged ? nextState : state;
    };
}

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(8)))

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__combineReducers__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__compose__ = __webpack_require__(0);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "createStore", function() { return __WEBPACK_IMPORTED_MODULE_0__createStore__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "combineReducers", function() { return __WEBPACK_IMPORTED_MODULE_1__combineReducers__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "bindActionCreators", function() { return __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "applyMiddleware", function() { return __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "compose", function() { return __WEBPACK_IMPORTED_MODULE_4__compose__["a"]; });








/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const objectProto = Object.prototype;
const funcToString = Function.prototype.toString;
// 检查原型
const hasOwnProperty = objectProto.hasOwnProperty;
const toString = objectProto.toString;
const symToString = Symbol ? Symbol.toString : undefined;
// 获取'Object'的 'constructor';
const objectCtorString = funcToString.call(Object);
const getValueTag = (value) => {
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
    }
    catch (e) { }
    ;
    const result = toString.call(value);
    if (canMasked) {
        value[symToString] = tag;
    }
    else {
        delete value[symToString];
    }
    return result;
};
const isObjectLike = (value) => value != null && typeof value === 'object';
/* harmony default export */ __webpack_exports__["a"] = ((value) => {
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
});


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ((messages) => {
    if (console && typeof console.error === 'function') {
        console.error(messages);
    }
    try {
        throw new Error(messages);
        /* tslint:disable-next-line: no-empty */
    }
    catch (e) { }
});


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = __webpack_require__(11);

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12), __webpack_require__(13)(module)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map