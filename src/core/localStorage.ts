import {
  isObject,
  extend,
  JSONEncode,
  each,
  isUndefined
} from '../utils/tools'
import localStorage from '../utils/localStorage'
import cookie from '../utils/cookie'
import { CONFIG } from '../config/plugin'
import console from '../utils/console'

/**
 * 判断是否支持 localStorage
 */
function localStorageSupported () {
  let supported = true
  try {
    let key = '__pioSupport__',
      val = 'pio_web_data_sdk'
    localStorage.set(key, val)
    if (localStorage.get(key) !== val) {
      supported = false
    }
    localStorage.remove(key)
  } catch (error) {
    supported = false
  }
  if (!supported) {
    console.error('localStorage 不支持，自动退回到cookie存储方式')
  }
  return supported
}

export default class LocalStoreage {
  // 设置存储名称
  public name: string = ''
  public storage: any
  public props: any
  // 默认到期时间
  public defaultExpiry: string = ''
  // 到期时间
  public expireDays: string = ''
  // 关闭存储功能
  public disabled: boolean = false
  // cookie存储时，跨主域名存储配置
  public crossSubdomain: boolean = false
  // cookie是否只有在https协议下才能上传到服务器
  public secure: boolean = false
  constructor (config: any) {
    const ls = config.localStorage

    // 设置存储名称
    if (isObject(ls)) {
      this.name = ls.name || `${CONFIG.pluginName}-${config.token}-sdk`
      // 支持的存储类型
      let storageType = ls.type || 'cookie'
      // 是否支持localStorage
      this.storage =
        storageType === 'localStorage' && localStorageSupported()
          ? localStorage
          : cookie

      // 加载本地存储信息
      this.load()
      // 更新配置
      this.updateConfig(localStorage)
      // TODO: upgrade
      this.save()
    } else {
      console.error('localStorage配置设置错误')
    }
  }

  /**
   * 加载本地存储信息
   */
  load () {
    const localData = this.storage.parse(this.name)
    if (localData) {
      this.props = extend({}, localData)
    }
  }

  /**
   * 更新配置信息
   */
  updateConfig (localStorageConfig: any) {
    // 到期时间(cookie存储设置有效)
    this.defaultExpiry = this.expireDays = localStorageConfig.cookieExpiration
    this.setDisabled(localStorageConfig.disable)
    this.setCrossSubdomain(localStorageConfig.crossSubdomainCookie)
    this.setSecure(localStorageConfig.secureCookie)
  }

  /**
   * 设置关闭本地保存操作，设置为关闭后，本地数据移除
   * @param disabled
   */
  setDisabled (disabled: boolean) {
    this.disabled = disabled
    if (this.disabled) {
      this.remove()
    }
  }

  /**
   * 跨子域设置,cookie存储方式下有效
   * @param {Boolean} crossSubdomain
   */
  setCrossSubdomain (crossSubdomain: boolean) {
    if (crossSubdomain !== this.crossSubdomain) {
      this.crossSubdomain = crossSubdomain
      this.remove()
      this.save()
    }
  }

  /**
   * cookie存储方式下有效
   * cookie存储时，采用安全的方式存储数据，调用该方法后，重新保存数据
   * 当secure属性设置为true时，cookie只有在https协议下才能上传到服务器，
   * 而在http协议下是没法上传的，所以也不会被窃听
   * @param {Boolean} secure
   */
  setSecure (secure: boolean) {
    if (secure !== this.secure) {
      this.secure = secure ? true : false
      this.remove()
      this.save()
    }
  }

  // 数据保存到本地
  save () {
    // disabled配置为true, 数据不保存到本地
    if (this.disabled) {
      return
    }
    this.storage.set(
      this.name,
      JSONEncode(this.props),
      this.expireDays,
      this.crossSubdomain,
      this.secure
    )
  }

  /**
   * 移除本地数据
   */
  remove () {
    // cookie存储时，移除二级域以及子域下的cookie,此时参数有两个
    this.storage.remove(this.name, false)
    this.storage.remove(this.name, true)
  }

  /**
   * 清除存储的数据
   */
  clear () {
    this.remove()
    this['props'] = {}
  }

  // sdk升级，旧的sdk存储数据移到新的sdk存储数据中，然后删除旧的存储数据（暂不实现）
  // 存储方式改变，改为cookie切换到 localStorage
  upgrade (config: any) {}

  /**
   * 缓存指定的数据，同时将该数据保存到本地
   * @param {Object} props
   * @param {Number} days
   * @returns {Boolean} 返回true表示成功
   */
  register (props: any, days?: string) {
    if (isObject(props)) {
      this.expireDays = typeof days === 'undefined' ? this.defaultExpiry : days
      extend(this.props, props)
      this.save()
      return true
    }
    return false
  }

  /**
   * 只缓存一次指定的数据，下次设置该数据时不会覆盖前一次数据
   * 若想更新已设置的属性值，那么defaultValue参数值要等于本地缓存数据中需重置的属性的值(默认值)
   * this.props[prop] === defaultValue   prop为需更新的属性
   * @param {Object} props
   * @param {*} defaultValue
   * @param {Number} days
   * @returns {Boolean} 返回true表示成功
   */
  registerOnce (props: any, defaultValue?: any, days?: string) {
    if (isObject(props)) {
      if (typeof defaultValue === 'undefined') {
        defaultValue = 'None'
      }
      this.expireDays = typeof days === 'undefined' ? this.defaultExpiry : days
      const that = this
      each(
        props,
        function (val: any, prop: any) {
          if (!that.props[prop] || that.props[prop] === defaultValue) {
            that.props[prop] = val
          }
        },
        this
      )

      this.save()
      return true
    }
    return false
  }
  /**
   * 移除指定的缓存数据，同时也清除本地的对应数据
   * @param {string} prop
   */
  unregister (prop: string) {
    if (prop in this.props) {
      delete this['props'][prop]
      this.save()
    }
  }
  /**
   * 设置一个事件计时器，记录用户触发指定事件需要的时间，同时保存到本地
   * @param {String} eventName 该计时器的名称
   * @param {Date} timestamp 该计时器开始时间戳
   */
  setEventTimer (eventName: string, timestamp: Date) {
    const timers = this['props']['costTime'] || {}
    timers[eventName] = timestamp
    this['props']['costTime'] = timers
    this.save()
  }
  /**
   * 移除指定计时器，同时将本地存储的该计时器信息清除
   * @param {String} eventName
   * @returns {Date} 返回移除该计时器的时间戳
   */
  removeEventTimer (eventName: string) {
    const timers = this.props.costTime || {}
    const timestamp = timers[eventName]
    if (!isUndefined(timestamp)) {
      delete this.props.costTime[eventName]
      this.save()
    }
    return timestamp
  }
}
