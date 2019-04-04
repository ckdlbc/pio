// 消息订阅/推送
class InnerEvent {
  public list: { [key: string]: Array<Function> } = {}

  /**
   * 订阅
   *
   */
  on (key: string, fn: Function) {
    if (!this.list[key]) {
      this.list[key] = []
    }
    this.list[key].push(fn)
  }

  off (key: string) {
    if (!this.list[key]) {
      return
    } else {
      delete this.list[key]
    }
  }
  /**
   * 推送
   */
  trigger (key: string, ...args: any[]) {
    let arrFn = this.list && this.list[key]
    if (!arrFn || arrFn.length === 0) {
      return
    }
    for (let i = 0; i < arrFn.length; i++) {
      if (typeof arrFn[i] == 'function') {
        arrFn[i].apply(this, [key, ...args])
      }
    }
  }
}
const innerEvent = new InnerEvent()

export default innerEvent
