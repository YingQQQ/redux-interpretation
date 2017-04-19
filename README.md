# redux-interpretation

重写redux,对redux源码进行中文标注;

使用typescript对Redux进行重写。

更加了解redux，其实就是一个配分器

creatStore: 创建一个初始的仓库。传入参数一个reducer函数和preloadedState(可以是[]|{}) 返回方法：getState, dispatch, subscribe, replaceReducer, observable

dispatch: 改变初始状态。添加或者删减。 根据你传入的reducer来决定。返回的是你传入的action; 在react中使用的时候常常配合的是一个switch函数。一般使用的时候dispatch中不会有监听函数的触发。只有当使用subscribe的时候才会传入函数。这个时候就可以dispatch来执行。当然subscribe返回一个unsubscribe方法，可以直接解绑需要监听的函数。

replaceReducer: 一般在hot-loader(dev)的时候使用。替换的是整个reducer;

observable: 其实是一个迷你的观察者模式的实现不对外暴露,对象包括一个subscribe方法和observable的方法;

[observable模式](https://segmentfault.com/a/1190000008809168)详细介绍

compose: 可以用扁平的方式处理深层嵌套。

combineReducers: 就是遍历并执行传入的多个reducer函数,返回一个可能更改过的state的{};

bindActionCreators: 其实就是遍历并用dispatch执行传入的actionFunc函数,返回一个dispatch(actionFunc)的{};

redux源码其实很短,大部分都是错误处理。不过可以学的地方很多。重写其实学习的好方法。虽然有点笨:)
