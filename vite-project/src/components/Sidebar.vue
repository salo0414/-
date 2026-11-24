<template>
    <!-- 侧边栏宽度随折叠状态切换：展开 264px，折叠 64px（只显示图标） -->
    <el-aside :width="isCollapsed ? '64px' : '264px'">
        <!-- 折叠时隐藏文字、收窄菜单项；关闭折叠动画避免抖动；default-active 用当前路径保证刷新后高亮正确；
             router 开启路由模式后，点击菜单项会自动跳转到 index 指定的路径 -->
        <el-menu 
        :collapse="isCollapsed"
        :collapse-transition="false"
        :default-active="route.path"
        @open="handleOpen"
        @close="handleClose"
        router
        class="menu-style"
      >
        <!-- 品牌区：logo + 系统名称，折叠时只保留 logo -->
        <div class="brand">
            <el-image style="width: 50px; height: 50px;margin-right: 10px;" :src="logoUrl" alt="logo" />
            <div v-if="!isCollapsed" class="info-card">
                <h1 class="brand-title">心理健康AI助手</h1>
                <p class="brand-subtitle">管理后台</p>
            </div>
        </div>
        <!-- 菜单项由路由表自动生成：取 path 为 /back 的路由，遍历其 children 得到四个子页面 -->
        <el-menu-item v-for="item in menuRoutes" :key="item.path" :index="'/back/' + item.path">
          <!-- 根据 meta.icon 字符串从 icons 映射表取出对应图标组件并渲染 -->
          <el-icon><component :is="icons[item.meta.icon]" /></el-icon>
          <span>{{item.meta.title}}</span>      
        </el-menu-item>
        
      </el-menu>
    </el-aside>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
// 菜单用到的四个图标，需要按名称显式导入
import {
  PieChart,
  ChatLineSquare,
  Message,
  User
} from '@element-plus/icons-vue'
import logoUrl from '../assets/images/机器人.png'   // import 方式引入图片，Vite 会自动处理路径与哈希

// 折叠状态存放在 Pinia 中，顶栏按钮修改、侧边栏读取，实现跨组件联动
const adminStore = useAdminStore()
const isCollapsed = computed(() => adminStore.isCollapsed)

// 图标名称 → 组件 的映射表，供模板中 <component :is> 动态渲染
const icons = { PieChart, ChatLineSquare, Message, User }

const router = useRouter()   // 用于读取完整路由表（生成菜单）
const route = useRoute()     // 用于获取当前路径（菜单高亮）

// 按 path 查找 /back 路由再取子路由，避免依赖 routes 数组下标（新增重定向路由后下标会变化）
const menuRoutes = router.options.routes.find(item => item.path === '/back')?.children || []

// 子菜单展开/收起回调，当前无需额外处理
const handleOpen = () => {}
const handleClose = () => {}
</script>
<style lang="scss" scoped>
.menu-style{
    height: 100%;             // 菜单撑满侧边栏高度
    .brand{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    background-color: #f5f7fa;
    .info-card{
        .brand-title{
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #1f2973;
        }
        .brand-subtitle{
            font-size: 14px;
            color: #6b7280;
        }
    }
}
}

</style>
