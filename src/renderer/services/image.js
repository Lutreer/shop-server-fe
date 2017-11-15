import BaseService from './base'
import serverConfig from '../config/server'

export default class ImageService extends BaseService {
  constructor(setting) {
    super(Object.assign({
      timeout: 100000,
      baseURL: serverConfig.OMS
    }, setting))
  }

  getUploadToken(options) {
    return this.service.post('/admin/qiniu/uploadToken', options)
  }

  deleteFileFromQiniu(options) {
    return this.service.post('/admin/qiniu/delete', options)
  }

}
