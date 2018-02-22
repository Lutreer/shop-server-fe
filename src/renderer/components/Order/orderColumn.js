import orderStatus from '../../assets/js/orderStatus'
export default [
  {
    headerName: '操作',
    field: '',
    cellRendererFramework: 'ag-action-group',
    cellRendererParams: {
      props: {
        agComponents: [
          {
            componentName: 'ag-button',
            props: {
              action: 'detail',
              type: 'default',
              text: '商品',
              submitUrl: '/apps/learn/FindTestOrder/updateTestOrderHeader'
            }
          },
          {
            componentName: 'ag-button',
            props: {
              action: 'changeOrderStatus',
              type: 'waring',
              text: '修改状态',
              submitUrl: '/order/changeOrderStatus'
            }
          }
        ]
      }
    },

  },

  {
    headerName: 'ID',
    field: 'id'
  },
  {
    headerName: 'SN',
    field: 'order_sn'
  },
  {
    headerName: '订单状态',
    field: 'order_status',
    valueGetter: function (params) {
      return orderStatus[params.data[params.colDef.field]]
    },
  },
  {
    headerName: 'user_id',
    field: 'user_id'
  },
  {
    headerName: '支付方式',
    field: 'pay_way'
  },
  {
    headerName: '运费',
    field: 'freight_price'
  },
  {
    headerName: '步数抵扣',
    field: 'werun_price'
  },
  {
    headerName: '商品合计',
    field: 'goods_price'
  },
  {
    headerName: '订单实付',
    field: 'order_price'
  },
  {
    headerName: '收货地址id',
    field: 'address_id'
  },
  {
    headerName: '收货人',
    field: 'address_consignee'
  },
  {
    headerName: '收货人电话',
    field: 'address_mobile'
  },
  {
    headerName: '收货大学',
    field: 'address_college'
  },
  {
    headerName: '收货详细地址',
    field: 'address_detail'
  },
  {
    headerName: '下单时间',
    field: 'add_time'
  },
  {
    headerName: '付款时间',
    field: 'pay_time'
  },
  {
    headerName: '更新时间',
    field: 'update_time'
  },
  {
    headerName: '开始付款时间',
    field: 'start_pay_time'
  },
  {
    headerName: '订单失效时间',
    field: 'expire_pay_time'
  }

]