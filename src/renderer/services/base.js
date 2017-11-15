import axios from 'axios'

export default class BaseService {
  constructor(config) {
    this.config = Object.assign({
      responseType: 'json',
      timeout: 5000
    }, config)

    this.requestWhiteList = ['login']
    this.responsetWhiteList = ['login']

    const service = axios.create(this.config)

    // 请求拦截器
    service.interceptors.request.use(request => {
      // do something before request
      return request
    }, error => {
      Promise.reject(error)
    })

    // 响应拦截器
    service.interceptors.response.use(function(response) {
      debugger
      if (response.status === 200 && response.data.errno === 0) {
        return response.data
      } else {
        return Promise.reject(response.data || null)
      }
    }, function(error) {
      // Do something with response error
      debugger
      return Promise.reject(error)
    })

    this.service = service
  }

}


