<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>订单中心</el-breadcrumb-item>
                <el-breadcrumb-item>订单列表</el-breadcrumb-item>
            </el-breadcrumb>

        </div>
        <div class="content-main">
            <el-date-picker
                    v-model="searchDateTime"
                    type="datetimerange"
                    placeholder="选择时间范围">
            </el-date-picker>
            <el-button @click="searchByDateTime">确定</el-button>
            <div class="form-table-box">
                <ag-grid-vue style="height:600px" class="ag-theme-fresh"
                             :enableColResize="true"
                             :enableSorting="true"
                             :gridOptions="gridOptions"></ag-grid-vue>
            </div>

        </div>


        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="100%">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>

  import orderColumn from './orderColumn'
  import {AgGridVue} from 'ag-grid-vue'
  import AgActionGroup from './agActionGroup.vue'

  export default {
    components: {
    'ag-grid-vue': AgGridVue,
    'ag-action-group': AgActionGroup
    },
    data() {
      return {
        columnDefs: [],
        rowData: [],
        searchDateTime: [],
        dialogVisible: false
      }
    },

    methods: {
      getList(params) {
        let that = this
        this.axios.get('order', {params: params}).then((response) => {
          let data = response.data.data
          that.gridOptions.api.setRowData([...data, ...data, ...data, ...data])
        })
      },
      searchByDateTime() {
        debugger
        this.getList({startTime: this.searchDateTime[0], endTime: this.searchDateTime[1]})
      }
    },
    beforeMount() {
      orderColumn.map(el => {
        el['menuTabs'] = ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab']
        el['enableRowGroup'] = true
        // el['enablePivot'] = true
        el['enableValue'] = true
        // el['aggFunc'] = true
        // el['pivot'] = true
      })
      this.gridOptions = {}
      this.gridOptions.context = {}
      this.gridOptions.context.thisParent = this
      // this.gridOptions.domLayout = 700
      this.gridOptions.floatingFilter = true
      this.gridOptions.columnDefs = orderColumn
      this.gridOptions.rowGroupPanelShow = 'always'
      // this.gridOptions.getMainMenuItems = ['pinSubMenu', 'valueAggSubMenu']

      this.gridOptions.rowData = []
      this.getList();
    },
    mounted() {

    }
  }

</script>

<style scoped>

</style>
<style>
    /*优化aggrid样式*/
    .ag-row:hover{
        background-color: #b8e0ff;
    }
    .ag-row-focus{
        background-color: #b8e0ff !important;
    }
    .ag-theme-fresh .ag-cell-focus {
        border: 1px solid transparent !important;
        background-color: #f5bfa0 !important;
    }

    .ag-theme-fresh .ag-cell-inline-editing {
        padding: 0 12px !important;
    }

    .ag-column-select-label {
        cursor: move;
    }

    .ag-column-select-column:hover {
        background: #f5bfa0;
    }

    .ag-floating-filter-full-body input {
        height: 24px;
    }
    .ag-floating-filter-full-body .ivu-select-multiple .ivu-select-selection{
        overflow: auto;
    }
</style>
