<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ currentBreadName }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: {
    currentBreadName: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 30px;
}
</style>