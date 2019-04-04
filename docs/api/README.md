---
sidebar: auto
---

# API 参考

## Pio.Track

```js
import Pio from "pio";

new Pio.Track(token, { ...config });
```

## Pio.Track 构造器选项

### token

- 类型: `string`

  上报数据的 **唯一凭证**，接收方将通过它来归类数据。通常使用 **驼峰命名法** 对业务工程进行命名。

### config

- 类型: `Object`

  全局埋点实例的配置项。

  ```js
  {
    // 上报服务器的请求URL (默认值：大数据提供的接口地址)
    trackUrl?: string;
    // 是否启用调试模式 (默认值：false)
    debug?: boolean;
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
    };
    // 初始化sdk时触发的钩子
    created?: () => void;
    // 上报数据实现形式  (默认值：post)
    trackType?: string;
    // 单页面应用配置 (默认自动检测)
    spa?: {
        // 使用spa配置，(默认值：true)
        is?: boolean;
        // spa路由实现类型：hash 或 history (默认值：hash)
        mode?: string;
    };
    // 是否自动触发PV埋点 (默认值：true)
    pageview?: boolean;
    // 上报数据前，每个字段长度截取配置，-1为不截取 (默认值：-1)
    truncateLength?: number;
    // 会话超时时长，单位分钟 (默认值：30)
    sessionIntervalMins?: number;
  }
  ```

  [详细介绍](/api/#config-埋点配置项)

## Pio 实例属性

### trackEvent

- 类型: `Function`

  签名:

  ```
  type trackEvent: =
      (
          // 埋点事件名称（必须）
          eventName: string,
          // 要上报的业务数据
          vmFnProperties?: (vm: any) => any | { [key: string]: any }
      ) =>
      (
          target: any,
          property: string,
          descriptor: PropertyDescriptor
      ) => void
  ```

  用于业务手动埋点，支持 **函数调用** 与 **装饰器调用**

  调用方式:

  ```js
  // 使用函数调用
  import { trackEvent } from "pio";
  trackEvent("buy", { price: "123" });

  // 使用装饰器调用
  import { trackEvent } from "pio";
  @Component
  export default class HelloWorld extends Vue {
    price = "123";
    @trackEvent("btnClick", vm => {
      price: vm.price;
    })
    onClick() {
      // 业务逻辑
    }
  }
  ```

## 埋点上报数据项

以下列出了一些埋点上报时的请求参数。

```js
{
  // 业务数据，根据业务需求进行定制
  ext:{},
  // 系统数据，Pio自动采集分析生成
  sys:{
    // 埋点事件类型，se:工具自动埋点，be:业务手动埋点
    dataType: string;
    // sdk类型：js，小程序、安卓、IOS、server、pc
    sdkType: string;
    // 引入的sdk版本
    sdkVersion: string;
    // 埋点事件名称
    eventName: string;
    // 当前上报事件用户触发的时间戳
    time: number;
    // 用户首次访问网站时间戳
    persistedTime: number;
    // 本地唯一标记，可理解为设备id
    deviceId: any;
    // 网页打开场景：浏览器、APP
    pageOpenScene: string;
    // 上报数据凭证（通过它来归类数据）
    token: any;
    sessionTotalLength: any;
    // 当前会话的id
    sessionUuid: any;
    // 设备型号
    deviceModel: string | undefined;
    // 客户端操作系统
    deviceOs: any;
    // 客户端操作系统版本
    deviceOsVersion: string;
    // 客户端平台：桌面、安卓、ios
    devicePlatform: string;
    // 浏览器
    browser: any;
    // 浏览器版本
    browserVersion: any;
    // 当前访问页面的标题
    title: string;
    // 当前访问页面的路径
    urlPath: string;
    // 当前访问页面的url
    currentUrl: string;
    // 当前访问页面的域名
    currentDomain: string;
    // 上一页url：来源页url
    referrer: string;
    // 上一页域名：来源页域名
    referringDomain: string;
    // 本地客户端语言
    language: string;
    // 本地客户端屏幕宽度，单位像素
    screenWidth: string | number;
    // 本地客户端屏幕高度，单位像素
    screenHeight: string | number;
    // 当前页停留时间
    currentStayTime: number;
    // 上一页停留时间
    previousStayTime: number;
    // 当前页进入时间
    entryTime: number;
    // 用户clientId
    uid: string;
    // 上一页url
    parentUrl:string;
  }
}
```
