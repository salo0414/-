<template>
    <!-- 顶部导航栏：左侧折叠按钮 + 页面标题，右侧用户头像下拉菜单 -->
    <div class="navbar">
        <div class="flex-box">
            <el-button @click="handleCollapse">
                <el-icon><Expand /></el-icon>
            </el-button>
            <p class="page-title">{{ route.meta.title }}</p>
        </div>
        <div class="flex-box">
            <!-- @command 在点击下拉项时触发，参数即 item 上的 command 值 -->
            <el-dropdown @command="handleCommand">
                <div class="flex-box">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <p class="user-name">admin</p>
                    <el-icon><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<script setup>
// 图标：Expand 用于侧边栏折叠按钮，ArrowDown 用于用户下拉菜单的箭头
import { Expand, ArrowDown } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { logout } from '@/api/admin'

// 路由实例
const router = useRouter()
const route = useRoute()

// 用户下拉菜单的指令处理：command 为 el-dropdown-item 上绑定的标识
const handleCommand = (command) => {
    console.log(command)
    if (command === 'logout') {
        //处理退出登录逻辑
       ElMessageBox.confirm('确定退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // 确认退出登录后，调用 logout 函数
            logout().then(() => {
                //清除缓存
                localStorage.removeItem('token')
                localStorage.removeItem('userInfo')
                //跳转登录页
                router.push({ path: '/auth/login' })
                ElMessage.success('退出登录成功')
            })
        }).catch(() => {
            ElMessage.info('已取消退出登录')
        })
    }
}

import { useAdminStore } from '@/stores/admin'
// 折叠状态存于 Pinia，点击按钮时取反，侧边栏会同步响应
const adminStore = useAdminStore()
const handleCollapse = () => {
    adminStore.toggleCollapsed()
}

</script>
<style lang="scss" scoped>
.navbar{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;   // 左右两组内容分别贴两边
    padding: 0 15px;
    background: white;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    border-bottom: 1px solid #e5e7eb;
    .flex-box {
        display: flex;
        align-items: center;
        gap: 10px;                    // 图标、文字之间的水平间距
    }
    .page-title {
        font-size: 16px;
        font-weight: bold;
        color: #0a0a0a;
    }
}

</style>
