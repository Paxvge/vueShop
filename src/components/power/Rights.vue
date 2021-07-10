<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <el-table :data="rightsList" border stripe style="width: 100%">
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column label="权限名称" align="center" prop="authName"></el-table-column>
        <el-table-column label="路径" align="center" prop="path"></el-table-column>
        <el-table-column label="权限等级" align="center" prop="level">
          <template v-slot:default="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Rights",
    data() {
      return {
        // 权限列表
        rightsList: []
      }
    },
    created() {
      // 获取所有的权限
      this.getRightsList();
    },
    methods: {
      // 获取所有的权限
      getRightsList() {
        this.$http.get('rights/list').then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('获取权限列表失败');
           else this.rightsList = res.data;
        })
      }
    }

  }
</script>

<style scoped lang="less">

</style>