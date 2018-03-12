<template>
    <div>
        <compoennt v-for="(item, index) in agComponents"
                   :key="index"
                   :is="item.componentName"

                   :action="item.props.action"
                   :type="item.props.type"
                   :text="item.props.text"
                   @click.native="click(item.props)">
        </compoennt>
        <el-dialog
                title="请选择状态"
                :visible.sync="changeOrderStatusDialogVisible"
                width="100%">
            <span>认真核对当前状态后再进行操作</span>
            <el-select v-model="toChangeOrderStatusValue" placeholder="请选择订单状态">
                <el-option
                        v-for="(value, key) in orderStatus"
                        :key="key"
                        :label="value"
                        :value="key">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeOrderStatusDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveChangeOrderStatus">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
  import eventBus from '../../assets/js/eventBus'
  import agButton from './AgButton'
  import orderStatus from '../../assets/js/orderStatus'

  import {AgGridVue} from 'ag-grid-vue'
  import AgActionGroup from './AgActionGroup.vue'

  export default {
    name: "ag-action-group",
    components: {agButton, AgGridVue, AgActionGroup},
    data() {
      return {
        agComponents: "",
        thisParent: null,
        orderStatus: orderStatus,
        currentSubmitUrl: '',
        currentRowData: {},

        // 修改订单状态 TODO 该功能需做严格限制
        toChangeOrderStatusValue: null,
        changeOrderStatusDialogVisible: false,
        goodsDetailDialogVisible:false
      };
    },
    props: {
    },
    beforeMount() {
      this.agComponents = this.params.props.agComponents
      this.thisParent = this.params.context.thisParent
    },
    methods: {
      click(props) {
        this.currentRowData = this.params.node.data
        let action = props.action
        this.currentSubmitUrl = props.submitUrl

        switch (action) {
          case 'delete' :

            break
          case 'detail' :
            this.orderGoodsDetail()
            break
          case 'changeOrderStatus' :

            this.changeOrderStatus()
            break
        }

      },
      orderGoodsDetail(){
        eventBus.$emit('showGoodsDetail', this.currentRowData.order_goods)
      },
      changeOrderStatus(){
        this.changeOrderStatusDialogVisible = true
      },
      saveChangeOrderStatus() {
        if(this.toChangeOrderStatusValue == null) return false
        this.axios.post(this.currentSubmitUrl, {orderId: this.currentRowData.id, orderStatus: this.toChangeOrderStatusValue}).then((response) => {
          if (response.data.errno === 0) {
            this.$message({
              type: 'success',
              message: '更新成功'
            });
            this.changeOrderStatusDialogVisible = false
            // TODO 更新列表
          } else {
            this.$message({
              type: 'error',
              message: '更新失败'
            })
          }
        })
      },








      getValue() {

      },
      isPopup() {
      },
      isCancelBeforeStart() {
      },
      isCancelAfterEnd() {
      }
    }
  };
</script>
<style scoped>

</style>
