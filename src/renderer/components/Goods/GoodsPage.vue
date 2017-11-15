<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="operation-nav">
                <router-link to="/dashboard/goods/add">
                    <el-button type="primary" icon="plus">添加商品</el-button>
                </router-link>
            </div>
        </div>
        <div class="content-main">
            <div class="filter-box">
                <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                    <el-form-item label="商品名称">
                        <el-input v-model="filterForm.name" placeholder="商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称">
                        <el-input v-model="filterForm.name" placeholder="商品名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmitFilter">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="form-table-box">
                <el-table :data="tableData" style="width: 100%" border stripe>
                    <el-table-column type="expand">
                        <template scope="scope">
                            <div class="phone">
                                <div class="phone_view">
                                    <el-carousel height="300px">
                                        <el-carousel-item v-for="item in scope.row.swipe_pic_url" :key="item" class="swipe_box">
                                            <img :src="item" height="100%">
                                        </el-carousel-item>
                                    </el-carousel>
                                    <div class="good_header">
                                        <div class="name">{{scope.row.name}}</div>
                                        <div class="goods_brief">{{scope.row.goods_brief}}</div>
                                        <div class="promotion_tag">
                                            <label v-for="tag in scope.row.promotion_tag">{{tag}}</label>
                                        </div>

                                        <div class="goods_sku">
                                            <div>请选择{{scope.row.sku_label}}:</div>
                                            <div v-for="sku in scope.row.goods_sku">
                                                <div>卖价：{{sku.name}}/{{sku.retail_price}}元 | <span class="market_price">进价：{{sku.name}}/{{sku.cost_price}}</span></div>
                                            </div>
                                        </div>

                                    </div>
                                    <img v-for="descImg in scope.row.desc_pic_url" :src="descImg" width="100%">
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="ID" width="100">
                    </el-table-column>
                    <el-table-column prop="name" label="商品名称">
                    </el-table-column>
                    <el-table-column prop="list_pic_url" label="列表图" width="120">
                        <template scope="scope">
                            <img :src="scope.row.list_pic_url" width="100%"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sell_volume" label="销量" width="120">
                    </el-table-column>
                    <el-table-column prop="is_new" label="新品" width="80">
                        <template scope="scope">
                            {{ scope.row.is_new == 1 ? '新品' : '否' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_new" label="人气" width="80">
                        <template scope="scope">
                            {{ scope.row.is_hot == 1 ? '热销' : '否' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_on_sale" label="上架" width="80">
                        <template scope="scope">
                            {{ scope.row.is_on_sale == 1 ? '是' : '下架' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="like_volume" label="点赞" width="80"></el-table-column>
                    <el-table-column prop="cost_price" label="进价" width="80"></el-table-column>
                    <el-table-column label="操作" width="140">
                        <template scope="scope">
                            <el-button size="small" @click="handleRowEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="handleRowDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="page-box">
                <el-pagination @current-change="handlePageChange" :current-page="page" :page-size="size" layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
  import serverConfig from '../../config/server'
  import ImageService from '../../services/image'
  import appInfo from '../../config'
  let imageUploadService = new ImageService()
  export default {
    data() {
      return {
        size: 20,
        page: 1,
        total: 0,
        filterForm: {
          name: ''
        },
        tableData: []
      }
    },
    methods: {
      handlePageChange(val) {
        this.page = val;
        //保存到localStorage
        localStorage.setItem('goodsPage', this.page)
        localStorage.setItem('goodsFilterForm', JSON.stringify(this.filterForm));
        this.getList()
      },
      handleRowEdit(index, row) {
        this.$router.push({name: 'goods_edit', params: {id: row.id}})
      },
      handleRowDelete(index, row) {

        this.$confirm('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.axios.post('goods/destory', { id: row.id }).then((response) => {
            if (response.data.errno === 0) {
              //取出图片的key，遍历删除
              let picKeys = []
              const separator = serverConfig.IMAGE + '/'
              if(row.list_pic_url.length > separator.length) {
                picKeys.push(row.list_pic_url.split(separator)[1])
              }
              if(row.swipe_pic_url.length > separator.length) {
                picKeys.push(row.swipe_pic_url.split(separator)[1])
              }
              if(row.desc_pic_url.length > separator.length) {
                row.desc_pic_url.split(",").forEach(function (el) {
                  picKeys.push(el.split(separator)[1])
                })
              }

              picKeys.forEach(function (el) {
                imageUploadService.deleteFileFromQiniu({bucket: appInfo.qiniuImageBucket, key: el}).then(response => {

                }).catch(error => {
                  this.$message.error('图片删除失败：' + error.errmsg)
                })
              })

              this.$message({
                type: 'success',
                message: '删除成功!'
              });

              this.getList();
            }
          })


        });
      },
      onSubmitFilter() {
        this.page = 1
        this.getList()
      },
      getList() {
        this.axios.get('goods', {
          params: {
            page: this.page,
            size: this.size,
            name: this.filterForm.name
          }
        }).then((response) => {
          this.tableData = response.data.data.data

          this.tableData.forEach(el => {
            el.list_pic_url = el.list_pic_url.split(",");
            el.swipe_pic_url = el.swipe_pic_url.split(",");
            el.desc_pic_url = el.desc_pic_url.split(",");

            el.promotion_tag = el.promotion_tag.split("*");
          })
          this.page = response.data.data.currentPage
          this.total = response.data.data.count
        })
      }
    },
    components: {

    },
    mounted() {
      this.getList();
    }
  }

</script>

<style lang="scss" scoped>
.swipe_box{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #808080;
}
.good_header{
    display: flex;
    flex-direction: column;
    align-items: center;
    .name{
        margin-top: 10px;
        font-size: 18px;
    }
    .goods_brief{
        margin-top: 10px;
        color: #808080;
    }
    .promotion_tag{
        margin-top: 10px;
        label{
            border: 1px solid orange;
            padding: 2px 5px;
            margin-right: 5px;
            border-radius: 6px;
        }
    }
    .goods_sku{
        .market_price{
            color: #808080;
            text-decoration:line-through;
        }
    }
}
</style>
