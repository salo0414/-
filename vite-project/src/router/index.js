// ===== 路由配置：后台布局 + 四个子页面 =====
import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'   // 后台整体框架（侧边栏 + 顶栏 + 内容区）
import AuthLayout from '@/components/AuthLayout.vue'         // 登录/注册页框架（左品牌区 + 右表单区）
import FrontendLayout from '@/components/FrontendLayout.vue' // 前台整体框架

//后台路由配置
const backendRoutes = [
    {
        // 后台根路径，使用 BackendLayout 作为外层容器，子页面渲染到它内部的 <router-view>
        path: '/back',
        component: BackendLayout,
        // 访问 /back 时默认跳转到数据看板，避免出现空白页
        redirect: '/back/dashboard',
        children: [
            {
                // 完整路径为 /back/dashboard，懒加载（仅在访问时下载对应 chunk）
                path: 'dashboard',
                component: () => import('@/views/dashboard.vue'),
                // meta 供侧边栏菜单读取：title 为菜单文字，icon 为图标组件名
                meta: {
                    title: '数据分析',
                    icon: 'PieChart'
                }
            },
            {
                // 知识文章管理页，完整路径 /back/knowledge
                path: 'knowledge',
                component: () => import('@/views/knowledge.vue'),
                meta: {
                    title: '知识文章',
                    icon: 'ChatLineSquare'
                }
            },
            {
                // 咨询记录页，完整路径 /back/consultions
                path: 'consultions',
                component: () => import('@/views/consultions.vue'),
                meta: {
                    title: '咨询记录',
                    icon: 'Message'
                }
            },
            {
                // 情绪日志页，完整路径 /back/emotional
                path: 'emotional',
                component: () => import('@/views/emotional.vue'),
                meta: {
                    title: '情绪日志',
                    icon: 'User'
                }
            }
        ]
    },
    {
        path: '/auth',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                component: () => import('@/views/login.vue'),
                meta: {
                    title: '登录'
                }
            },
            {
                path: 'register',
                component: () => import('@/views/register.vue'),
                meta: {
                    title: '注册'
                }
            }
        ]
    }
]
//前台路由配置
const frontendRoutes = [
    {
        path: '/',
        component: FrontendLayout,
        // 前台页面还没有建，先不配置子路由
        children: [
            {
                // 空 path 表示这是默认首页
                path: '',
                component: () => import('@/views/home.vue')
            },
            {
                path: 'consultation',
                component: () => import('@/views/consultation.vue')
            },
            {
                path: 'emotion-diary',
                component: () => import('@/views/emotionDiary.vue')
            },
            {
                path: 'knowledge',
                component: () => import('@/views/frontendKnowledge.vue')
            },
            {
                // 动态段 :id 是文章 UUID，配合 props: true 直接注入组件 props
                path: 'knowledge/article/:id',
                component: () => import('@/views/articleDetail.vue'),
                props: true
            }
        ]
    }
]

// 使用 HTML5 History 模式（URL 无 # 号，需要服务端配置 fallback 才能刷新不 404）
const router = createRouter({
    history: createWebHistory(),
    routes: [...backendRoutes, ...frontendRoutes]
})

//路由守卫：在每次路由切换前执行
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    // 当前用户是否登录：有 token 才继续判断角色
    if (token) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        // 如果是后台用户（管理员）
        if (userInfo.userType == 2) {
            if (to.path.startsWith('/back')) {
                next()
            } else {
                // 管理员访问前台页面时统一拉回后台看板
                next('/back/dashboard')
            }
        } else if (userInfo.userType == 1) {
            // 用户端账号只能访问前台路由
            if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
                next('/')
            } else {
                next()
            }
        }
    } else {
        // 未登录：只拦后台，前台页面允许游客浏览
        if (to.path.startsWith('/back')) {
            // 如果是访问后台页面，那么跳转到登录页
            next('/auth/login')
        } else {
            next()
        }
    }
})

export default router
