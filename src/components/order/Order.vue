<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--订单列表数据-->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" min-width="90px">
          <template v-slot:default="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" pro p="is_send">
          <template v-slot:default="scope">
            {{scope.row.is_send}}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time" min-width="140px">
          <template v-slot:default="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120px">
          <template v-slot:default="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background>
      </el-pagination>

      <!--修改地址对话框-->
      <el-dialog
          title="修改地址"
          :visible.sync="addressVisible"
          width="50%" @close="addressDialogClosed">
        <el-form ref="addressFormRef" :model="addressForm" label-width="100px" :rules="addressFormRules">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!--展示物流进度的对话框-->
      <el-dialog title="物理进度" :visible.sync="progressVisible" width="50%">
        <el-timeline :reverse="reverse">
          <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp">
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
  import cityData from "@/assets/js/citydata";

  export default {
    name: "Order",
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5,
        },
        total: 0,
        orderList: [],
        addressVisible: false,
        addressForm: {
          address1: [],
          address2: ''
        },
        addressFormRules: {
          address1: [
            {
              required: true,
              message: '请选择省市区/县',
              trigger: 'blur'
            }
          ],
          address2: [
            {
              required: true,
              message: '请填写详细地址',
              trigger: 'blur'
            }
          ]
        },
        // cityData: cityData简写
        cityData,
        progressVisible: false,
        progressInfo: [],
        reverse: false,
        activities: [{
          content: '快件正在派送中...',
          timestamp: '2018-04-15'
        },{
          content: '快件正在运输中...',
          timestamp: '2018-04-14'
        }, {
          content: '快件正准备出库',
          timestamp: '2018-04-13'
        }, {
          content: '订单已提交',
          timestamp: '2018-04-11'
        }]
      }
    },
    created() {
      this.getOrderList();
    },
    methods: {
      // 获取订单详情数据
      getOrderList() {
        this.$http.get('orders', {params: this.queryInfo}).then(({data: res}) => {
          if(res.meta.status !== 200) return this.$message.error('获取订单列表失败');
          else {
            this.total = res.data.total;
            this.orderList = res.data.goods;
          }
        })
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getOrderList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getOrderList();
      },
      // 展示修改地址对话框
      showBox() {
        this.addressVisible = true;
      },
      addressDialogClosed() {
        this.$refs.addressFormRef.resetFields();
      },
      showProgressBox() {
        // this.$http.get('/kuaidi/1106975712662').then(({data: res}) => {
        //   if(res.meta.status !== 200) return this.$message.error('获取物流进度失败');
        //   else {
        //     this.progressInfo = res.data;
        //   }
        // })

        this.progressVisible = true;

      }
    }
  }
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }
</style>