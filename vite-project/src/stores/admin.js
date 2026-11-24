// ===== 后台全局状态：侧边栏折叠 =====
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 组合式写法定义 store：Navbar 调用 toggleCollapsed，Sidebar 读取 isCollapsed
export const useAdminStore = defineStore('admin',() => {
  // 是否折叠侧边栏，默认展开
  const isCollapsed = ref(false)

  // 切换折叠状态
  const toggleCollapsed = () => {
    isCollapsed.value = !isCollapsed.value
  }
  // 必须返回，外部才能访问到这些状态和方法
  return {
    isCollapsed,
    toggleCollapsed
  }
  })
