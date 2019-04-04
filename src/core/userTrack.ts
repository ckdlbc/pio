import pio from './track'
import LocalStorage from './localStorage'
import { isFunction, isObject, each, isNumber, truncate } from '../utils/tools'
import {
  PEOPLE_RESERVED_PROPERTY,
  PEOPLE_PROPERTY_ID
} from '../config/property'
import { EVENT_TYPES } from '../config/eventType'
import console from '../utils/console'
import sendRequest from './request'

class UserTrack {
  // pio实例
  public instance: pio
  // localStorage实例
  public localStorage: LocalStorage
  constructor (pio: pio) {
    this.instance = pio
    this.localStorage = this.instance.localStorage
  }
  /**
   * 检测设置的属性是否为系统保留属性
   * @param {String} prop
   */
  isReservedProperty (prop: string) {
    return PEOPLE_RESERVED_PROPERTY.indexOf(prop) > -1
  }
  /**
   * 上报用户属性数据
   * @param {Object} properties
   * @param {Function} callback
   */
  sendRequest (properties: any, callback: Function) {
    if (!isFunction(callback)) {
      callback = () => {}
    }

    properties = properties || {}

    let data = {
      dataType: EVENT_TYPES.SYSTEM_EVENT_TYPE,
      // 客户端唯一凭证(设备凭证)
      deviceId: this.instance.getDeviceId(),
      userId: this.instance.getProperty('userId'),
      // 上报时间
      time: new Date().getTime(),
      // sdk类型 （js，小程序、安卓、IOS、server、pc）
      sdkType: 'js',
      // 属性事件id
      eventName: PEOPLE_PROPERTY_ID,
      // 用户首次访问时间
      persistedTime: this.instance.getProperty('persistedTime'),
      // 页面打开场景, 默认 Browser
      pageOpenScene: 'Browser',
      // 自定义用户属性
      attributes: properties
    }

    // 合并渠道推广信息
    // data = _.extend({}, data, this.instance['channel'].get_channel_params())

    // 上报数据对象字段截取
    const truncateLength = this.instance.getConfig('truncateLength')
    let truncatedData = data
    if (isNumber(truncateLength) && truncateLength > 0) {
      truncate(data, truncateLength)
    }

    console.log('上报的数据（截取后）:', truncatedData)

    const callbackFn = (response: any) => {
      callback(response, data)
    }
    let url = this.instance.getConfig('trackUrl')

    // 数据上报方式
    const trackType = this.instance.getConfig('trackType')
    if (trackType === 'img') {
      url += 'track.gif'
    }
    sendRequest(
      url,
      trackType,
      {
        token: this.instance.getConfig('token'),
        ...truncatedData
      },
      callbackFn
    )
  }
  /**
   * 设置用户属性
   * @param {*} prop
   * @param {*} to
   * @param {*} callback
   */
  set (prop: string, to: any, callback: Function) {
    let setProps: { [key: string]: any } = {}
    if (isObject(prop)) {
      each(prop, (v: any, k: string) => {
        // 不是系统保留属性
        if (!this.isReservedProperty(k)) {
          setProps[k] = v
        }
      })
      callback = to
    } else {
      setProps[prop] = to
    }
    return this.sendRequest(setProps, callback)
  }
}
