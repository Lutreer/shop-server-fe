<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>推推管理</el-breadcrumb-item>
                <el-breadcrumb-item>推推列表</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="operation-nav">
                <router-link to="/dashboard/brand/add">
                    <el-button type="primary" icon="plus">添加推推</el-button>
                </router-link>
            </div>
        </div>
        <div class="content-main">
            <div class="filter-box">
                <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                    <el-form-item label="推推名称">
                        <el-input v-model="filterForm.title" placeholder="推推名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmitFilter">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="form-table-box">
                <el-table :data="tableData" style="width: 100%" border stripe>
                    <el-table-column prop="id" label="ID" width="95"></el-table-column>
                    <el-table-column prop="title" width="160" label="推推名称"></el-table-column>
                    <el-table-column prop="outter_pic_url" width="100" label="首页图">
                        <template scope="scope">
                            <img :src="scope.row.outter_pic_url" width="100%"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="inner_pic_url" width="100" label="列表图">
                        <template scope="scope">
                            <img :src="scope.row.inner_pic_url" width="100%"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="推推描述"></el-table-column>
                    <el-table-column prop="show_in_home" label="首页显示" width="100">
                        <template scope="scope">
                            {{ scope.row.show_in_home == 1 ? '首页' : '否' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_show" label="启用否" width="80">
                        <template scope="scope">
                            {{ scope.row.is_show == 1 ? '启用' : '否' }}
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
  import serverConfig from '../../config/server'
  import ImageService from '../../services/image'
  import appInfo from '../../config'
  let imageUploadService = new ImageService()

  export default {
    data() {
      return {
        size:20,
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
        localStorage.setItem('brandPage', this.page)
        localStorage.setItem('brandFilterForm', JSON.stringify(this.filterForm));
        this.getList()
      },
      handleRowEdit(index, row) {
        this.$router.push({name: 'brand_edit', params: {id: row.id}})
      },
      /**
       * 删除一个推推
       * 先删数据库，再删七牛的图片，不管图片删除是否成功。
       * @param index
       * @param row
       */
      handleRowDelete(index, row) {
        this.$confirm('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.axios.post('brand/destory', {id: row.id}).then((response) => {
            if (response.data.errno === 0) {
              //取出图片的key，遍历删除
              let picKeys = []
              const separator = serverConfig.IMAGE + '/'
              if(row.inner_pic_url.length > separator.length) {
                picKeys.push(row.inner_pic_url.split(separator)[1])
              }
              if(row.outter_pic_url.length > separator.length) {
                picKeys.push(row.outter_pic_url.split(separator)[1])
              }
              if(row.content_pic_url.length > separator.length) {
                row.content_pic_url.split(",").forEach(function (el) {
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
        this.axios.get('brand', {
          params: {
            page: this.page,
            size: this.size,
            title: this.filterForm.title
          }
        }).then((response) => {
          this.tableData = response.data.data.data
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

<style scoped>

</style>
