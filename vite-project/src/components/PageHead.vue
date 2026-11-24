<template>
    <!-- 通用页头：左侧标题，右侧按钮插槽 -->
    <div class="page-head">
        <h2 class="page-title">{{props.title}}</h2>
        <div class="action -btn">
            <slot name="button"></slot>
        </div>
    </div>
</template>
<script setup>
// 接收父组件传入的页面标题，未传时显示默认值
const props = defineProps({
    title: {
        type: String,
        default: '页面标题'
    }
})
</script>
<style lang="scss" scoped>
.page-head{
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;   // 标题与操作按钮分列两端
    align-items: center;
    .page-title{
        font-size: 24px;
        color: #2d3748;
    }
}
</style>
