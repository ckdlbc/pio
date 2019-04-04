const T = function () {
  const d = 1 * Number(new Date())
  let i = 0
  while (d == 1 * Number(new Date())) {
    i++
  }
  return d.toString(16) + i.toString(16)
}

const R = function () {
  return Math.random()
    .toString(16)
    .replace('.', '')
}

const UA = function (n?: any) {
  let ua = navigator.userAgent,
    i,
    ch,
    buffer: any = [],
    ret = 0

  function xor (result: any, byteArray: any) {
    let j,
      tmp = 0
    for (j = 0; j < byteArray.length; j++) {
      tmp |= buffer[j] << (j * 8)
    }
    return result ^ tmp
  }

  for (i = 0; i < ua.length; i++) {
    ch = ua.charCodeAt(i)
    buffer.unshift(ch & 0xff)
    if (buffer.length >= 4) {
      ret = xor(ret, buffer)
      buffer = []
    }
  }

  if (buffer.length > 0) {
    ret = xor(ret, buffer)
  }

  return ret.toString(16)
}

export default function () {
  // 有些浏览器取个屏幕宽度都异常...
  let se: any = String(screen.height * screen.width)
  if (se && /\d{5,}/.test(se)) {
    se = se.toString(16)
  } else {
    se = String(Math.random() * 31242)
      .replace('.', '')
      .slice(0, 8)
  }
  let val = T() + '-' + R() + '-' + UA() + '-' + se + '-' + T()
  if (val) {
    return val
  } else {
    return (
      String(Math.random()) +
      String(Math.random()) +
      String(Math.random())
    ).slice(2, 15)
  }
}
