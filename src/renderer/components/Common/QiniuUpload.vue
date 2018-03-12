<template>
  <el-upload
    :ref="p_ref"
    :data="uploadData"
    :action="p_action"
    :file-list="c_p_fileList"
    :list-type="p_listType"
    :auto-upload="p_autoUpload"
    :disabled="disabled"
    :before-upload="beforeUpload"
    :on-change="onChange"
    :on-remove="onRemove"
    :on-error="onError"
    :on-success="onSuccess">
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="$submitUpload()">上传到服务器</el-button>-->
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1Mb。<strong>如果取消新建请点击删除图片（为了删掉七牛上的图片）！</strong></div>
  </el-upload>
</template>

<script>
  /**
   * 该组件"只跟七牛服务器的静态资源"交互，也就是说自己的数据库的数据要在该组件外进行操作
   * ，比如修改资源时删除一个图片要监听删除方法，在组件外操作数据库
   *
   * 新建上传时：
   * p_ref: 该组件唯一的key（*）
   * p_action: 上传接口（*）
   * 调用处通过this.$refs[p_ref].$getFileList(),返回该组件上传图片的url数组
   *
   * 修改时：
   * p_
   */

  import serverConfig from '../../config/server'
  import ImageService from '../../services/image'
  import appInfo from '../../config'
  let imageUploadService = new ImageService()
  export default {
    name: 'QiniuUpload',
    data() {
      return {
        serverConfig: serverConfig,
        uploadData: {},
        fileList: [], // [http://image.xxx.com/34r3r3r.png,http://image.xxx.com/s9sdj9sfj.png]
        disabled: false
      }
    },
    props: {
      p_bucket: {
        type: String,
        default: appInfo.qiniuImageBucket
      },
      p_ref: {
        type: String,
        required: true
      },
      p_data: {
        type: Object
      },
      p_maxSize: {
        type: Number,
        default: 3
      },
      p_action: {
        type: String,
        default: serverConfig.QINIU_HB
      },
      p_fileList: {
        type: String,
        default: ''
      },
      p_listType: {
        type: String,
        default: 'picture-card'
      },
      p_autoUpload: {
        type: Boolean,
        default: true
      },
      p_emitBeforeUpload: {
        type: String
      },
      p_emitOnSuccess: {
        type: String
      },
      p_emitOnRemove: {
        type: String
      },
      p_emitOnError: {
        type: String
      },
      p_maxFiles: {
        type: Number,
        default:100
      }
    },
    computed: {
      c_p_fileList: function () {
        let fileList = []
        const separator = serverConfig.IMAGE + '/'
        if(this.p_fileList && this.p_fileList.length > separator.length) {
          this.p_fileList.split(",").forEach(el => {
            this.fileList.push(el)
            fileList.push({
              response:{
                key: el.split(separator)[1]
              },
              name: el.split(separator)[1],
              url: el
            })
          })
        }

        return fileList
      }
    },
    methods: {
      $getFileList() {
        return this.fileList
      },
      beforeUpload(file) {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < this.p_maxSize
        if (!isImg) {
          this.$message.error('仅能上传 JPG、PNG 格式!')
          return false
        }
        if (!isLt2M) {
          this.$message.error('图片大小不能超过 ' + this.p_maxSize + 'MB!')
          return false
        }
        let key = 'admin/' + new Date().format('yyyy-MM-dd-ss-S') + '_' + file.name
        let options = {
          scope: appInfo.qiniuImageBucket + ':' + key, // 存储空间名 : 保存后的文件名（key）
          deadline: Math.round(new Date().getTime()) + 30 // token 失效时间
        }
        return new Promise((resolve, reject) => {
          imageUploadService.getUploadToken(options).then(response => {
            this.uploadData = {
              token: response.data.uploadToken,
              key: key
            }
            resolve(true) // 继续上传
          }).catch(error => {
            this.p_emitOnError ? this.$emit(this.p_emitOnError, { error, file }) : this.$emit(this.p_ref + 'OnError', { error, file })
            reject(error) // 停止上传
          })
        })
      },
      onError(err, file, fileList) {
        this.$notify.error({
          title: err.status,
          message: err.message,
          duration: 1500
        })
      },
      onSuccess(response, file, fileList) {},
      /**
       * @param file
       * @param fileList 不包含正在删除的文件file
       */
      onRemove(file, fileList) {
        imageUploadService.deleteFileFromQiniu({bucket: appInfo.qiniuImageBucket, key: file.response.key}).then(response => {
          this.$message({
            message: response.errmsg,
            type: 'success'
          });
          this._afterChange(fileList)
          this.p_emitOnRemove && this.$emit(this.p_emitOnRemove, this.p_ref)
        }).catch(error => {
          this.$message.error(error.errmsg + "，请刷新页面重试！")
        })
      },
      onChange(file, fileList) {
        this._afterChange(fileList)
      },
      _afterChange(fileList) {
        let result = []
        for (let i = 0, l = fileList.length; i < l; i++) {
          if (fileList[i].response || fileList[i].key) {
            result.push(serverConfig.IMAGE + '/' + fileList[i].response.key)
          }
        }
        this.fileList = result
      }
    },
    mounted() {
    }
  }
</script>

