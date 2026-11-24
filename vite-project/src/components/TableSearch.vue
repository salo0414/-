<template>
    <!-- 通用搜索栏：根据 formItem 配置动态渲染输入框/下拉框，并附带搜索、重置按钮 -->
    <el-form ref="ruleFromRef" :model="formData" inline class="table-search">
        <el-row>
            <el-col v-for="item in formItemAttrs" :key="item.prop" v-bind="item.col">
                <el-form-item :label="item.label" :prop="item.prop">
            <!-- 动态组件：comp 为 input 渲染 ElInput，为 select 渲染 ElSelect -->
                    <component :is="compMap[item.comp]" v-model="formData[item.prop]" :placeholder="item.placeholder" clearable>
                <!-- 只有下拉框才需要渲染选项 -->
                        <template v-if="item.comp === 'select'">
                    <!-- 下拉框选项：根据配置渲染 -->
                        <el-option label="全部" value=""/>
                        <el-option v-for="opt in item.options || []" :key="opt.value" :label="opt.label"
                            :value="opt.value" />
                        </template>
                    </component>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleReset(ruleFromRef)">重置</el-button>
            </el-form-item>
        </el-row>
    </el-form>
</template>
<script setup>
import { reactive, computed,ref } from 'vue'
import { ElInput, ElSelect } from 'element-plus'

// formItem：搜索项配置数组，结构为 { comp, prop, label, placeholder, options }
const props = defineProps({
    formItem: {
        type: Array,
        default: () => []
    }
})

// 向父组件派发 search 事件，携带当前填写好的查询条件
const emit = defineEmits(['search'])

// 控件类型 → 组件 的映射，供 <component :is> 使用
const compMap = {
    input: ElInput,
    select: ElSelect
}

// 表单数据：以 prop 为 key 存放各控件的值，reactive 保证双向绑定生效
const formData = reactive({})

// 计算属性：为每个表单项补上响应式栅格配置（不同屏幕宽度下的列占比）
// 用 map 返回新数组，不能直接改 props 里的对象
const formItemAttrs = computed(() => {
    return props.formItem.map((item) => ({
        ...item,
        col: { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
    }))
})

// 表单实例引用：用于校验表单数据
const ruleFromRef = ref()

// 点击搜索：把表单数据浅拷贝后交给父组件（拷贝避免父组件直接改动内部状态）
const handleSearch = () => {
    console.log(formData)
    emit('search', { ...formData })
}

// 点击重置：清空所有字段，并按空条件重新查询
const handleReset = (fromEL) => {
    //先重置表单数据，再触发查询事件
    if(!fromEL) return
    fromEL.resetFields()
    emit('search', { ...formData })
}
</script>
<style lang="scss" scoped>
// 用 el-row 分组排版：查询条件一行、操作按钮一行
.table-search {
    // 表单容器不能用 flex，否则多个 el-row 会并排显示而不是各占一行
    :deep(.el-row) {
        width: 100%;
    }

    :deep(.el-form-item) {
        margin: 0 16px 12px 0;   // 统一项间距
    }

    // 固定输入框/下拉框宽度，保证长文案也能完整显示
    :deep(.el-input),
    :deep(.el-select) {
        width: 200px;
    }
}
</style>
