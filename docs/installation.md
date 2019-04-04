# 安装

### NPM

```bash
npm install pio --save
```

### Yarn

```bash
yarn add pio
```

在一个模块化的打包系统中，您必须显式地通过 `new Pio.Track()` 来安装 Pio：

```js
import Pio from "pio";

// xxx为应用标识符，用于归类数据
new Pio.Track("xxx");
```
