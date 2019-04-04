
const pkg = require('../../package.json')

// 配置
export const CONFIG = {
  // 插件名称
  pluginName: 'pio',
  debug: false,
  version: pkg.version
}

// 默认配置
export const DEFAULT_CONFIG: IConfig = {
  uid: () => '',
  trackUrl:'',
  debug: false,
  localStorage: {
    type: 'localStorage',
    name: '',
    disable: false,
    secureCookie: false,
    crossSubdomainCookie: false,
    cookieExpiration: 1000
  },
  created: function () {},
  trackType: 'post',
  spa: {
    is: false,
    mode: 'hash'
  },
  pageview: true,
  truncateLength: -1,
  sessionIntervalMins: 30
}

export interface IConfig {
  // 前端框架router实例
  router?: any
  // 用户clientId
  uid?: () => string
  // 上报服务器的请求URL
  trackUrl: string
  // 是否启用调试模式 (默认值：false)
  debug?: boolean
  // 本地存储配置
  localStorage?: {
    // 存储方式：localStorage或cookie (默认值：localStorage)
    type?: string;
    // 存储名称 (默认值：'')
    name?: string;
    // 关闭存储功能 (默认值：false)
    disable?: boolean;
    // cookie存储时，采用安全的存储方式，即：
    // 当secure属性设置为true时，cookie只有在https协议下才能上传到服务器，而在http协议下是没法上传的，所以也不会被窃听
    // 默认值：false
    secureCookie?: boolean;
    // cookie存储时，跨主域名存储配置 (默认值：false)
    crossSubdomainCookie?: boolean;
    // cookie方法存储时，配置保存过期时间 (默认值：false)
    cookieExpiration?: number;
  }
  // 初始化sdk时触发的钩子
  created?: () => void
  // 上报数据实现形式  (默认值：post)
  trackType?: string
  // 单页面应用配置 (默认自动检测)
  spa?: {
    // 使用spa配置，(默认值：true)
    is?: boolean;
    // spa路由实现类型：hash 或 history (默认值：hash)
    mode?: string;
  }
  // 是否自动触发PV埋点 (默认值：true)
  pageview?: boolean
  // 上报数据前，每个字段长度截取配置，-1为不截取 (默认值：-1)
  truncateLength?: number
  // 会话超时时长，单位分钟 (默认值：30)
  sessionIntervalMins?: number
}
