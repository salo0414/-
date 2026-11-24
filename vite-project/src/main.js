// ===== 应用入口：创建 Vue 实例，注册全局插件后挂载到 #app =====
import { createApp } from 'vue'
import ElementPlus from 'element-plus'          // Element Plus 组件库（全量引入）
import 'element-plus/dist/index.css'            // Element Plus 全局样式
import './style.css'                            // 项目全局重置与公共样式
import App from './App.vue'                     // 根组件
import router from './router'                   // 路由实例
import * as ElementPlusIconsVue from '@element-plus/icons-vue'  // 图标全集
import { createPinia } from 'pinia'             // 状态管理

// 创建 Pinia 实例，用于全局状态管理（如侧边栏折叠状态）
const pinia = createPinia()

const app = createApp(App)

// 遍历所有 Element Plus 图标并全局注册，模板中可直接使用 <PieChart /> 等标签
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 依次挂载 Element Plus、路由、Pinia，然后渲染到 index.html 的 #app 节点
app.use(ElementPlus).use(router).use(pinia).mount('#app')
