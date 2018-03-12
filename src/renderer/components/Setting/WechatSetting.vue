<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>店铺设置</el-breadcrumb-item>
                <el-breadcrumb-item>常规设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="content-main">
            <div class="form-table-box">
                <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
                    <el-form-item label="运费最低消费" prop="freight_limit">
                        <el-input v-model="infoForm.freight_limit"></el-input>
                    </el-form-item>
                    <el-form-item label="默认运费" prop="freight_price">
                        <el-input v-model="infoForm.freight_price"></el-input>
                    </el-form-item>

                    <el-form-item label="微步抵扣步数单元" prop="werun_ded_steps">
                        <el-input v-model="infoForm.werun_ded_steps" placeholder="每5000步抵扣x元"></el-input>
                    </el-form-item>
                    <el-form-item label="步数单元抵扣的金额" prop="werun_ded_steps_peice">
                        <el-input v-model="infoForm.werun_ded_steps_peice" placeholder="每xxxx步抵扣1元"></el-input>
                    </el-form-item>
                    <el-form-item label="是否开启微步抵扣" prop="werun_ded_status">
                        <el-input v-model="infoForm.werun_ded_status"></el-input>
                    </el-form-item>
                    <el-form-item label="订单满多少可抵扣" prop="werun_ded_order_mini_price">
                        <el-input v-model="infoForm.werun_ded_order_mini_price"></el-input>
                    </el-form-item>

                    <el-form-item label="微步排行最多点赞次数" prop="werun_praise_limit">
                        <el-input v-model="infoForm.werun_praise_limit"></el-input>
                    </el-form-item>
                    <el-form-item label="微步排行每个赞增加步数" prop="werun_praise_steps">
                        <el-input v-model="infoForm.werun_praise_steps"></el-input>
                    </el-form-item>
                    <el-form-item label="微步排行人数限制" prop="werun_ranking_limit_num">
                        <el-input v-model="infoForm.werun_ranking_limit_num"></el-input>
                    </el-form-item>
                    <el-form-item label="步数上传截止时间" prop="werun_deadline">
                        <el-input v-model="infoForm.werun_deadline"></el-input>
                    </el-form-item>


                    <el-form-item label="客服，公众号等" prop="contact_pic_url">
                        <qiniu-upload ref="contact_pic_url"
                                      p_ref="contact_pic_url"
                                      :p_file-list="infoForm.contact_pic_url"
                                      p_emitOnRemove="picRemove"
                                      v-on:picRemove="picRemove"
                        >
                        </qiniu-upload>
                        <div class="form-tip">图片数量：仅1张；图片尺寸：750*420</div>
                    </el-form-item>
                    <el-form-item label="商品详情头部公共图" prop="good_header_pic_url">
                        <qiniu-upload ref="good_header_pic_url"
                                      p_ref="good_header_pic_url"
                                      :p_file-list="infoForm.good_header_pic_url"
                                      p_emitOnRemove="picRemove"
                                      v-on:picRemove="picRemove"
                        >

                        </qiniu-upload>
                        <div class="form-tip">图片数量：仅1张；图片尺寸：750*420</div>
                    </el-form-item>
                    <el-form-item label="商品详情底部公共图" prop="good_footer_pic_url">
                        <qiniu-upload ref="good_footer_pic_url"
                                      p_ref="good_footer_pic_url"
                                      :p_file-list="infoForm.good_footer_pic_url"
                                      p_emitOnRemove="picRemove"
                                      v-on:picRemove="picRemove"
                        >

                        </qiniu-upload>
                        <div class="form-tip">图片数量：仅1张；图片尺寸：750*420</div>
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
    import QiniuUpload from '../Common/QiniuUpload.vue'
    export default {
      components: {QiniuUpload},
      data() {
        return {
          infoForm: {},
          infoRules: {
            freight_limit: [
              {required: true, message: '必填', trigger: 'blur',type: "number"},
            ],
            freight_price: [
              {required: true, message: '必填', trigger: 'blur',type: "number"},
            ],
            werun_ded_steps: [
              {required: true, message: '必填', trigger: 'blur',type: "number"},
            ],
            werun_ded_steps_peice: [
              {required: true, message: '必填', trigger: 'blur',type: "number"},
            ],
            werun_ded_status: [
              {required: true, message: '必填', trigger: 'blur',type: "number"},
            ],
            werun_ded_order_mini_price: [
              {required: true, message: '必填', trigger: 'blur',type: "number"},
            ],
            werun_praise_limit: [
              {required: true, message: '必填', trigger: 'blur',type: "number"},
            ],
            werun_praise_steps: [
              {required: true, message: '必填', trigger: 'blur',type: "number"},
            ],
            werun_ranking_limit_num: [
              {required: true, message: '必填', trigger: 'blur',type: "number"},
            ],
            werun_deadline: [
              {required: true, message: '必填', trigger: 'blur'},
            ]
          }
        }
      },
      mounted() {
        this.getInfo();
      },
      methods: {
        goBackPage() {
          this.getInfo();
        },
        onSubmitInfo() {
          this.$confirm('确定要修改吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$refs['infoForm'].validate(valid => {
              if (valid) {
                let setting = _.cloneDeep(this.infoForm)
                setting.contact_pic_url = this.$refs['contact_pic_url'].$getFileList().toString()
                setting.good_header_pic_url = this.$refs['good_header_pic_url'].$getFileList().toString()
                setting.good_footer_pic_url = this.$refs['good_footer_pic_url'].$getFileList().toString()

                this.axios.post('appConfig/update', setting).then((response) => {
                  if (response.data.errno === 0) {
                    this.$message({
                      type: 'success',
                      message: '保存成功'
                    });
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
          })

        },
        getInfo() {
          //加载品牌详情
          this.axios.get('appConfig/detail').then((response) => {
            let resInfo = response.data.data;
            this.infoForm = resInfo;
          })
        },
        picRemove(ref) {
          // 监听修改数据时的图片删除操作
          if (this.infoForm.id && this.infoForm.id > 0) {
            let editPic ={
              id: this.infoForm.id,
              [ref]: this.$refs[ref].$getFileList().toString()
            }
            this.infoForm[ref] = this.$refs[ref].$getFileList().toString()
            this.axios.post('appConfig/updatePic', editPic).then((response) => {
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
        }
      }
    }

</script>
<style>

</style>