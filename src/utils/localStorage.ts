import { JSONDecode } from './tools'
// 存储方法封装 localStorage
export default {
  error: function (msg: string) {
    console.error(`localStorage error: ${msg}`)
  },

  get: function (name: string) {
    try {
      return window.localStorage.getItem(name)
    } catch (err) {
      this.error(err)
    }
    return null
  },

  parse: function (name: string) {
    try {
      return JSONDecode(this.get(name) as string) || {}
    } catch (err) {
      // noop
    }
    return null
  },

  set: function (name: string, value: string) {
    try {
      window.localStorage.setItem(name, value)
    } catch (err) {
      this.error(err)
    }
  },

  remove: function (name: string) {
    try {
      window.localStorage.removeItem(name)
    } catch (err) {
      this.error(err)
    }
  }
}
