import axios from 'axios'
import { isFunction } from '../utils/tools'
import console from '../utils/console'

const instance = axios.create()

const sendRequest = (
  url: string,
  type: string,
  data: any,
  callback?: Function
) => {
  console.group('上报埋点')
  console.log('埋点动作：', data.sys.eventName)
  console.log('埋点数据：', data)
  console.groupEnd()
  return instance({
    method: type,
    url,
    data
  }).then(() => {
    if (callback && isFunction(callback)) {
      callback()
    }
  })
}
export default sendRequest
