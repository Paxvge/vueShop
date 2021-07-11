<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!--表格-->
      <tree-table
          class="treeTable"
          :data="cateList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index border
          index-text="#"
          :show-row-hover="false">
        <!--是否有效-->
        <template v-slot:isok="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!--排序-->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!--操作-->
        <template v-slot:opt="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!--分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querInfo.pagenum"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="querInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

      <!--添加分类的对话框-->
      <el-dialog
          title="添加分类"
          :visible.sync="addCateDialogVisible"
          width="50%" @close="addCateDialogClosed">
        <!--添加分类的表单-->
        <el-form
            ref="addCateFormRef"
            :model="addCateForm"
            label-width="100px"
            :rules="addCateFormRules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!--options用来指定数据源-->
            <el-cascader
                v-model="selectedKeys"
                :options="parentCateList"
                :props="cascaderProps"
                @change="parentCateChanged"
                clearable>
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Cate",
    data() {
      return {
        // 查询条件
        querInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        // 商品分类数据列表，默认为空
        cateList: [],
        // 总数据条数
        total: 0,
        // 为table指定列的定义
        columns: [
          {
          label: '分类名称',
          prop: 'cat_name'
          },
          {
            label: '是否有效',
            type: 'template',
            template: 'isok'
          },
          {
            label: '排序',
            type: 'template',
            template: 'order'
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt'
          }
        ],
        // 控制添加分类对话框的显示与隐藏
        addCateDialogVisible: false,
        // 添加分类的表单数据对象
        addCateForm: {
          // 将要添加的分类名称
          cat_name: '',
          // 父级分类的Id
          cat_pid: 0,
          // 当前分类的等级
          cat_level: 0
        },
        // 添加分类表单的验证规则对象
        addCateFormRules: {
          cat_name: [
            {
              required: true,
              message: '请输入分类名称',
              trigger: 'blur'
            }
          ]
        },
        // 父级分类的列表
        parentCateList: [],
        // 级联选择器的配置对象
        cascaderProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        // 选中的父级分类Id数组
        selectedKeys: []
      }
    },
    created() {
      this.getCateList();
    },
    methods: {
      // 获取商品分类数据
      getCateList() {
        this.$http.get('categories',
            {params: this.querInfo}).then(({data: res}) => {
              if (res.meta.status !== 200) return this.$message.error('获取商品分类失败');
              else {
                // 把请求到的数据赋值给cateList
                this.cateList = res.data.result;
                this.total = res.data.total;
              }
        })
      },
      // 监听pagesize改变
      handleSizeChange(newSize) {
        this.querInfo.pagesize = newSize;
        this.getCateList();
      },
      // 监听pagenum改变
      handleCurrentChange(newPage) {
        this.querInfo.pagenum = newPage;
        this.getCateList();
      },
      // 展示添加分类对话框
      showAddCateDialog() {
        // 先获取父级分类的数据列表
        this.getParentCateList();
        this.addCateDialogVisible = true;
      },
      // 获取父级分类的数据列表
      getParentCateList() {
        this.$http.get('categories', {params: {type: 2}}).then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('获取父级分类失败');
          else {
            this.parentCateList = res.data;
          }
        })
      },
      // 选择项发生变化触发这个函数
      parentCateChanged() {
        if (this.selectedKeys.length > 0) {
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
          this.addCateForm.cat_level = this.selectedKeys.length;
        }else {
          this.addCateForm.cat_pid = 0;
          this.addCateForm.cat_level = 0;
        }
      },
      // 点击按钮，添加新的分类
      addCate() {
        this.$refs.addCateFormRef.validate(valid => {
          if (!valid) return
          this.$http.post('categories', this.addCateForm).then(({data: res}) => {
            if (res.meta.status !== 201) return this.$message.error('添加分类失败');
            else {
              console.log(res.data);
              this.$message.success('添加分类成功');
              this.getCateList();
              this.addCateDialogVisible = false;
            }
          })
        })
      },
      // 监听对话框的关闭事件，重置表单数据
      addCateDialogClosed() {
        this.$refs.addCateFormRef.resetFields();
        this.selectedKeys = [];
        this.addCateForm.cat_level = 0;
        this.addCateForm.cat_pid = 0;
      }
    }
  }
</script>

<style scoped>
  .treeTable {
    margin-top: 15px;
  }

  .el-cascader-menu {
    height: 300px;
  }
</style>