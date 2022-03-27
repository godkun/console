import { resultSuccess, doCustomTimes } from '../_util'

const instanceList = (pageSize) => {
  const result: any[] = []
  doCustomTimes(pageSize, () => {
    result.push({
      name: '@cname()',
      // url: '@url()',
      cpu: '@integer(1,10)',
      ram: '@integer(1,10)',
      streamNum: '@integer(1,10)',
      date: `@date('yyyy-MM-dd')`
    })
  })
  return result
}

export default [
  //表格数据列表
  {
    url: '/api/instance/list',
    timeout: 1000,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10 } = query
      const list = instanceList(Number(pageSize))
      return resultSuccess({
        page: Number(page),
        pageSize: Number(pageSize),
        pageCount: 2,
        list
      })
    }
  }
]
