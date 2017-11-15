<template>
    <el-dialog
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            title="请选择商品"
            :visible.sync="dialogVisible"
            size="large"
            :before-close="handleClose"
            tooltip-effect="dark"
            style="height: 100%;overflow: auto;"
            @selection-change="handleSelectionChange">
        <div class="content-main">
            <div class="filter-box">
                <el-form :inline="true" :model="filterForm" class="search-form">
                    <el-form-item label="商品名称">
                        <el-input v-model="filterForm.name" placeholder="商品名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmitFilter">查询</el-button>
                    </el-form-item>
                </el-form>

                <div>
                    <el-button type="success" @click="confirmSelect" class="confirmSelect">确定</el-button>
                    <el-button @click="cancelSelect" class="confirmSelect">取消</el-button>
                </div>
            </div>
            <div class="form-table-box">
                <el-table :data="tableData"
                          ref="multipleTable"
                          style="width: 100%"
                          border
                          tooltip-effect="dark"
                          @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="id" label="ID" width="100"></el-table-column>
                    <el-table-column prop="name" label="商品名称"></el-table-column>
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
                </el-table>
            </div>
            <div class="page-box">
                <el-pagination @current-change="handlePageChange" :current-page="page" :page-size="10" layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </el-dialog>

</template>

<script>
  export default {
    name: 'GoodSelectDialog',
    props: ['p_ref', 'p_selectType', 'p_emit_confirm'],
    components: {},
    data() {
      return {
        dialogVisible: false,
        result:[],

        page: 1,
        size: 10,
        total: 0,
        filterForm: {
          name: ''
        },
        tableData: []
      }
    },
    methods: {
      $getResult() {
        return this.result
      },
      $show() {
        this.dialogVisible = true
      },
      $hide() {
        this.dialogVisible = false
      },
      handlePageChange(val) {
        this.page = val;
        localStorage.setItem('goodsPage', this.page)
        localStorage.setItem('goodsFilterForm', JSON.stringify(this.filterForm));
        this.getList()
      },
      handleClose(done) {
        this.$refs.multipleTable.clearSelection();
        done();
      },
      onSubmitFilter() {
        this.page = 1
        this.getList()
      },
      handleSelectionChange(val) {
        this.result = val
      },
      confirmSelect() {
        this.$emit(this.p_emit_confirm, this.result)
        this.$refs.multipleTable.clearSelection();
        this.dialogVisible = false
      },
      cancelSelect() {
        this.$refs.multipleTable.clearSelection();
        this.dialogVisible = false
      },
      getList() {
        this.axios.get('goods/simpleGoodsList', {
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
    mounted() {
      this.getList();
    }
  }

</script>

<style lang="scss" scoped>
    .filter-box{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }
</style>
