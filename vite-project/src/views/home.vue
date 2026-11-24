<template>
    <div class="home-container">
        <div class="content">
            <div class="text">
                <h2 class="title">
                    一次温暖的对话<br/>
                    <span class="highlight-text">化孤独为慰藉</span>
                </h2>
                <p class="description">每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天</p>
                <div class="hero-actions">
                    <el-button size="large" @click="go('/consultation')">开始倾诉，获得陪伴</el-button>
                    <el-button size="large" style="border-color: #fff" color="transparent" @click="go('/emotion-diary')">记录心情，释放情感</el-button>
                </div>
            </div>
            <div class="robot">
                <el-image style="width: 150px; height: 150px" :src="iconUrl" alt="机器人" class="robot-image" />
            </div>
        </div>
    </div>
</template>
<script setup>
/**
 * 前台首页（落地页）。
 * <p>
 * 纯静态展示，没有任何接口请求 —— 只有一个机器人图标和两个入口按钮
 * （去 AI 对话、去写情绪日记）。页面逻辑全部在模板与样式里。
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 首页两个主入口的跳转。
 * <p>
 * 未登录时先去登录页：这两个页面本身允许游客打开，
 * 但对话、写日记都需要 token，直接进去只会在第一个操作时撞 401，
 * 体验上不如直接把用户引导到登录。
 *
 * @param {string} path 目标路由
 */
const go = (path) => {
    router.push(localStorage.getItem('token') ? path : '/auth/login')
}

/** 首页右侧的机器人插画地址 */
const iconUrl = new URL('@/assets/images/robot-fill.png', import.meta.url).href
</script>
<style scoped lang="scss">
.home-container {
    background: linear-gradient(90deg, rgb(74, 156, 140) 0%, rgb(61, 138, 122) 100%) rgba(74, 156, 140, 0.95);
    color: white;
    padding: 5rem 0;
    height: calc(100vh - 285px);
    display: flex;
    align-items: center;
    justify-content: center;
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 30px;
        .text {
            width: 500px;
            .title {
                font-size: 45px;
                font-weight: bold;
                // line-height: 1.2;
                margin-bottom: 15px;
                .highlight-text {
                    color: #ffd700;
                }
            }
            .hero-actions {
                margin-top: 30px;
            }
        }
        .robot {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 260px;
            height: 260px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.2);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1),inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
    }
}
</style>