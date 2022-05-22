import mitt from 'mitt'
import _ from 'lodash';
const eventBus = {}

const emitter = mitt()
// 发布（自定义$emit发布方法）
// 这里做了$emit方法能够携带多个参数的处理，方便我们再业务中触发事件时带多个参数
eventBus.$emit = (...args) => {
    emitter.emit(_.head(args), args.slice(1));
};

// 订阅（定义$on订阅方法）
eventBus.$on = function () {
    Reflect.apply(emitter.on, emitter, _.toArray(arguments));
    // Reflect.apply(emitter.on, emitter, _.toArray(arguments));
};

// 取消订阅
eventBus.$off = function () {
    Reflect.apply(emitter.off, emitter, _.toArray(arguments));
};

export default eventBus