<template>
  <div class="login_container">
    <div class="login_box">
    <!--头像区域-->
      <div class="avatar_box">
        <img src="@/assets/img/logo.png" alt="登录logo">
      </div>

      <!--登录表单区域-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        //数据表单的登录绑定对象
        loginForm: {
          username: '',
          password: '',
        },
        //表单验证规则对象
        loginFormRules: {
          // 验证用户名是否合法
          username: [
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          // 验证密码是否合法
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created() {

      },
    methods: {
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      login() {
        // validate是对整个表单进行校验的方法，成功返回true，失败返回false
        this.$refs.loginFormRef.validate(valid => {
          if (!valid) return;
          const result = this.$http.post('login', this.loginForm).then(({data: res}) => {
            // 判断status为200则登录成功
            if (res.meta.status !== 200) return this.$message.error('登录失败');
            else this.$message.success('登录成功');
            // 将token保存在sessionStorage中
            window.sessionStorage.setItem('token', res.data.token);
            this.$router.push('/home');
          })

        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @bgc: #57606f;
  @bos: 0 0 5px #ddd;

  .login_container {
    height: 100%;
    background-color: @bgc;
    overflow: hidden;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: @bos;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: @bos;
    margin: -18% auto 0;
    background-color: #dfe4ea;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #f1f2f6;
    }
  }

  .btns {
    display: flex;
    justify-content: center;
    padding-top: 10px;
  }

  .login_form {
    width: 100%;
    padding: 0 20px;
    margin-top: 20px;
    box-sizing: border-box;
  }

</style>
