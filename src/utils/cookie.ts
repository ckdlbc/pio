import { JSONDecode } from './tools'
// 存储方法封装 cookie
export default {
  get: function (name: string) {
    let nameEQ = name + '='
    let ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length)
      }
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length))
      }
    }
    return null
  },

  parse: function (name: string) {
    let cookie
    try {
      cookie = JSONDecode(this.get(name) as string) || {}
    } catch (err) {
      // noop
    }
    return cookie
  },

  setSeconds: function (
    name: string,
    value: string,
    seconds: any,
    crossSubdomain: any,
    isSecure: any
  ) {
    let cdomain = '',
      expires = '',
      secure = ''

    if (crossSubdomain) {
      let matches = document.location.hostname.match(
          /[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i
        ),
        domain = matches ? matches[0] : ''

      cdomain = domain ? '; domain=.' + domain : ''
    }

    if (seconds) {
      let date: any = new Date()
      date.setTime(date.getTime() + seconds * 1000)
      expires = '; expires=' + date.toGMTString()
    }

    if (isSecure) {
      secure = '; secure'
    }

    document.cookie =
      name +
      '=' +
      encodeURIComponent(value) +
      expires +
      '; path=/' +
      cdomain +
      secure
  },

  set: function (
    name: string,
    value: string,
    days: any,
    crossSubdomain?: any,
    isSecure?: any
  ) {
    let cdomain = '',
      expires = '',
      secure = ''

    if (crossSubdomain) {
      let matches = document.location.hostname.match(
          /[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i
        ),
        domain = matches ? matches[0] : ''

      cdomain = domain ? '; domain=.' + domain : ''
    }

    if (days) {
      let date: any = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      expires = '; expires=' + date.toGMTString()
    }

    if (isSecure) {
      secure = '; secure'
    }

    let new_cookie_val =
      name +
      '=' +
      encodeURIComponent(value) +
      expires +
      '; path=/' +
      cdomain +
      secure
    document.cookie = new_cookie_val
    return new_cookie_val
  },

  remove: function (name: string, crossSubdomain: any) {
    this.set(name, '', -1, crossSubdomain)
  }
}
