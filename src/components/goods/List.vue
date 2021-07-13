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
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="handleCurrentChange(1);getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!--table表格区域-->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="80px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template v-slot:default="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" style="margin: 6px 10px">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!--分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="this.queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "List",
    data() {
      return {
        // 查询参数对象
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        // 商品列表
        goodsList: [],
        // 总数据条数
        total: 0
      }
    },
    created() {
      this.getGoodsList();
    },
    methods: {
      // 根据分页获取对应的商品列表
      getGoodsList() {
        this.$http.get('goods', {params: this.queryInfo}).then(({data: res}) => {
          if(res.meta.status !== 200) return this.$message.error('获取商品列表失败');
          else {
            this.goodsList = res.data.goods;
            this.total = res.data.total;
          }
        })
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
      },
      removeById(id) {
        // 弹窗询问用户是否删除数据
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          this.$http.delete('goods/' + id).then(({data: res}) => {
            if (res.meta.status !== 200) return this.$message.error('删除商品失败');
            else {
              this.$message.success('删除商品成功');
              // 重新获取商品列表数据
              this.getGoodsList();
            }
          })
        }).catch(err => {
          return this.$message.info('已取消删除');
        })
      },
      goAddpage() {
        this.$router.push('/goods/add')
      }
    }
  }
</script>

<style scoped>

</style>