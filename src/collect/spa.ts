import { extend, isFunction } from '../utils/tools'
import innerEvent from '../utils/innerEvent'
import registerHashEvent from '../utils/registerHashEvent'
function getPath () {
  return location.pathname + location.search
}

function on (obj: any, event: string, cb: Function) {
  if (obj[event]) {
    const fn = obj[event]
    obj[event] = function () {
      const args = Array.prototype.slice.call(arguments)
      cb.apply(this, args)
      fn.apply(this, args)
    }
  } else {
    obj[event] = function () {
      const args = Array.prototype.slice.call(arguments)
      cb.apply(this, args)
    }
  }
}

class Spa {
  public config: any
  public path: string = ''
  public url: string = ''

  constructor () {
    this.config = {
      mode: 'hash',
      trackReplaceState: false,
      callback: () => {}
    }
  }

  init (config: any) {
    this.config = extend(this.config, config || {})
    this.path = getPath()
    this.url = document.URL
    this.event()
  }

  event () {
    if (this.config.mode === 'history') {
      if (!history.pushState || !window.addEventListener) return
      on(history, 'pushState', this.pushStateOverride.bind(this))
      on(history, 'replaceState', this.replaceStateOverride.bind(this))
      window.addEventListener('popstate', this.handlePopState.bind(this))
    } else if (this.config.mode === 'hash') {
      registerHashEvent(this.handleHashState.bind(this))
      on(history, 'pushState', this.handleHashState.bind(this))
    }
  }

  pushStateOverride () {
    this.handleUrlChange(true)
  }
  replaceStateOverride () {
    this.handleUrlChange(false)
  }
  handlePopState () {
    this.handleUrlChange(true)
  }
  handleHashState () {
    this.handleUrlChange(true)
  }

  handleUrlChange (historyDidUpdate: boolean) {
    setTimeout(() => {
      if (this.config.mode === 'hash') {
        if (isFunction(this.config.callbackFn)) {
          this.config.callbackFn.call()
          innerEvent.trigger('singlePage:change', {
            oldUrl: this.url,
            nowUrl: document.URL
          })
          this.url = document.URL
        }
      } else if (this.config.mode === 'history') {
        const oldPath = this.path
        const newPath = getPath()
        if (
          oldPath !== newPath &&
          this.shouldTrackUrlChange(newPath, oldPath)
        ) {
          this.path = newPath
          if (historyDidUpdate || this.config.trackReplaceState) {
            if (typeof this.config.callbackFn === 'function') {
              this.config.callbackFn.call()
              innerEvent.trigger('singlePage:change', {
                oldUrl: this.url,
                nowUrl: document.URL
              })
              this.url = document.URL
            }
          }
        }
      }
    }, 0)
  }

  shouldTrackUrlChange (newPath: string, oldPath: string) {
    return !!(newPath && oldPath)
  }
}

export default new Spa()
