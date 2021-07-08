import Vue from 'vue'
// 按需导入
import {Button, Form, FormItem, Input, Message} from 'element-ui'

// 全局注册
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
