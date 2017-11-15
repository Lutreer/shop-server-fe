<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>店铺运营</el-breadcrumb-item>
                <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="operation-nav">
                <router-link to="/dashboard/operate/topic/add">
                    <el-button type="primary" icon="plus">添加专题</el-button>
                </router-link>
            </div>
        </div>
        <div class="content-main">
            <div class="filter-box">
                <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                    <el-form-item label="专题名称">
                        <el-input v-model="filterForm.name" placeholder="专题名称"></el-input>
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
                                    <img v-for="descImg in scope.row.desc_pic_url" :src="descImg" width="100%">
                                    <div class="goods_box">
                                        <el-card class="box-card" v-for="(good, index) in scope.row.goods" v-bind:key="index">
                                            <img :src="good.list_pic_url" alt="">
                                            <div>{{good.name}}</div>
                                            <div v-for="(sku, index) in good.goods_sku" v-bind:key="index">
                                                <div>卖价：{{sku.name}}/{{sku.retail_price}}元 | <span class="market_price">进价：{{sku.name}}/{{sku.cost_price}}</span>
                                                </div>
                                            </div>
                                        </el-card>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="ID" width="100"></el-table-column>
                    <el-table-column prop="title" label="二级标题" width="120">
                        <template scope="scope">
                            <img :src="scope.row.list_pic_url" alt="" width="100%">
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="标题"></el-table-column>
                    <el-table-column prop="title" label="二级标题"></el-table-column>

                    <el-table-column prop="read_count" label="阅读量" width="80"></el-table-column>
                    <el-table-column prop="is_show" label="是否显示" width="100">
                        <template scope="scope">
                            {{ scope.row.is_show == 1 ? '是' : '否' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort_order" label="排序" width="80">
                    </el-table-column>
                    <el-table-column label="操作" width="140">
                        <template scope="scope">
                            <el-button size="small" @click="handleRowEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="handleRowDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="page-box">
                <el-pagination @current-change="handlePageChange" :current-page="page" :page-size="size"
                               layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>

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
        localStorage.setItem('topicPage', this.page)
        localStorage.setItem('topicFilterForm', JSON.stringify(this.filterForm));
        this.getList()
      },
      handleRowEdit(index, row) {
        this.$router.push({name: 'topic_edit', params: {id: row.id}})
      },
      handleRowDelete(index, row) {

        this.$confirm('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.axios.post('topic/destory', {id: row.id}).then((response) => {
            console.log(response.data)
            if (response.data.errno === 0) {
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
        this.axios.get('topic', {
          params: {
            page: this.page,
            size: this.size,
            name: this.filterForm.name
          }
        }).then((response) => {
          this.tableData = response.data.data.data

          this.tableData.forEach(el => {
            el.desc_pic_url = el.desc_pic_url.split(",");
          })
          this.page = response.data.data.currentPage
          this.total = response.data.data.count
        })
      }
    },
    components: {},
    mounted() {
      this.getList();
    }
  }

</script>

<style lang="scss" scoped>
.swipe_box {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #808080;
}
.good_header {
    display: flex;
    flex-direction: column;
    align-items: center;
    .name {
        margin-top: 10px;
        font-size: 18px;
    }
    .goods_brief {
        margin-top: 10px;
        color: #808080;
    }
    .promotion_tag {
        margin-top: 10px;
        label {
            border: 1px solid orange;
            padding: 2px 5px;
            margin-right: 5px;
            border-radius: 6px;
        }
    }
    .goods_sku {
        .market_price {
            color: #808080;
            text-decoration: line-through;
        }
    }
}

</style>
