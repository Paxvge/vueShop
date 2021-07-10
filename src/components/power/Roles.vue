<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!--添加角色按钮区域-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表区域-->
      <el-table :data="roleList" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-row :class="['bdbottom', index1 === 0 ? 'bdtop' : '']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级、三级权限-->
              <el-col :span="19">
                <!--通过for循环嵌套渲染二级权限-->
                <el-row :class="[index2 === 0 ? '' : 'bdtop']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!--通过for循环嵌套渲染三级权限-->
                    <el-tag type="warning" v-for="(item3, index3) in item2.children"
                            :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="角色名称" align="center" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" align="center" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template v-slot:default="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRolesById(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!--添加角色对话框-->
    <el-dialog
        title="添加角色"
        :visible.sync="addRoleDialogVisible"
        width="40%"
        @close="addRoleDialogClosed">
      <el-form
          :model="addRoleForm"
          ref="addRoleFormRef"
          :rules="addRoleFormRules"
          label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑角色对话框-->
    <el-dialog
        title="编辑角色"
        :visible.sync="editRoleDialogVisible"
        width="40%"
        @close="editRoleDialogClosed">
      <el-form
          :model="editRoleForm"
          ref="editRoleFormRef"
          :rules="editRoleFormRules"
          label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!--分配权限对话框-->
    <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%" @close="setRightDialogClosed">
      <!--树形控件-->
      <el-tree :data="rightsList"
               :props="treeProps"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="defKeys"
               ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        // 所有角色列表数据
        roleList: [],
        // 添加用户对话框
        addRoleDialogVisible: false,
        // 添加角色表单
        addRoleForm: {},
        //   添加角色表单验证
        addRoleFormRules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请输入角色描述', trigger: 'blur' }
          ]
        },
        //   编辑角色信息
        editRoleForm: {},
        editRoleDialogVisible: false,
        editRoleFormRules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请输入角色描述', trigger: 'blur' }
          ]
        },
        // 控制分配权限对话框的显示与隐藏
        setRightDialogVisible: false,
        // 所有权限的数据
        rightsList: [],
        // 树形控件的属性绑定对象
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        // 默认选中的节点Id值数组
        defKeys: [],
        // 当前即将分配权限的Id
        roleId: 0
      }
    },
    created() {
      this.getRolesList();
    },
    methods: {
      // 获取所有角色列表
      getRolesList() {
        this.$http.get('roles').then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('获取角色列表失败');
          else this.roleList = res.data;
        })
      },
      // 添加角色
      addRoles() {
        this.$refs.addRoleFormRef.validate(valid => {
          if (!valid) return this.$message.error('请输入正确信息');
          else this.$http.post('roles', this.addRoleForm).then(({data: res}) => {
            if (res.meta.status !== 201) {
              return this.$message.error('添加角色失败');
            } else {
              this.$message.success('添加角色成功');
              // 隐藏对话框
              this.addRoleDialogVisible = false;
              // 重新获取用户列表数据
              this.getRolesList();
            }
          })
        })
      },
      // 添加角色对话框关闭
      addRoleDialogClosed() {
        this.$refs.addRoleFormRef.resetFields();
      },
      // 展示编辑角色的对话框
      showEditDialog (id) {
        this.$http.get('roles/' + id).then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('查询角色信息失败');
          else {
            this.editRoleForm = res.data;
            this.editRoleDialogVisible = true;
          }
        })
      },
      // 编辑角色对话框关闭
      editRoleDialogClosed() {
        this.$refs.editRoleFormRef.resetFields();
      },
      // 编辑角色
      editRoles() {
        this.$refs.editRoleFormRef.validate(valid => {
          if (!valid) return this.$message.error('请输入正确信息');  // 表单预校验失败
          else this.$http.put('roles/' + this.editRoleForm.roleId,
              this.editRoleForm).then(({data: res}) => {
            if (res.meta.status !== 200) {
              return this.$message.error('更新角色信息失败');
            } else {
              // 隐藏编辑角色对话框
              this.editRoleDialogVisible = false;
              this.$message.success('更新角色信息成功');
              this.getRolesList();
            }
          })
        })
      },
      // 根据Id删除对应的角色信息
      removeRolesById(id) {
        // 弹窗询问用户是否删除数据
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          this.$http.delete('roles/' + id).then(({data: res}) => {
            if (res.meta.status !== 200) return this.$message.error('删除用户失败');
            else {
              this.$message.success('删除用户成功');
              // 重新获取用户列表数据
              this.getRolesList();
            }
          })
        }).catch(err => {
          return this.$message.info('已取消删除');
        })
      },
      // 根据Id删除对应的权限
      removeRightById(role, rightId) {
        // 弹框提示用户是否要删除
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          this.$http.delete(`roles/ ${role.id}/rights/${rightId}`).then(({data: res}) => {
            if (res.meta.status !== 200) return this.$message.error('删除权限失败');
            else {
              this.$message.success('删除权限成功');
              // 重新获取权限列表数据
              role.children = res.data;
            }
          })
        }).catch(err => {
          return this.$message.info('已取消删除');
        })
      },
      // 展示分配权限对话框
      showSetRightDialog(role) {
        this.roleId = role.id;
        // 获取所有的权限数据
        this.$http.get('rights/tree').then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('获取权限数据失败');
          else {
            // 把获取到的权限数据保存到data中
            this.rightsList = res.data;
          }
        })
        // 递归获取三级节点的Id
        this.getLeafKeys(role, this.defKeys);
        this.setRightDialogVisible = true;
      },
      // 通过递归的形式，获取角色下所有三级权限的Id，并保存到defKeys数组中
      getLeafKeys(node, arr) {
        if (!cvnode.children) {
          return arr.push(node.id);
        }
        node.children.forEach(item => {
          this.getLeafKeys(item, arr);
        })
      },
      // 监听分配权限对话框的关闭事件
      setRightDialogClosed() {
        this.defKeys = [];
      },
      // 点击为角色分配权限
      allotRights() {
        const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',');
        this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr}).then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('分配权限失败');
          else {
            this.$message.success('分配权限成功');
            this.getRolesList();
            this.setRightDialogVisible = false;
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .el-tag {
    margin: 7px;
  }

  .el-row {
    display: flex;
    align-items: center;
  }

  .bdtop {
    border-top: 1px solid #eeeeee;
  }

  .bdbottom {
    border-bottom: 1px solid #eeeeee;
  }
</style>