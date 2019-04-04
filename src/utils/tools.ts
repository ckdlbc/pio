export function forEachValue (
  obj: { [key: string]: any },
  fn: (val: any, key: string) => void
) {
  Object.keys(obj).forEach((key: string) => fn(obj[key], key))
}

export function isObject (obj: any) {
  return obj !== null && typeof obj === 'object'
}

export function toString (obj: any) {
  return Object.prototype.toString.call(obj)
}

export function isFunction (obj: any) {
  return typeof obj === 'function'
}

export function isPromise (val: any) {
  return val && typeof val.then === 'function'
}
export function isUndefined (obj: any) {
  return obj === void 0
}

export function isNumber (obj: any) {
  return Object.prototype.toString.call(obj) == '[object Number]'
}

export function isArray (obj: any) {
  return (
    Array.isArray ||
    function (obj) {
      return Object.prototype.toString.apply(obj) === '[object Array]'
    }
  )
}

export function assert (condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`[Pio] ${msg}`)
  }
}

export function trim (str: string) {
  if (!str) return
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

export function each (obj: any, iterator: any, context?: any) {
  const breaker = {}
  if (obj === null || obj === undefined) {
    return
  }
  if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
    obj.forEach(iterator, context)
  } else if (obj.length === +obj.length) {
    for (let i = 0, l = obj.length; i < l; i++) {
      if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
        return
      }
    }
  } else {
    for (let key in obj) {
      if (obj.hasOwnProperty.call(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === breaker) {
          return
        }
      }
    }
  }
}

export function extend (obj: any, ...exObj: any[]) {
  each(exObj, (source: any) => {
    for (let prop in source) {
      if (source[prop] !== void 0) {
        obj[prop] = source[prop]
      }
    }
  })
  return obj
}

// 对象的字段值截取
export function truncate (obj: any, length: any) {
  let ret: any
  if (typeof obj === 'string') {
    ret = obj.slice(0, length)
  } else if (Array.isArray(obj)) {
    ret = []
    each(obj, function (val: any) {
      ret.push(truncate(val, length))
    })
  } else if (isObject(obj)) {
    ret = {}
    each(obj, function (val: any, key: string) {
      ret[key] = truncate(val, length)
    })
  } else {
    ret = obj
  }
  return ret
}

// 转化成json
export function JSONDecode (string: string) {
  try {
    return JSON.parse(string)
  } catch (error) {
    return {}
  }
}

// json转化为string
export function JSONEncode (json: any) {
  try {
    return JSON.stringify(json)
  } catch (error) {
    return ''
  }
}
