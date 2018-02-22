<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{infoForm.id ? '编辑分类' : '添加分类'}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="operation-nav">
                <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
            </div>
        </div>
        <div class="content-main">
            <div class="form-table-box">
                <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
                    <el-form-item label="分类名称" prop="name">
                        <el-input v-model="infoForm.name"></el-input>
                    </el-form-item>

                    <el-form-item label="简短描述" prop="description">
                        <el-input v-model="infoForm.description"></el-input>
                    </el-form-item>

                    <el-form-item label="介绍图" prop="banner_pic_url">
                        <qiniu-upload ref="banner_pic_url"
                                      p_ref="banner_pic_url"
                                      :p_file-list="infoForm.banner_pic_url"
                                      p_emitOnRemove="picRemove"
                                      v-on:picRemove="picRemove"
                        >
                        </qiniu-upload>
                        <div class="form-tip">图片数量：仅1张；图片尺寸：280*100</div>
                    </el-form-item>

                    <el-form-item label="排序">
                        <el-input-number v-model="infoForm.sort_order" :min="1" :max="999"></el-input-number>
                    </el-form-item>
                    <el-form-item label="启用">
                        <el-switch v-model="infoForm.is_show"></el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmitInfo">确定保存</el-button>
                        <el-button @click="goBackPage">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
  import api from '@/config/api';
  import QiniuUpload from '../Common/QiniuUpload.vue'

  export default {
    data() {
      return {
        infoForm: {
          id: 0,
          name: "",
          description: "",
          banner_pic_url: '',
          sort_order: 999,
          is_show: true,
        },
        infoRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          description: [
            { required: true, message: '请输入描述', trigger: 'blur' },
          ]
        },
      }
    },
    props:['id'],
    components: {QiniuUpload},
    methods: {
      goBackPage() {
        this.$router.go(-1);
      },
      onSubmitInfo() {
        this.$refs['infoForm'].validate(valid => {
          if (valid) {
            let category = _.cloneDeep(this.infoForm)
            category.banner_pic_url = this.$refs['banner_pic_url'].$getFileList().toString()
            this.axios.post('category/store', category).then((response) => {
              if (response.data.errno === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                this.$router.go(-1)
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失败'
                })
              }
            })
          } else {
            return false;
          }
        });
      },
      picRemove(ref) {
        // 监听修改数据时的图片删除操作
        if (this.id && this.id > 0) {
          let editPic ={
            id: this.infoForm.id,
            [ref]: this.$refs[ref].$getFileList().toString()
          }
          this.infoForm[ref] = this.$refs[ref].$getFileList().toString()
          this.axios.post('category/updatePic', editPic).then((response) => {
            if (response.data.errno === 0) {
              this.$message({
                type: 'success',
                message: '数据库：更新成功'
              });
            } else {
              this.$message({
                type: 'error',
                message: '数据库：更新失败'
              })
            }
          })
        }
      },

      getInfo() {
        if (this.infoForm.id <= 0) {
          return false
        }

        //加载分类详情
        let that = this
        this.axios.get('category/info', {
          params: {
            id: that.infoForm.id
          }
        }).then((response) => {
          let resInfo = response.data.data;
          resInfo.is_show = resInfo.is_show ? true : false;
          that.infoForm = resInfo;
        })
      }

    },
    mounted() {
      this.infoForm.id = this.id || 0;
      this.getInfo();
    }
  }

</script>

<style>
    .image-uploader{
        height: 105px;
    }
    .image-uploader .el-upload {
        border: 1px solid #d9d9d9;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .image-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .image-uploader .image-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        min-width: 105px;
        height: 105px;
        line-height: 105px;
        text-align: center;
    }

    .image-uploader .image-show {
        min-width: 105px;
        height: 105px;
        display: block;
    }

</style>
