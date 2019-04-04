/* tslint:disable */
// import { PluginFunction } from "vue";
import { trackEvent } from "./helper";
import Track from "./core/track";
import { IConfig } from "./config/plugin";
import { assert } from "./utils/tools";

export interface IOptions extends IConfig {
  token: string;
}

export const install = (Vue: any, options: any) => {
  if (!options || !options.token) {
    assert(true, "请输入正确的token");
    return;
  }
  const { token, ...config } = options;
  assert(!!token, "请输入正确的token");
  new Track(token, config);
  // 添加实例方法
  Vue.prototype.$trackEvent = trackEvent;
};
