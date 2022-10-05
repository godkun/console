export function queryURLparamsRegEs6(url) {
  const obj: Record<string, string | null> = {}
  const reg = /([^?=&]+)=([^?=&]+)/g
  url.replace(reg, (...arg) => {
    obj[arg[1]] = arg[2]
  })
  return obj
}
