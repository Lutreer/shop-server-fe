<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{infoForm.id ? '编辑品牌' : '添加品牌'}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="operation-nav">
                <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
            </div>
        </div>
        <div class="content-main">
            <div class="form-table-box">
                <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
                    <el-form-item label="名称" prop="title">
                        <el-input v-model="infoForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="简介" prop="description">
                        <el-input type="textarea" v-model="infoForm.description" :rows="3"></el-input>
                        <div class="form-tip"></div>
                    </el-form-item>
                    <el-form-item label="列表图片" prop="inner_pic_url">
                        <qiniu-upload ref="inner_pic_url"
                                      p_ref="inner_pic_url"
                                      :p_file-list="infoForm.inner_pic_url"
                                      p_emitOnRemove="picRemove"
                                      v-on:picRemove="picRemove"
                        >

                        </qiniu-upload>
                        <div class="form-tip">图片数量：仅1张；图片尺寸：750*420</div>
                    </el-form-item>
                    <el-form-item label="详情图片" prop="content_pic_url">
                        <qiniu-upload ref="content_pic_url"
                                      p_ref="content_pic_url"
                                      :p_file-list="infoForm.content_pic_url"
                                      p_emitOnRemove="picRemove"
                                      v-on:picRemove="picRemove"
                        >

                        </qiniu-upload>
                        <div class="form-tip">图片数量：0~3张；图片尺寸：750*650</div>
                    </el-form-item>
                    <el-form-item label="首页展示">
                        <el-checkbox label="" v-model="infoForm.show_in_home"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="首页展示图片" v-show="infoForm.show_in_home">
                        <qiniu-upload ref="outter_pic_url"
                                      p_ref="outter_pic_url"
                                      :p_file-list="infoForm.outter_pic_url"
                                      p_emitOnRemove="picRemove"
                                      v-on:picRemove="picRemove"
                        >
                        </qiniu-upload>
                        <div class="form-tip">图片数量：仅1张；图片尺寸：375*252</div>
                    </el-form-item>
                    <el-row class="add_goods_box">
                        <el-col :span="24">
                            <el-form-item label="添加商品"  prop="goods">
                                <el-button type="primary" @click="addGoods">添加关联商品</el-button>
                                <el-row class="goods_item_box">
                                    <el-col v-for="(good, index) in infoForm.goods" :span="4" :key="index"
                                            class="goods">
                                        <img :src="good.list_pic_url" alt="">
                                        <div class="info">
                                            <div>名称：{{good.name}}</div>
                                            <div>简介：{{good.goods_brief}}</div>
                                        </div>
                                        <i class="el-icon-close remove-goods" @click="removeGoods(index)"></i>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>

                    </el-row>
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
  import GoodSelectDialog from '../Common/GoodSelectDialog.vue';
  import QiniuUpload from '../Common/QiniuUpload.vue'

  export default {
    components: {GoodSelectDialog, QiniuUpload},
    props:['id'],
    data() {
      return {
        infoForm: {
          id: 0,
          title: "",
          description: '',
          outter_pic_url: '',
          inner_pic_url: '',
          content_pic_url: '',
          show_in_home:false,
          goods: [],
          sort_order: 999,
          is_show: true
        },
        infoRules: {
          title: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          description: [
            {required: true, message: '请输入简介', trigger: 'blur'},
          ]
        },
      }
    },
    methods: {
      goBackPage() {
        this.$router.go(-1);
      },
      onSubmitInfo() {

        this.$refs['infoForm'].validate(valid => {
          if (valid) {
            let brand = _.cloneDeep(this.infoForm)
            brand.outter_pic_url = this.$refs['outter_pic_url'].$getFileList().toString()
            brand.inner_pic_url = this.$refs['inner_pic_url'].$getFileList().toString()
            brand.content_pic_url = this.$refs['content_pic_url'].$getFileList().toString()

            let goods = []
            brand.goods.forEach(good => {
              goods.push(good.id)
            })
            brand.goods = goods

            this.axios.post('brand/store', brand).then((response) => {
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
      getInfo() {
        if (this.infoForm.id <= 0) {
          return false
        }

        //加载品牌详情
        let that = this
        this.axios.get('brand/info', {
          params: {
            id: that.infoForm.id
          }
        }).then((response) => {
          let resInfo = response.data.data;
          resInfo.show_in_home = resInfo.show_in_home == 1 ? true : false;
          resInfo.is_show = resInfo.is_show == 1 ? true : false;
          that.infoForm = resInfo;
        })
      },
      picRemove(ref) {
        // 监听修改数据时的图片删除操作
        if (this.id && this.id > 0) {
        let editPic ={
          id: this.infoForm.id,
          [ref]: this.$refs[ref].$getFileList().toString()
        }
        this.infoForm[ref] = this.$refs[ref].$getFileList().toString()
        this.axios.post('brand/updatePic', editPic).then((response) => {
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
      confirmGoodsSelect(result) {
        result.forEach(n_good => {
          let isNew = false
          this.infoForm.goods.forEach(b_good => {
            if(n_good.id == b_good.id){
              isNew = true
            }
          })
          if(!isNew){
            this.infoForm.goods.push(n_good)
          }
        })
      },
      addGoods() {
        this.$refs['goodSelect'].$show()
      },
      removeGoods(index) {
        this.infoForm.goods.splice(index, 1)
      }

    },
    mounted() {
      this.infoForm.id = this.id || 0;
      this.getInfo();
    }
  }

</script>

<style>
    .image-uploader {
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
        width: 187px;
        height: 105px;
        line-height: 105px;
        text-align: center;
    }

    .image-uploader .image-show {
        width: 187px;
        height: 105px;
        display: block;
    }

    .image-uploader.new-image-uploader {
        font-size: 28px;
        color: #8c939d;
        width: 165px;
        height: 105px;
        line-height: 105px;
        text-align: center;
    }

    .image-uploader.new-image-uploader .image-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 165px;
        height: 105px;
        line-height: 105px;
        text-align: center;
    }

    .image-uploader.new-image-uploader .image-show {
        width: 165px;
        height: 105px;
        display: block;
    }
</style>
