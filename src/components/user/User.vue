<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="handleCurrentChange(1)">
            <el-button slot="append" icon="el-icon-search" @click="handleCurrentChange(1)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="姓名" align="center" prop="username"></el-table-column>
        <el-table-column label="邮箱" align="center" prop="email"></el-table-column>
        <el-table-column label="电话" align="center" prop="mobile"></el-table-column>
        <el-table-column label="角色" align="center" prop="role_name"></el-table-column>
        <el-table-column label="状态" align="center" prop="mg_state">
          <template v-slot:default="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180px">
          <template v-slot:default="scope">
            <!--修改按钮-->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!--删除按钮-->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <!--分配角色按钮-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" background>
      </el-pagination>
    </el-card>

    <!--添加用户的对话框-->
    <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
      <!--内容主体区-->
      <el-form ref="addFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.number="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改用户的对话框-->
    <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%">
      <!--内容主体区-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.number="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false" @close="editDialogClosed">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>

    <!--分配角色的对话框-->
    <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        @close="setRoleDialogClosed">
      <p>当前的用户：{{userInfo.username}}</p>
      <p>当前的角色：{{userInfo.role_name}}</p>
      <p>当前的角色：
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "User",
    data() {
      return {
        // 获取用户列表的参数对象
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5,
        },
        userlist: [],
        total: 0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 添加表单的验证规则对象
        addFormRules: {
          username: [
            {
              required: true,
            message: '请输入用户名',
            trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '用户名的长度在3~10字符之间',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 15,
              message: '密码的长度在6~15字符之间',
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            { type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              type: 'number',
              message: '手机号必须为数字值',
              trigger: 'blur'
            }
          ]
        },
        // 控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        // 查询到的用户信息对象
        editForm: {},
        // 修改表单的验证规则对象
        editFormRules: {
          email: [
            {
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            { type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              type: 'number',
              message: '手机号必须为数字值',
              trigger: 'blur'
            }
          ]
        },
        // 控制分配角色对话框的显示与隐藏
        setRoleDialogVisible: false,
        // 需要被分配角色的用户信息
        userInfo: {},
        // 所有角色的数据列表
        rolesList: [],
        // 已选中的角色Id值
        selectedRoleId: ''
      }
    },
    created() {
      this.getUserList();
    },
    methods: {
      getUserList() {
        this.$http.get('users', {params: this.queryInfo}).then(({data: res}) => {
          if(res.meta.status !== 200) return this.$message.error('获取用户列表失败');
          else {
            this.userlist = res.data.users;
            this.total = res.data.total;
          }
        })
      },
      // 监听pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getUserList();
      },
      // 监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getUserList();
      },
      // 监听switch开关状态的改变
      userStateChanged(userinfo) {
        this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`).then(({data: res}) => {
          if (res.meta.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state;
            return this.$message.error('更新用户状态失败');
          } else this.$message.success('更新用户状态成功');
        })
      },
      // 监听添加用户对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields();
      },
      // 点击按钮，添加新用户
      addUser() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return this.$message.error('请输入正确信息');
          else this.$http.post('users', this.addForm).then(({data: res}) => {
            if (res.meta.status !== 201) {
              return this.$message.error('添加用户失败');
            } else {
              this.$message.success('添加用户成功');
              // 隐藏对话框
              this.addDialogVisible = false;
              // 重新获取用户列表数据
              this.getUserList();
            }
          })
        })
      },
      // 展示编辑用户的对话框
      showEditDialog(id) {
        this.$http.get('users/' + id).then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('查询用户信息失败');
          else this.editForm = res.data;
        })
        this.editDialogVisible = true;
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields();
      },
      // 修改用户信息并提交
      editUserInfo() {
        this.$refs.editFormRef.validate(valid => {
          if (!valid) return this.$message.error('请输入正确信息');
          else this.$http.put('users/' + this.editForm.id,{
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }).then(({data: res}) => {
            if (res.meta.status !== 200) {
              return this.$message.error('更新用户失败');
            } else {
              this.$message.success('更新用户成功');
              // 隐藏对话框
              this.editDialogVisible = false;
              // 重新获取用户列表数据
              this.getUserList();
            }
          })
        })
      },
      // 根据Id删除对应的用户信息
      removeUserById(id) {
        // 弹窗询问用户是否删除数据
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          this.$http.delete('users/' + id).then(({data: res}) => {
            if (res.meta.status !== 200) return this.$message.error('删除用户失败');
            else {
              this.$message.success('删除用户成功');
              // 重新获取用户列表数据
              this.getUserList();
            }
          })
        }).catch(err => {
          return this.$message.info('已取消删除');
        })

      },
      // 展示分配角色的对话框
      setRole(userInfo) {
        this.userInfo = userInfo;
        // 展示对话框之前，获取所有角色列表
        this.$http.get('roles').then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('获取角色列表失败');
          else this.rolesList = res.data;
        })
        this.setRoleDialogVisible = true;
      },
      // 点击按钮，分配角色
      saveRoleInfo() {
        if (!this.selectedRoleId) return this.$message.error('请选择要分配的角色');
        else {
          this.$http.put(`users/${this.userInfo.id}/role`,
              {rid: this.selectedRoleId}).then(({data: res}) => {
            console.log(res);
            if (res.meta.status !== 200) return this.$message.error('更新角色失败');
                else {
                  this.$message.success('更新角色成功');
                  this.getUserList();
                  this.setRoleDialogVisible = false;
                }
          })
        }
      },
      // 监听分配角色对话框的关闭事件
      setRoleDialogClosed() {
        this.selectedRoleId = '';
        this.userInfo = '';
      }
    }
  }
</script>

<style scoped>

</style>