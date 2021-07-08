<template>
  <div>
    <h2>home</h2>
    <el-button type="info" @click="logout">按钮</el-button>
  </div>
</template>

<script>
export default {
  name: "home",
  methods: {
    logout() {
      // 清除本地sessionStorage的存储内容
      window.sessionStorage.clear();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>

</style>