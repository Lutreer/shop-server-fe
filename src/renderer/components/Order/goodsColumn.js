
export default [
  {
    headerName: 'ID',
    field: 'id'
  },
  {
    headerName: 'good_id',
    field: 'goods_id',
    valueGetter: function (params) {
      params.data.goods_id
    }
  },
  {
    headerName: 'order_id',
    field: 'order_id'
  },
  {
    headerName: '名称',
    field: 'goods_name'
  },
  {
    headerName: '规格名称',
    field: 'sku_name'
  },
  {
    headerName: '数量',
    field: 'number'
  },
  {
    headerName: '市场价',
    field: 'market_price'
  },

  {
    headerName: '卖价',
    field: 'retail_price'
  }

]