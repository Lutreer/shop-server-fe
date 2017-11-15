<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商城运营</el-breadcrumb-item>
                <el-breadcrumb-item>{{infoForm.id ? '编辑专题' : '添加专题'}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="operation-nav">
                <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
            </div>
        </div>
        <div class="content-main">
            <div class="form-table-box">
                <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="infoForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="子标题" prop="subtitle">
                        <el-input type="textarea" v-model="infoForm.subtitle" :rows="3"></el-input>
                        <div class="form-tip"></div>
                    </el-form-item>
                    <el-form-item label="列表图" prop="list_pic_url">
                        <qiniu-upload ref="list_pic_url"
                                      p_ref="list_pic_url"
                                      :p_file-list="infoForm.list_pic_url"
                                      p_emitOnRemove="picRemove"
                                      v-on:picRemove="picRemove"
                        >
                        </qiniu-upload>
                        <div class="form-tip">图片数量：1张；图片尺寸：375*252</div>
                    </el-form-item>
                    <el-form-item label="描述图" prop="desc_pic_url">
                        <qiniu-upload ref="desc_pic_url"
                                      p_ref="desc_pic_url"
                                      :p_file-list="infoForm.desc_pic_url"
                                      p_emitOnRemove="picRemove"
                                      v-on:picRemove="picRemove"
                        >
                        </qiniu-upload>
                        <div class="form-tip">图片数量：多张（建议:1~5张）；图片尺寸：375*252</div>
                    </el-form-item>

                    <good-select-dialog ref="goodSelect"
                                        p_ref="goodSelect"
                                        p_emit_confirm="confirmGoodsSelect"
                                        v-on:confirmGoodsSelect="confirmGoodsSelect"
                    ></good-select-dialog>
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
                        <el-input-number v-model="infoForm.sort_order" :min="1" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="阅读量">
                        <el-input-number v-model="infoForm.read_count"></el-input-number>
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
  import QiniuUpload from '../Common/QiniuUpload.vue';
  export default {
    props: ['id'],
    components: {GoodSelectDialog, QiniuUpload},
    data() {
      return {
        p_dialogVisible: false,
        infoForm: {
          id: 0,
          title: "",
          subtitle: '',
          list_pic_url: '',
          desc_pic_url: '',
          sort_order: 100,
          is_show: true,
          read_count: 1,
          goods: []

        },
        infoRules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
          ],
          subtitle: [
            {required: true, message: '请输入子标题', trigger: 'blur'},
          ],
          read_count: [
            {required: true, message: '请输入阅读量', trigger: 'blur'},
          ],
        },
      }
    },
    methods: {
      goBackPage() {
        this.$router.go(-1);
      },
      onSubmitInfo() {
        this.$refs['infoForm'].validate((valid) => {
          if (valid) {
            let topic = _.cloneDeep(this.infoForm)
            topic.list_pic_url = this.$refs['list_pic_url'].$getFileList().toString()
            topic.desc_pic_url = this.$refs['desc_pic_url'].$getFileList().toString()

            let goods = []
            topic.goods.forEach(good => {
              goods.push(good.id)
            })
            topic.goods = goods
            this.axios.post('topic/store', topic).then((response) => {
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
      handleUploadImageSuccess(res, file) {
        if (res.errno === 0) {
          switch (res.data.name) {
            //专题图片
            case 'scene_pic_url':
              this.infoForm.scene_pic_url = res.data.fileUrl;
              break;
          }
        }
      },
      getInfo() {
        if (this.infoForm.id <= 0) {
          return false
        }

        //加载专题详情
        let that = this
        this.axios.get('topic/info', {
          params: {
            id: that.infoForm.id
          }
        }).then((response) => {
          let resInfo = response.data.data;
          resInfo.is_show = resInfo.is_show ? true : false;
          that.infoForm = resInfo;
        })
      },
      picRemove(ref) {
        this.infoForm[ref] = this.$refs[ref].$getFileList().toString()

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

<style lang="scss" scoped>


</style>
