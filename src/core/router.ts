import cache from './cache'
import Track from './track'
import Spa from '../collect/spa'
import LocalStorage from './localStorage'
import { isObject } from '../utils/tools'

export default class Router {
  // Track实例
  public instance!: Track
  // 框架router实例
  public router!: any
  // localStorage实例
  public localStorage!: LocalStorage
  constructor () {
    this.instance = cache.instance
    this.localStorage = this.instance.localStorage
    this.router = this.instance.getConfig('router')
    // setTimeout(() => {}, 0)
    this.vue()
  }

  private vue () {
    if (
      this.router &&
      this.router.apps &&
      this.router.options &&
      this.router.mode &&
      isObject(this.router.currentRoute)
    ) {
      this.instance.setConfig({
        spa: {
          is: true,
          mode: this.router.mode
        }
      })
      this.detectionRoute()
      this.spaInit()
    }
  }

  /**
   * 检测路由变化
   */
  detectionRoute () {
    this.router.beforeEach((to: any, from: any, next: any) => {
      const { matched, meta } = to
      // const routeZhName = meta.zhName || ''
      let routeRule = ''
      if (matched[matched.length - 1]) {
        routeRule = (matched[matched.length - 1].path || '/').split(':')[0]
        routeRule =
          routeRule[routeRule.length - 1] === '/'
            ? routeRule.slice(0, routeRule.length - 1)
            : routeRule
      }
      const parentUrl = window.location.href
      routeRule = `${window.location.origin}${
        this.router.mode === 'hash' ? '/#' : ''
      }${routeRule}`
      this.localStorage.register({
        routeRule,
        // routeZhName,
        parentUrl
      })
      next()
    })
  }
  /**
   * 单页面应用
   * 影响PV
   */
  private spaInit () {
    Spa.init({
      mode: this.instance.getConfig('spa').mode,
      callbackFn: () => {
        // this.detectionRoute()
        this.instance.trackPv()
      }
    })
  }
}
