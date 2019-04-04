import { isObject, extend } from '../utils/tools'
import uuid from '../utils/uuid'
import { DEFAULT_CONFIG, CONFIG, IConfig } from '../config/plugin'
import EventTrack from './evenTrack'
import console from '../utils/console'
import cache from './cache'
import Frame from './router'

// 本地存储
import LocalStoreage from './localStorage'

export default class Track {
  // 实例使用的配置
  public config!: { [key: string]: any }
  // 自定义localStorage实例
  public localStorage!: LocalStoreage
  // event实例
  public event!: EventTrack
  // 框架router实例
  public router!: Frame
  constructor (token: string, config: IConfig) {
    if (cache.loaded) {
      return
    }
    cache.loaded = true
    // 全局单例缓存
    cache.instance = this

    this.config = {}
    // 更新设置
    this.setConfig(extend({}, DEFAULT_CONFIG, CONFIG, config, { token }))

    // 创建LocalStorage实例
    this.localStorage = new LocalStoreage(this.config)
    // 创建框架Router实例
    this.router = new Frame()

    // 实例化追踪事件对象
    this.event = new EventTrack()

    // 执行created钩子
    this.created()
    // 设置设备凭证
    this.setDeviceId()

    // 配置自动触发pv或检测session
    this.trackPv()

    // persistedTime 首次访问应用时间
    this.localStorage.registerOnce({ persistedTime: new Date().getTime() }, '')
  }

  /**
   * 配置自动触发pv或检测session
   */
  public trackPv (properties?: any, callback?: Function) {
    // 配置为自动触发PV事件
    if (this.getConfig('pageview')) {
      this.event.trackPv(properties, callback)
    } else {
      // 若没有自动触发事件，还需检测session (说明：当触发PV 时，实际已经检测了session)
      this.event.session()
    }
  }

  /**
   *  sdk初始化之前触发的钩子函数，该方法必须在初始化子模块前以及上报数据前使用
   */
  public created () {
    try {
      this.getConfig('created')(this)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 设置本地设备凭证
   * 若是首次访问（本地无设备凭证），上报用户首次访问网站事件
   */
  public setDeviceId () {
    let trackData = {}
    if (!this.getDeviceId()) {
      // 生成凭证
      this.localStorage.registerOnce({ deviceId: uuid() }, '')
      // 追踪事件
      this.event.trackEvent('activate')
    }
    return trackData
  }
  /**
   * 设置配置
   * @param {Object} config
   */
  public setConfig (config: Object) {
    if (isObject(config)) {
      this.config = extend(this.config, config)
      CONFIG.debug = CONFIG.debug || this.getConfig('debug')
    }
  }

  /**
   * 获取某个配置
   * @param {String} name
   */
  public getConfig (name: string) {
    return this.config[name]
  }

  // 获取唯一凭证（设备标记）
  public getDeviceId () {
    return this.getProperty('deviceId')
  }

  // 获取指定本地存储属性（缓存和本地）
  public getProperty (propName: string) {
    return this.localStorage.props[propName]
  }
}
