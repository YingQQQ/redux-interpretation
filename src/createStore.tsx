import $$observable from 'symbol-observable';

/**
 * Redux 私有的初始化值.
 * 没有设置任何 actions 你就能返回这个初始值.
 */
export const ActionTypes = {
  INIT: '@@redux/INIT'
};

interface TypeConfig {
  type: string;
  [propName: string]: string;
}

export default function createStore (reducer: Function, preloadedState?: any, enhancer?: Function) {
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
  let currentReducer: Function = reducer;
  let currentState: any = preloadedState;
  let currentListeners: any[] = [];
  let nextListeners: Function[] = currentListeners;
  let isDispatching: boolean = false;

  /**
   * 创建复制的新数组
   */
  function ensureCanMutateNextListeners (): void {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * 获取当前状态
   */
  function getState (): any {
    return currentState;
  }
  /**
   * 添加更改侦听器。随时调用动作
   * 状态树的某些部分可能会发生变化。你可以
   * 从更改侦听器中调用`dispatch(),其实就是观察者模式的运用
   * 返回unsubscribe利用闭包调整队列
   */
  function subscribe (listener: Function): Function {
    let isSubscribe: boolean = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe () {
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

  function dispatch<T> (action: T): T {
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
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
  function replaceReducer (nextReducer): void {
    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.INIT
    });
  }
  /**
   * 最小化的观察者模式
   */
  function observable () {
    const outerSubscribe = subscribe;
    return {
      subscribe (observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }
        function observeState () {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        const unsubscribe = outerSubscribe(observeState);
        return { unsubscribe };
      },
      [$$observable] () {
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
    [$$observable]: observable
  };
};
