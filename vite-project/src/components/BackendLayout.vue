<template>
    <div class="backend-layout">
    <!-- 外层容器：左侧侧边栏 + 右侧（顶栏 + 主内容区） -->
    <el-container class="main-container">
      <Sidebar/>
      <!-- 内层容器显式指定纵向排列，否则顶栏和内容区会左右并排 -->
      <el-container direction="vertical">
        <el-header>
          <Navbar/>
        </el-header>
        <el-main class="main-content">
            <!-- 子路由页面（dashboard / knowledge / consultions / emotional）在此渲染 -->
            <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
// 后台框架的两个固定区域：侧边栏、顶部导航栏
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;              // 撑满整个视口，保证侧边栏和内容区铺满屏幕
  .el-header{
    height: 74px !important;  // 覆盖 Element Plus 默认 60px 顶栏高度
  }
  .main-container{
    height: 100%;
    .content-container{
      padding: 20px;                            // 内容区四周留白
      background-color: #fff;                   // 内容卡片白底
      min-height: calc(100% - 74px);            // 减去顶栏高度，保证内容区撑满剩余空间
    }
   }
}
</style>
