<template>
   <el-button :type="type" size="mini">{{text}}</el-button>

</template>

<script>

  export default {
    name: "ag-button",
    props:{
      action:String,
      type:String,
      text:String,
      submitUrl:String
    },
    data() {
      return {

      };
    },
    beforeMount() {

    },
    methods: {

    }
  };
</script>

