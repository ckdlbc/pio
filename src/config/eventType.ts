/**
 * 事件类型
 * 事件分为：系统事件和业务事件
 */
export const EVENT_TYPES = {
  // 系统事件类型
  SYSTEM_EVENT_TYPE: 'se',
  // 业务事件类型
  BUSSINESS_EVENT_TYPE: 'be'
}

// 系统事件列表
export const SYSTEM_EVENTS: { [key: string]: any } = {
  // 会话开始事件
  sessionStart: {
    dataType: EVENT_TYPES.SYSTEM_EVENT_TYPE
  },
  // 会话结束事件
  sessionClose: {
    dataType: EVENT_TYPES.SYSTEM_EVENT_TYPE
  },
  // PV事件
  pv: {
    dataType: EVENT_TYPES.SYSTEM_EVENT_TYPE
  },
  // 广告点击事件
  adClick: {
    dataType: EVENT_TYPES.SYSTEM_EVENT_TYPE
  },
  // 用户首次访问网站事件
  activate: {
    dataType: EVENT_TYPES.SYSTEM_EVENT_TYPE
  },
  // A/B 测试事件
  abtest: {
    dataType: EVENT_TYPES.SYSTEM_EVENT_TYPE
  },
  // 异常错误事件
  error: {
    dataType: EVENT_TYPES.SYSTEM_EVENT_TYPE
  },
  // 用户注册事件
  userSignup: {
    dataType: EVENT_TYPES.SYSTEM_EVENT_TYPE
  },
  // 用户登录事件
  userSignin: {
    dataType: EVENT_TYPES.SYSTEM_EVENT_TYPE
  },
  // 用户登出事件
  userSignout: {
    dataType: EVENT_TYPES.SYSTEM_EVENT_TYPE
  },
  // 用户属性设置事件
  userProperty: {
    dataType: EVENT_TYPES.SYSTEM_EVENT_TYPE
  }
}

// 业务事件列表
export const BUSSINESS_EVENTS: { [key: string]: any } = {
  // 按钮点击事件
  btnClick: {
    dataType: EVENT_TYPES.BUSSINESS_EVENT_TYPE
  }
}
