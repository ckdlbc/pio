# Pio 是什么？

Pio 是一个专为 **前端埋点** 开发的 **全量数据采集工具**。它采用自动化采集前端应用的所有数据，并以相应的规则保证 **埋点** 以一种统一的方式进行调用。

### 什么是“全量数据采集工具”？

让我们从一个简单的 前端埋点 开始：

```js
// 工程入口文件
// url改变时将触发工具自动埋点
import Pio from "pio";
new Pio.Track("projectName", { router });

// 业务逻辑
// 使用函数调用
import { trackEvent } from "pio";
trackEvent("buy", { price: "123" });

// 业务逻辑
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

埋点**模式**包含以下两个部分：

- **SPA 模式**，默认监听 hash；
- **非 SPA 模式**，默认监听 history。

埋点**类型**包含以下两个部分：

- **SYSTEM_EVENTS**，工具自动埋点；
- **BUSSINESS_EVENTS**，业务手动埋点。

在实例化 **Pio.Track** 后，Pio 将自动**采集分析**以下数据：

- 当前页面信息
- 页面来源
- 浏览器信息
- 客户端信息
- userAgent

### 什么情况下我应该使用 Pio？

虽然 Pio 可以帮助我们自动化埋点，也附带了许多手动埋点方式。但仍需开发者对效益进行权衡。

如果您不打算开发非内部系统，使用 Pio 可能是没有效益的。确实是如此——如果应用的用户非常少，您最好不要使用 Pio。但是，如果您需要构建一个面向大量用户的系统，您很可能会考虑如何更好地采集用户数据，Pio 将会成为自然而然的选择。
