<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{infoForm.id ? '编辑商品' : '添加商品'}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="operation-nav">
                <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
            </div>
        </div>
        <div class="content-main">
            <div class="form-table-box">
                <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
                    <el-form-item label="所属分类">
                        <el-select v-model="infoForm.category_id" placeholder="请选择分类">
                            <el-option v-for="(item, index) in allCategory" v-bind:key="index" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属推推">
                        <el-select placeholder="请选择推推（可空）" v-model="infoForm.brand_id">
                            <el-option v-for="(item, index) in allBrand" v-bind:key="index" :label="item.title"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="商品名称" prop="name">
                        <el-input v-model="infoForm.name"></el-input>
                    </el-form-item>

                    <el-form-item label="促销标签" prop="promotion_tag">
                        <el-input type="textarea" v-model="infoForm.promotion_tag" :rows="3" placeholder="使用*分隔"></el-input>
                        <div class="form-tip"></div>
                    </el-form-item>

                    <el-form-item label="商品简介" prop="goods_brief">
                        <el-input type="textarea" v-model="infoForm.goods_brief" :rows="3"></el-input>
                        <div class="form-tip"></div>
                    </el-form-item>

                    <el-form-item label="描述" prop="goods_desc">
                        <el-input v-model="infoForm.goods_desc"></el-input>
                    </el-form-item>

                    <el-form-item label="库存" prop="goods_volume">
                        <el-input v-model="infoForm.goods_volume"></el-input>
                    </el-form-item>

                    <el-form-item label="列表图片">
                        <qiniu-upload ref="list_pic_url"
                                      p_ref="list_pic_url"
                                      :p_file-list="infoForm.list_pic_url"
                                      p_emitOnRemove="picRemove"
                                      v-on:picRemove="picRemove"
                        >
                        </qiniu-upload>
                        <div class="form-tip">图片数量：仅1张；图片尺寸：375*252</div>
                    </el-form-item>

                    <el-form-item label="轮播图片">
                        <qiniu-upload ref="swipe_pic_url"
                                      p_ref="swipe_pic_url"
                                      :p_file-list="infoForm.swipe_pic_url"
                                      p_emitOnRemove="picRemove"
                                      v-on:picRemove="picRemove"
                        >
                        </qiniu-upload>
                        <div class="form-tip">图片数量：1~3张；图片尺寸：375*252</div>
                    </el-form-item>

                    <el-form-item label="描述图片">
                        <qiniu-upload ref="desc_pic_url"
                                      p_ref="desc_pic_url"
                                      :p_file-list="infoForm.desc_pic_url"
                                      p_emitOnRemove="picRemove"
                                      v-on:picRemove="picRemove"
                        >
                        </qiniu-upload>
                        <div class="form-tip">图片数量：1~5张；图片尺寸：375*252</div>
                    </el-form-item>

                    <el-form-item label="点赞数" prop="like_volume">
                        <el-input v-model="infoForm.like_volume"></el-input>
                    </el-form-item>

                    <el-form-item label="销量" prop="sell_volume">
                        <el-input v-model="infoForm.sell_volume"></el-input>
                    </el-form-item>

                    <el-form-item label="是否可售" prop="is_on_sale">
                        <el-switch on-text="" off-text="" v-model="infoForm.is_on_sale"></el-switch>
                    </el-form-item>

                    <el-form-item label="新品" prop="is_new">
                        <el-switch on-text="" off-text="" v-model="infoForm.is_new"></el-switch>
                    </el-form-item>
                    <el-form-item label="热销" prop="is_hot">
                        <el-switch on-text="" off-text="" v-model="infoForm.is_hot"></el-switch>
                    </el-form-item>

                    <el-form-item label="进价" prop="cost_price">
                        <el-input v-model="infoForm.cost_price"></el-input>
                    </el-form-item>
                    <el-form-item label="规格标题" prop="sku_label">
                        <el-input v-model="infoForm.sku_label" placeholder="颜色，份量，尺寸等"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="价格计划" prop="goods_sku">
                                <el-col v-for="(plan, index) in infoForm.goods_sku" :span="8" :key="index"
                                        class="price-plan-box">
                                    <div class="children-form" label-width="90px">

                                        <el-form-item label="规格名称" prop="name" class="price-plan-item">
                                            <el-input v-model="plan.name" placeholder="500g/份, 红色热情奔放款等"></el-input>
                                        </el-form-item>

                                        <el-form-item label="零售价" prop="retail_price" class="price-plan-item">
                                            <el-input v-model="plan.retail_price"></el-input>
                                        </el-form-item>

                                        <el-form-item label="市场价格" prop="market_price" class="price-plan-item">
                                            <el-input v-model="plan.market_price" placeholder="颜色，份量，尺寸等"></el-input>
                                        </el-form-item>

                                        <!--<el-form-item label="图片">-->
                                        <!--<qiniu-upload ref="sku_pic_url"-->
                                        <!--p_ref="sku_pic_url"-->
                                        <!--:p_file-list="plan.sku_pic_url"-->
                                        <!--p_emitOnRemove="picRemove"-->
                                        <!--v-on:picRemove="picRemove"-->
                                        <!--&gt;-->
                                        <!--</qiniu-upload>-->
                                        <!--<div class="form-tip">图片数量：仅1张；图片尺寸：375*252</div>-->
                                        <!--</el-form-item>-->

                                        <el-form-item label="进价" prop="cost_price" class="price-plan-item">
                                            <el-input v-model="plan.cost_price"></el-input>
                                        </el-form-item>
                                        <el-form-item label="数量" prop="quantity_num" class="price-plan-item">
                                            <el-input v-model="plan.quantity_num" placeholder="500"></el-input>
                                        </el-form-item>
                                        <el-form-item label="数量单位" prop="quantity_unit" class="price-plan-item">
                                            <el-input v-model="plan.quantity_unit" placeholder="g"></el-input>
                                        </el-form-item>
                                        <el-form-item label="备注" prop="remark" class="price-plan-item">
                                            <el-input v-model="plan.remark" placeholder="简短的说明"></el-input>
                                        </el-form-item>
                                        <el-form-item label="+购物车" prop="add_cart_sym" class="price-plan-item">
                                            <el-input v-model="plan.add_cart_sym" placeholder="添加购物车的符号"></el-input>
                                        </el-form-item>
                                        <el-form-item label="上架(显示)" prop="is_show">
                                            <el-switch on-text="上" off-text="下" v-model="plan.is_show"></el-switch>
                                        </el-form-item>
                                    </div>
                                    <i class="el-icon-close remove-price-plan" @click="removeGoodsSku(index)"></i>
                                </el-col>
                                <el-col :span="4" class="price-plan-box">
                                    <el-row v-on:click.native="addGoodsSku" type="flex" justify="center" align="middle"
                                            class="add-price-plan">
                                        <i class="el-icon-plus"></i>
                                    </el-row>
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </el-row>
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
                    <el-form-item label="排序" prop="sort_order">
                        <el-input-number v-model="infoForm.sort_order" :min="1" :max="10000"></el-input-number>
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
    props: ['id'],
    components: {QiniuUpload, GoodSelectDialog},
    data() {
      return {
        allCategory: [],
        allBrand: [],
        infoForm: {
          id: 0,
          category_id: null,
          brand_id: null,
          name: "",
          promotion_tag: '',
          goods_brief: '',
          goods_desc: '',
          goods_volume: '',
          list_pic_url: '',
          swipe_pic_url: '',
          desc_pic_url: '',
          like_volume: '',
          sell_volume: '',
          is_on_sale: true,
          is_hot: false,
          is_new: false,
          cost_price: '',
          sort_order: 999,

          goods_sku: [],// goods_id, sku_label, name, retail_price, market_price, quantity_num, quantity_unit, remark, cost_price, sku_pic_url, is_show
          goods: []
        },
        infoRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          goods_brief: [
            {required: false, message: '请输入简介', trigger: 'blur'},
          ]
        },
      }
    },
    methods: {
      goBackPage() {
        this.$router.go(-1);
      },
      onSubmitInfo() {
        this.infoForm
        this.$refs['infoForm'].validate((valid) => {
          if (valid) {
            let goods = _.cloneDeep(this.infoForm)
            goods.list_pic_url = this.$refs['list_pic_url'].$getFileList().toString()
            goods.swipe_pic_url = this.$refs['swipe_pic_url'].$getFileList().toString()
            goods.desc_pic_url = this.$refs['desc_pic_url'].$getFileList().toString()

            goods.cost_price = Number(goods.cost_price || 9999)
            goods.goods_volume = Number(goods.goods_volume || 0)
            goods.like_volume = Number(goods.like_volume || 0)
            goods.sell_volume = Number(goods.sell_volume || 0)

            goods.goods_sku.forEach(el => {
              el.cost_price = Number(el.cost_price || 9999)
              el.market_price = Number(el.market_price || 9999)
              el.quantity_num = Number(el.quantity_num || 9999)
              el.retail_price = Number(el.retail_price || 9999)
            })

            let goods_goods = []
            goods.goods.forEach(good => {
              goods_goods.push(good.id)
            })
            goods.goods = goods_goods

            this.axios.post('goods/store', goods).then((response) => {
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
            //商品图片
            case 'brand_pic':
              this.$set('infoForm.list_pic_url', res.data.fileUrl);
              break;
            case 'brand_new_pic':
              this.$set('infoForm.new_pic_url', res.data.fileUrl);
              break;
          }
        }
      },
      getInfo() {
        //加载所有分类
        this.axios.get('category').then((response) => {
          this.allCategory = response.data.data;
        })
        //加载所有推推
        this.axios.get('brand').then((response) => {
          this.allBrand = response.data.data.data;

        })
        if (this.infoForm.id <= 0) {
          return false
        }
        this.axios.get('goods/info', {
          params: {
            id: this.infoForm.id
          }
        }).then(response => {
          let resInfo = response.data.data;
          resInfo.is_on_sale = resInfo.is_on_sale ? true : false;
          resInfo.is_new = resInfo.is_new ? true : false;
          resInfo.is_hot = resInfo.is_hot ? true : false;

          resInfo.goods_sku.forEach(sku => {
            sku.is_show = sku.is_show ? true : false
          })

          this.infoForm = resInfo;
        })
      },
      addGoodsSku() {
        this.infoForm.goods_sku.push({
          id: 0,
          goods_id: 0,
          name: '',
          retail_price: '',
          market_price: '',
          quantity_num: 0,
          quantity_unit: '',
          cost_price: '',
          remark: '',
          is_show: ''
        })
      },
      removeGoodsSku(index) {
        if(this.infoForm.goods_sku[index].id > 0){
          this.$confirm('确定要删除该价格计划吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.axios.post('goods/skuDelete', {id: this.infoForm.goods_sku[index].id}).then((response) => {
              if (response.data.errno === 0) {
                this.infoForm.goods_sku.splice(index, 1)
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败，请刷新重试！'
                })
              }
            })
          })
        }

      },
      picRemove(ref) {
        // 监听修改数据时的图片删除操作
        if (this.id && this.id > 0) {
          let editPic = {
            id: this.infoForm.id,
            [ref]: this.$refs[ref].$getFileList().toString()
          }
          this.infoForm[ref] = this.$refs[ref].$getFileList().toString()
          this.axios.post('goods/updatePic', editPic).then((response) => {
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

<style lang="scss">
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

    .price-plan-box {
        padding: 0 15px 15px 0;
        position: relative;

        .remove-price-plan {
            position: absolute;
            right: 7px;
            top: -10px;
            color: #fff;
            padding: 3px;
            border-radius: 10px;
            background-color: #f1a2a2;
            cursor: pointer;

            &:hover {
                background-color: #da6464;
            }
        }

        .children-form {
            border: 1px dashed #ddd;
            padding: 0 15px 0 0;
            background-color: #fff;
        }

        .add-price-plan {
            height: 148px;
            border: 1px dashed #ddd;
            background-color: #fff;
            cursor: pointer;

            &:hover {
                border: 1px dashed #ccc;
                i {
                    color: #ddd;
                }
            }

            i {
                font-size: 70px;
                color: #eee;
            }
        }

        .price-plan-item {
            margin: 10px 0;

            label {
                width: 100px !important;
            }
        }
    }

</style>
