import Track from './track'
import cache from './cache'
import LocalStorage from './localStorage'
import innerEvent from '../utils/innerEvent'
import {
  isUndefined,
  isFunction,
  JSONDecode,
  JSONEncode,
  extend,
  isNumber,
  truncate
} from '../utils/tools'
import { CONFIG } from '../config/plugin'
import { EVENT_TYPES, SYSTEM_EVENTS } from '../config/eventType'
import baseInfo from '../collect/baseInfo'
import uuid from '../utils/uuid'
import console from '../utils/console'
import sendRequest from './request'

export default class EventTrack {
  // Track实例
  public instance!: Track
  // localStorage实例
  public localStorage!: LocalStorage

  constructor () {
    this.instance = cache.instance
    this.localStorage = this.instance.localStorage

    // 初始化时间（事件相关）
    this.localStorage.registerOnce({
      updatedTime: 0,
      sessionStartTime: 0,
      previousStayTime: 0,
      currentStayTime: 0,
      entryTime: 0,
      parentUrl: '/'
    })

    // 将当前的referrer保存到本地缓存
    this.localStorage.register({
      sessionReferrer: document.referrer
    })

    // 单页面触发PV事件时，设置 referrer
    innerEvent.on(
      'singlePage:change',
      (eventName: string, urlParams: string) => {
        this.localStorage.register({
          sessionReferrer: document.URL
        })
      }
    )
  }

  /**
   * TODO
   * 判断指定事件是否被禁止上报
   * @param {String} eventName
   * @returns {Boolean}
   */
  eventIsDisabled (eventName: string) {
    return false
  }
  /**
   * 打开新会话
   */
  startNewSession () {
    this.localStorage.register({
      sessionUuid: uuid(),
      sessionStartTime: new Date().getTime()
    })
    this.trackEvent('sessionStart')
  }
  /**
   * TODO
   * 关闭当前会话
   */
  closeCurrentSession () {
    /*
     为了便于绘制用户事件发生轨迹图，区分会话close和最后一次事件触发时间的顺序，会话关闭时间需要做些微调
     1. 如果本地拿到了上次（非会话事件）事件的触发时间，time = this.instance.getProperty('LASTEVENT').time + 1;
     2. 如果未拿到，time = new Date().getTime() - 1;
    */
    let time = new Date().getTime() - 1
    const sessionStartTime = this.instance.getProperty('sessionStartTime')
    const LASTEVENT = this.instance.getProperty('LASTEVENT')
    if (LASTEVENT && LASTEVENT.time) {
      time = LASTEVENT.time + 1
    }
    const sessionTotalLength = time - sessionStartTime
    if (sessionTotalLength >= 0) {
      this.trackEvent('sessionClose', {
        sessionCloseTime: time,
        sessionTotalLength: sessionTotalLength
      })
    }
  }
  /**
   * 判断会话重新开启
   * 判断条件：会话首次开始、指定的一段时间内用户无事件操作、其它渠道进来
   */
  session (callback?: Function, dataType?: string) {
    let sessionStartTime =
      (1 * this.instance.getProperty('sessionStartTime')) / 1000
    let updatedTime = (1 * this.instance.getProperty('updatedTime')) / 1000
    let now = new Date().getTime()
    let nowDateTimeMs = now
    let nowDateTimeSe = (1 * nowDateTimeMs) / 1000
    let currentStayTime = this.instance.getProperty('currentStayTime')
    let previousStayTime = this.instance.getProperty('previousStayTime')
    let entryTime = this.instance.getProperty('entryTime')
    // 停留时间
    if (!dataType) {
      entryTime = now
      currentStayTime = 0
      previousStayTime = now - this.instance.getProperty('updatedTime')
    } else if (dataType !== 'pv') {
      currentStayTime = now - entryTime
    }
    // 其它渠道判断
    // const other_channel_Bool = this._check_channel()
    // 会话结束判断
    if (
      sessionStartTime === 0 ||
      nowDateTimeSe >
        updatedTime + 60 * this.instance.getConfig('sessionIntervalMins') ||
      ''
      // other_channel_Bool
    ) {
      // 当会话首次开始时，不用发送会话关闭事件
      if (sessionStartTime === 0) {
        // 新打开一个会话
        this.startNewSession()
      } else {
        this.closeCurrentSession()
        this.startNewSession()
      }
    }

    // 更新本地的最后事件操作时间
    this.localStorage.register({
      updatedTime: nowDateTimeMs,
      previousStayTime,
      entryTime,
      currentStayTime
    })
    // 执行回调方法
    if (callback && isFunction(callback)) {
      setTimeout(callback, 0)
    }
  }

  /**
   * 发送PV事件，在此之前检测session
   * @param {Object} properties  pv属性
   * @param {*} callback
   */
  trackPv (properties?: any, callback?: Function) {
    this.session(() => {
      this.trackEvent('pv', extend({}, properties), callback)
    })
  }

  /**
   * 追踪事件（上报用户事件触发数据）
   * @param {String} eventName 事件名称（必须）
   * @param {Object} properties 事件属性
   * @param {Function} callback 上报后的回调方法
   * @param {String} eventType 自定义事件类型
   * @returns {Object} track_data 上报的数据
   */
  trackEvent (
    eventName: string,
    properties?: any,
    callback?: Function,
    eventType?: string
  ) {
    if (isUndefined(eventName)) {
      console.error('上报数据需要一个事件名称')
      return
    }
    if (!isFunction(callback)) {
      callback = function () {}
    }
    if (this.eventIsDisabled(eventName) && callback) {
      callback(0)
      return
    }
    // 重新在本地取数据读取到缓存
    this.localStorage.load()
    // 事件属性
    properties = properties || {}
    // 标记：传入的属性另存一份
    let userSetProperties = JSONDecode(JSONEncode(properties)) || {}
    let costTime
    // 移除该事件的耗时监听器，获取设置监听器的时间戳，计算耗时
    const startListenTimestamp = this.localStorage.removeEventTimer(eventName)
    if (!isUndefined(startListenTimestamp)) {
      costTime = new Date().getTime() - startListenTimestamp
    }
    // 默认事件类型设置
    let dataType = EVENT_TYPES.BUSSINESS_EVENT_TYPE
    // 事件类型设置为传入了自定义事件类型
    if (eventType) {
      dataType = eventType
    } else if (SYSTEM_EVENTS[eventName]) {
      // 如果是内置事件,事件类型重新设置
      dataType = SYSTEM_EVENTS[eventName].dataType
    }

    // 事件触发时间
    let time = new Date().getTime()
    // 会话有时间差
    // 触发的事件若是会话结束，触发时间要重新设置
    // 若事件id为会话关闭，需要删除传入的自定义属性
    if (eventName.includes('sessionClose')) {
      time = properties.sessionCloseTime
      delete userSetProperties['sessionCloseTime']
      delete userSetProperties['sessionTotalLength']
    }

    // 设置通用的事件属性
    userSetProperties = extend(
      {},
      this.instance.getProperty('superProperties'),
      userSetProperties
    )

    const currentUrl = window.location.href.split('?')[0]
    // 用户clientId
    const uid = this.instance.getConfig('uid')()
    // 系统上报数据
    let sysData = {
      // 埋点事件类型，se:工具自动埋点，be:业务手动埋点
      dataType,
      // sdk类型 （js，小程序、安卓、IOS、server、pc）
      sdkType: 'js',
      // 引入的sdk版本
      sdkVersion: CONFIG.version,
      // 事件名称
      eventName,
      // 事件触发时间
      time,
      // 用户首次访问时间
      persistedTime: this.instance.getProperty('persistedTime'),
      // 客户端唯一凭证(设备凭证)
      deviceId: this.instance.getDeviceId(),
      // 页面打开场景, 默认 Browser
      pageOpenScene: 'Browser',
      // 应用凭证
      token: this.instance.getConfig('token'),
      costTime,
      // 当前关闭的会话时长
      sessionTotalLength: properties.sessionTotalLength,
      // 当前会话id
      sessionUuid: this.instance.getProperty('sessionUuid'),
      // 当前页停留时间
      currentStayTime: this.instance.getProperty('stayTime'),
      // 上一页停留时间
      previousStayTime: this.instance.getProperty('previousStayTime'),
      // 当前页进入时间
      entryTime: this.instance.getProperty('entryTime'),
      // // 当前页的路由规则
      // routeRule: this.instance.getProperty('routeRule'),
      // // 当前页的路由中文名
      // routeZhName: this.instance.getProperty('routeZhName'),
      // 上一页url
      parentUrl: this.instance.getProperty('parentUrl'),
      // 页面url
      currentUrl: this.instance.getProperty('routeRule') || currentUrl,
      // 用户clientID
      uid
    }
    // 合并客户端信息
    let sys = extend({}, sysData, baseInfo.properties())

    // 事件自定义属性
    let ext = userSetProperties

    // 合并渠道推广信息
    // sys = _.extend({}, sys, this.instance['channel'].get_channel_params())

    // 只有已访问页面后，sessionReferrer 重置
    // 如果不是内置事件，那么 sessionReferrer 重置
    // 如果是'da_activate'，那么 sessionReferrer 重置
    // 解决referrer 当是外链时，此时触发自定义事件，引起重启一个session问题。
    if (dataType === EVENT_TYPES.BUSSINESS_EVENT_TYPE) {
      // 其它渠道
      // if (this.checkChannel()) {
      //   this.localStorage.register({
      //     sessionReferrer: document.URL
      //   })
      // }
    }
    if (!this.instance.getConfig('spa').is) {
      if (['activate', 'sessionClose'].indexOf(eventName) > 0) {
        this.localStorage.register({
          sessionReferrer: document.URL
        })
      }
    }

    // 当启动单页面后，切换页面，refer为空，此时做处理
    if (this.instance.getConfig('spa').is) {
      const sessionReferrer = this.instance.getProperty('sessionReferrer')
      if (sessionReferrer !== sys.referrer) {
        sys.referrer = sessionReferrer
        sys.referringDomain = baseInfo.domain(sessionReferrer)
      }
    }

    // 上报数据对象字段截取
    const truncateLength = this.instance.getConfig('truncateLength')
    if (isNumber(truncateLength) && truncateLength > 0) {
      sys = truncate(sys, truncateLength)
    }
    let truncatedData = { sys, ext }

    const callbackFn = (response: any) => {
      if (callback) {
        callback(response, sys)
      }
    }
    let url = this.instance.getConfig('trackUrl')
    const trackType = this.instance.getConfig('trackType')
    if (trackType === 'img') {
      url += 'track.gif'
    }
    sendRequest(url, trackType, truncatedData, callbackFn)

    // 当触发的事件不是这些事件(sessionStart,sessionClose,activate)时，触发检测 session 方法
    if (
      ['sessionStart', 'sessionClose', 'activate'].indexOf(eventName) === -1
    ) {
      this.session(() => {}, dataType)
    }

    // 保存最后一次用户触发事件（除了会话事件以外）的事件id以及时间，通过这个时间确定会话关闭时的时间
    if (['sessionStart', 'sessionClose'].indexOf(eventName) === -1) {
      this.localStorage.register({
        LASTEVENT: {
          eventName,
          time: time
        }
      })
    }
  }
}
