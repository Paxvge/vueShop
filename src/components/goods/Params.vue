<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card>
      <!--警告区域-->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <!--选择商品分类区域-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品的分类：</span>
          <!--选择商品分类的级联选择框-->
          <el-cascader
              v-model="selectedCateKeys"
              :options="cateList"
              :props="cateProps"
              @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!--tab页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="many">
          <!--添加参数的按钮-->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manyTableData" border stripe style="width: 100%">
            <!--展开行-->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!--循环渲染Tag标签-->
                <el-tag v-for="(item, index) in scope.row.attr_vals"
                        :key="index" closable
                        @close="handleClose(index, scope.row)">
                  {{item}}
                </el-tag>
                <!--输入的文本框-->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!--添加的按钮-->
                <el-button type="primary" plain v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--添加静态属性的面板-->
        <el-tab-pane label="静态属性" name="only">
          <!--添加属性的按钮-->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <!--静态属性表格-->
          <el-table :data="onlyTableData" border stripe style="width: 100%">
            <!--展开行-->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!--循环渲染Tag标签-->
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable>{{item}}</el-tag>
                <!--输入的文本框-->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!--添加的按钮-->
                <el-button type="primary" plain v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加参数的对话框-->
    <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
      <!--添加参数的对话框表单-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>

    <!--修改参数的对话框-->
    <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
      <!--修改参数的对话框表单-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Params",
    data() {
      return {
        // 商品分类列表
        cateList: [],
        // 级联选择框的配置对象
        cateProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        // 级联选择框双向绑定到的数组
        selectedCateKeys: [],
        // 被激活的页签名称
        activeName: 'many',
        // 动态参数的数据
        manyTableData: [],
        // 静态参数的数据
        onlyTableData: [],
        // 控制对话框的显示与隐藏
        addDialogVisible: false,
        // 添加参数的表单数据对象
        addForm: {
          attr_name: ''
        },
        // 添加表单的验证规则对象
        addFormRules: {
          attr_name: [
            {
              required: true,
              message: '请输入参数名称',
              trigger: 'blur'
            }
          ]
        },
        // 控制修改对话框的显示与隐藏
        editDialogVisible: false,
        // 修改的表单数据对象
        editForm: {},
        // 修改表单的验证规则对象
        editFormRules: {
          attr_name: [
            {
              required: true,
              message: '请输入参数名称',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    computed: {
      // 按钮是否被禁用
      isBtnDisabled() {
        return this.selectedCateKeys.length !== 3;
      },
      // 当前选中的三级分类Id
      cateId() {
        if (this.selectedCateKeys.length === 3) {
          return this.selectedCateKeys[2];
        }
        return null;
      },
      // 动态计算标题的文本
      titleText() {
        if (this.activeName === 'many') {
          return '动态参数';
        } else return '静态属性';
      }
    },
    created() {
      this.getCateList();
    },
    methods: {
      // 获取所有的商品分类列表
      getCateList() {
        this.$http.get('categories').then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('获取商品分类失败');
          else {
            this.cateList = res.data;
          }
        })
      },
      // 级联选择框选中变化触发的函数
      handleChange() {
        this.getParamsData();
      },
      // tab页签点击事件的处理函数
      handleTabClick() {
        this.getParamsData();
      },
      // 获取参数的列表数据
      getParamsData() {
        if (this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = [];
          this.manyTableData = [];
          this.onlyTableData = [];
        } else {
          // 发起网络请求，获取对应参数
          this.$http.get(`categories/${this.cateId}/attributes`,
              {params: {sel: this.activeName}}).then(({data: res}) => {
            if (res.meta.status !== 200) return this.$message.error('获取参数列表失败');
            else {
              res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                // 控制文本框的显示与隐藏
                item.inputVisible = false;
                // 文本框中输入的值
                item.inputValue = '';
              })
              if (this.activeName === 'many') {
                this.manyTableData = res.data;
              } else {
                this.onlyTableData = res.data;
              }
            }
          })
        }
      },
      // 监听添加对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields(); // 重置修改的表单
      },
      // 点击按钮并添加参数
      addParams() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return this.$message.error('请输入正确信息');
          this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }).then(({data: res}) => {
            if (res.meta.status !== 201) return this.$message.error('添加参数失败');
            else {
              this.$message.success('添加参数成功');
              this.getParamsData();
              this.addDialogVisible = false;
            }
          })
        })
      },
      // 点击按钮展示修改对话框
      showEditDialog(attr_id) {
        // 查询当前参数信息
        this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
          params: {attr_sel: this.activeName}}).then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('获取参数信息失败');
          else {
            this.editForm = res.data;
          }
        })
        this.editDialogVisible = true;
      },
      // 监听修改对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields();  // 重置修改的表单
      },
      // 点击按钮修改参数信息
      editParams() {
        this.$refs.editFormRef.validate(valid => {
          if (!valid) return this.$message.error('请输入正确信息');
          this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }).then(({data: res}) => {
            if (res.meta.status !== 200) return this.$message.error('修改参数失败');
            else {
              this.$message.success('修改参数成功');
              this.getParamsData();
              this.editDialogVisible = false;
            }
          })
        })
      },
      // 根据Id删除对应的参数项
      removeParams(attr_id) {
        // 弹窗询问用户是否删除数据
        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}}`).then(({data: res}) => {
            if (res.meta.status !== 200) return this.$message.error('删除参数失败');
            else {
              this.$message.success('删除参数成功');
              // 重新获取用户列表数据
              this.getParamsData();
            }
          })
        }).catch(err => {
          return this.$message.info('已取消删除');
        })
      },
      // 文本框失去焦点或键入Enter触发此函数
      handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
          row.inputValue = '';
          row.inputVisible = false;
        } else {
          row.attr_vals.push(row.inputValue.trim());
          row.inputValue = '';
          row.inputVisible = false;
          // 发起请求保存新的标签数据
          this.saveAttrVals(row);
        }
      },
      // 将对attr_vals的操作保存到服务器数据库
      saveAttrVals(row) {
        // 发起请求保存新的标签数据
        this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }).then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('修改参数项失败');
          else {
            this.$message.success('修改参数项成功');
          }
        })
      },
      // 点击按钮展示文本输入框
      showInput(row) {
        row.inputVisible = true;
        // 让文本框自动获得焦点,nextTick用于在页面元素渲染后再执行指定代码
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      // 删除对应的参数可选项
      handleClose(index, row) {
        row.attr_vals.splice(index, 1);
        this.saveAttrVals(row);
      }
    }
  }
</script>

<style scoped>
  .cat_opt {
    margin: 15px 0;
  }

  .el-tag {
    margin: 5px 10px;
  }

  .input-new-tag {
    width: 120px;
  }
</style>