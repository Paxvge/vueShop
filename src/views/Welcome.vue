<template>
  <div class="welcome">
    <h1 class="welcome_font">Welcome</h1>
  </div>
</template>

<script>
  export default {
    name: "Welcome"
  }
</script>

<style scoped>
  .welcome {
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .welcome_font {
    font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
    font-size: 75px;
    color: #373d41;
    letter-spacing: .1em;
    text-shadow: 1px 1px 3px #444;
  }

</style>