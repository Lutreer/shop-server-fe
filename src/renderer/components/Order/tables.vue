<template>
    <div>
        <ag-grid-vue class="ag-theme-fresh"
                     :enableColResize="true"
                     :enableSorting="true"
                     :gridOptions="gridOptions"></ag-grid-vue>
    </div>
</template>

<script>

  import { AgGridVue } from 'ag-grid-vue'
  export default {
    components: {AgGridVue},
    data() {
      return {
        gridOptions: {}
      }
    },
    props:{
      columnDefs: Array,
      rowData: Array
    },
    methods: {
      getList() {
        let that = this
        this.axios.get('order').then((response) => {
          debugger
          let data = response.data.data

          that.gridOptions.rowData = data

        })
      }
    },
    beforeMount() {
      this.gridOptions = {}
      this.gridOptions.domLayout = 'autoHeight'
      this.gridOptions.columnDefs = this.columnDefs
      this.gridOptions.rowData =
      this.getList();
    },
    mounted() {

    }
  }

</script>

<style scoped>

</style>
