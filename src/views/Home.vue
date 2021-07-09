<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="@/assets/img/shop.svg" alt="商城logo">
        <span>订单后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="widthCollapse">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边栏菜单区域-->
        <el-menu
            class="el-menu-vertical-demo"
            background-color="#2f3640"
            text-color="#fff"
            active-text-color="#409bff"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :default-active="$route.path"
            router>
          <!--一级菜单-->
          <el-submenu :index="item.id.toString()"
                      v-for="(item,index) in meunlist"
                      :key="item.id">
            <!--一级菜单的模板区域-->
            <template slot="title">
              <i :class="iconsObj[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/' + itemList.path"
                          v-for="itemList in item.children"
                          :key="itemList.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{itemList.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!--右侧主题内容-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "home",
    data() {
      return {
        // 左侧菜单数据
        meunlist: [],
        iconsObj: [
          'el-icon-user-solid',
          'el-icon-s-tools',
          'el-icon-shopping-bag-1',
          'el-icon-s-order',
          'el-icon-document-copy',
        ],
        isCollapse: false
      }
    },
    computed: {
      widthCollapse() {
        return this.isCollapse ? '64px' : '200px'
      }
    },
    components: {

    },
    created() {
      this.getMenuList();
    },
    methods: {
      logout() {
        // 清除本地sessionStorage的存储内容
        window.sessionStorage.clear();
        this.$router.push('/login');
      },
      // 获取所有的菜单
      getMenuList() {
        this.$http.get('menus').then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          else this.meunlist = res.data;
        })
      },
      // 切换菜单折叠与展开
      toggleCollapse() {
        this.isCollapse = !this.isCollapse;
      }
    }
  }
</script>

<style scoped lang="less">
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #dcdde1;
    letter-spacing: 1px;
  }

  .el-header div {
    font-size: 20px;
    display: flex;
    align-items: center;
  }

  .el-header img {
    width: 50px;
    padding-right: 10px;
  }
  .el-button {
    font-size: 16px;
    letter-spacing: 3px;
    padding: 13px;
    font-weight: bold;
  }

 .el-aside {
   background-color: #2f3640;
 }

 .el-menu {
   border-right: none;
 }

 .iconfont {
   margin-right: 10px;
 }

 .toggle-button {
   background-color: #4a5064;
   font-size: 10px;
   line-height: 28px;
   color: #eeeeee;
   text-align: center;
   letter-spacing: 0.2em;
   cursor: pointer;
   font-weight: bolder;
 }

 .el-main {
   background-color: #dcdde1;
 }

</style>