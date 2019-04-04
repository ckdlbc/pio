import cache from './core/cache'
import { isObject } from './utils/tools'

/**
 * 追踪事件（上报用户事件触发数据）
 * @param {String} eventName 事件名称（必须）
 * @param {Function} vmFnProperties 事件属性函数或对象
 */
export const trackEvent = (
  eventName: string,
  vmFnProperties?: ((vm: any) => any) | ({ [key: string]: any })
) => {
  if (cache.loaded) {
    const properties = isObject(vmFnProperties) ? vmFnProperties : {}
    cache.instance.event.trackEvent(eventName, properties)
  }
  return (target: any, property: string, descriptor: PropertyDescriptor) => {
    const oldValue = descriptor.value
    descriptor.value = function () {
      const properties =
        typeof vmFnProperties === 'function' ? vmFnProperties(this) : {}
      cache.instance.event.trackEvent(eventName, properties)
      return oldValue.apply(this, arguments)
    }
  }
}
