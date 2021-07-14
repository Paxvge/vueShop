<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!--步骤条区域-->
      <el-steps :space="200" :active="parseInt(activeIndex)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--tab栏区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTableLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                  v-model="addForm.goods_cat"
                  :options="cateList"
                  :props="cateProps"
                  @change="handleChange">
              </el-cascader>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--渲染表单的Item项-->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <!--复选框组-->
                <el-checkbox :label="item" v-for="(item, index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <!--复选框组-->
                <el-checkbox :label="item" v-for="(item, index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--action表示图片要上传到的后台API地址-->
            <el-upload
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture-card"
                :headers="headerObj" :on-success="handleSuccess">
              <i slot="default" class="el-icon-plus"></i>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑器组件-->
            <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce"/>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!--图片点击后预览区域-->
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <img width="100%" :src="dialogImageUrl" alt="预览图片">
    </el-dialog>
  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor'
  // import 'quill/dist/quill.core.css'
  // import 'quill/dist/quill.snow.css'
  // import 'quill/dist/quill.bubble.css'

  import _ from 'lodash'

  export default {
    name: "Add",
    components: {
      quillEditor
    },
    data() {
      return {
        activeIndex: '0',
        // 添加商品的表单数据对象
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          // 商品所属的分类数组
          goods_cat: [],
          // 上传图片数组
          pics: [],
          // 商品的详情描述
          goods_introduce: '',
          attrs: []
        },
        // 表单验证规则对象
        addFormRules: {
          goods_name: [
            {
              required: true,
              message: '请输入商品名称',
              trigger: 'blur'
            }
          ],
          goods_price: [
            {
              required: true,
              message: '请输入商品价格',
              trigger: 'blur'
            }
          ],
          goods_weight: [
            {
              required: true,
              message: '请输入商品重量',
              trigger: 'blur'
            }
          ],
          goods_number: [
            {
              required: true,
              message: '请输入商品数量',
              trigger: 'blur'
            }
          ],
          goods_cat: [
            {
              required: true,
              message: '请选中商品分类',
              trigger: 'blur'
            }
          ],
          form: {}
        },
        // 商品分类列表
        cateList: [],
        // 配置对象
        cateProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        // 动态参数列表数据
        manyTableData: [],
        // 静态属性列表数据
        onlyTableData: [],
        // 上传图片的URL地址
        uploadURL: this.$http.defaults.baseURL + 'upload',
        // 图片上传组件的headers请求头对象
        headerObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        dialogImageUrl: '',
        dialogVisible: false,
      }
    },
    computed: {
      cateId() {
        return this.addForm.goods_cat.length === 3 ? this.addForm.goods_cat[2] : null;
      }
    },
    created() {
      this.getCateList();
    },
    methods: {
      // 获取所有商品分类数据
      getCateList() {
        this.$http.get('categories').then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败');
          else {
            // 把请求到的数据赋值给cateList
            this.cateList = res.data;
          }
        })
      },
      // 级联选择器选择项发生变化触发的函数
      handleChange() {
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = [];
        }
      },
      //
      beforeTableLeave(activeName, oldActiveName) {
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error('请选择商品分类');
          return false;
        }
      },
      // 获取商品参数的数据
      getManyDate() {
        this.$http.get(`categories/${this.cateId}/attributes`,
            {params: {sel: 'many'}}).then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败');
          else {
            res.data.forEach(item => {
              item.attr_vals = item.attr_vals === 0 ? [] : item.attr_vals.split(' ');
            })
            this.manyTableData = res.data;
          }
        })
      },
      // 获取商品属性的数据
      getOnlyDate() {
        this.$http.get(`categories/${this.cateId}/attributes`,
            {params: {sel: 'only'}}).then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('获取静态属性列表失败');
          else {
            res.data.forEach(item => {
              item.attr_vals = item.attr_vals === 0 ? [] : item.attr_vals.split(' ');
            })
            this.onlyTableData = res.data;
          }
        })
      },
      tabClicked() {
        if (this.activeIndex === '1') this.getManyDate();
        else if (this.activeIndex === '2') this.getOnlyDate();
      },
      // 处理图片预览效果
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl = file.response.data.url;
      },
      // 处理移除图片的操作
      handleRemove(file) {
        const filePath = file.response.data.tmp_path;
        this.addForm.pics = this.addForm.pics.filter(item => item.pic !== filePath);
      },
      // 监听图片上传成功的时间处理函数
      handleSuccess(response) {
        const picInfo = {pic: response.data.tmp_path};
        this.addForm.pics.push(picInfo);
      },
      // addForm表单预验证
      addFormValidate() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return this.$message.error('请输入必要的表单项');
          this.form = _.cloneDeep(this.addForm)
          this.form.goods_cat = this.form.goods_cat.join(',');

          // 处理动态参数
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.form.attrs.push(newInfo);
          })
          // 处理静态属性
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.form.attrs.push(newInfo);
          })
          console.log(this.form);
        })
      },
      add() {
        this.getManyDate();
        this.getOnlyDate();
        // 防止跳过商品参数或商品属性没点击时，获取不了商品参数或商品属性的数据内容
        window.setTimeout(this.addFormValidate, 500);

        window.setTimeout(() => {
          this.$http.post('goods', this.form).then(({data: res}) => {
            console.log(res.meta.status);
            if (res.meta.status !== 201) return this.$message.error('添加商品失败');
            else {
              this.$message.success('添加商品成功');
              this.$router.push('/goods')
            }
          })
        }, 1000);
      }
    }
  }
</script>

<style scoped>
 .el-checkbox {
   margin: 0 10px 10px 0 !important;
 }

 .el-form-item {
   margin-bottom: 2px;
 }

 .btnAdd {
   margin-top: 15px;
 }

</style>