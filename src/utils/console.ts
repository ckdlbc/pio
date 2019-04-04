import { isUndefined, each } from './tools'
import { CONFIG } from '../config/plugin'
const windowConsole = window.console
function isDebug () {
  return CONFIG.debug && !isUndefined(windowConsole) && windowConsole
}
const console = {
  group (...args: any[]) {
    if (isDebug()) {
      args = ['Pio:'].concat(args)
      try {
        windowConsole.group(...args)
      } catch (err) {
        each(args, function (arg: any) {
          windowConsole.error(arg)
        })
      }
    }
  },
  groupEnd () {
    if (isDebug()) {
      try {
        windowConsole.groupEnd()
      } catch (err) {
        windowConsole.error(err)
      }
    }
  },
  log (...args: any[]) {
    if (isDebug()) {
      args = ['Pio:'].concat(args)
      try {
        windowConsole.warn.apply(windowConsole, args as any)
      } catch (err) {
        each(args, function (arg: any) {
          windowConsole.warn(arg)
        })
      }
    }
  },
  error: function (...args: any[]) {
    if (isDebug()) {
      args = ['Pio:'].concat(args)
      try {
        windowConsole.error.apply(windowConsole, args as any)
      } catch (err) {
        each(args, function (arg: any) {
          windowConsole.error(arg)
        })
      }
    }
  }
}
export default console
