# 开始

每一个 Pio 应用的核心就是 **Track**。Track 基本上就是一个埋点处理工具，它将自动采集、处理客户端数据，监听 Url 变化**自动上报埋点**。

### 最简单的 Track

[安装](../installation.md) Pio 之后，让我们来创建一个 Track。创建过程直截了当——仅需要提供一个应用标识符：

```js
import Pio from "pio";

// xxx为应用标识符，用于归类数据
new Pio.Track("xxx");
```

现在，Pio 将使用 **非 SPA 模式** 对 Url 进行监听，并自动上报埋点数据。

你可以通过调用 `Pio.trackEvent` 函数 或者 使用 `@trackEvent` 装饰器 来手动上报埋点。

### 路由分析

如果你使用 `Vue` 或 `React`，可以将 `Router 实例` 传入 Track 构造器中：

```js
import Pio from "pio";
// router实例
import router from "./router";

// xxx为应用标识符，用于归类数据
new Pio.Track("xxx", { router });
```

Pio 将自动解析 Router 实例，并推断 **Router 模式** 以及 **是否为 SPA 应用**。并根据 Router 模式监听 history 或 hash 的变化，**自动上报埋点数据**。

### 手动埋点

```js
import { trackEvent } from "pio";

trackEvent("buy", { price: "123" });
```
