<template>
    <el-dialog
        :title="isEdit ? '编辑文章' : '新增文章'"
        v-model="dialogVisible"
        width="50%"
        @close="handleClose"
    >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="文章标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable></el-input> 
        </el-form-item>
        <el-form-item label="文章分类" prop="categoryId">
            <el-select v-model="formData.categoryId" placeholder="请选择文章分类" clearable>
                <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="文章摘要" prop="summary">
            <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000" show-word-limit :rows="4"></el-input> 
        </el-form-item>
        <el-form-item label="文章标签" prop="tags">
            <el-select v-model="formData.tagArray" placeholder="请输入文章标签(可选)" multiple filterable allow-create width="100%">
                <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag"></el-option>
            </el-select> 
        </el-form-item>
        <el-form-item label="封面">
            <div class="cover-upload">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :before-upload="beforeUpload"
                    :http-request="handleUploadRequest"
                    :show-file-list="false"
                    accept="image/*"
                >
                    <div v-if="!imgUrl" class="cover-placeholder">
                        <p>点击上传封面</p>
                    </div>
                    <div v-else class="cover-preview">
                        <img :src="imgUrl" alt="封面图片" class="cover-image">
                        <!-- 移除已上传的封面：阻止冒泡，避免同时触发 el-upload 的选择文件 -->
                    </div>
                </el-upload>
                <div v-if="imgUrl" class="cover-remove">
                        <el-button size="small" type="danger" @click="handleRemove">移除图片</el-button>
                </div>
            </div>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
            <RichTextEditor 
            v-model="formData.content" 
            placeholder="请输入文章内容,支持富文本编辑器"
            :maxCharacters="5000"
            min-height="400px"
            show-word-limit
            @change="handleContentChange"
            @create="handleEditorCreate"
            />
        </el-form-item>
    </el-form>
    <div v-if="btnPreview">
        <h2>文章预览</h2>
        <div v-html="formData.content"></div>
    </div>
    <template #footer>
        <el-button  @click="btnPreview = !btnPreview" >{{btnPreview ? '隐藏预览' : '预览效果'}}</el-button>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit()" :loading="loading">{{isEdit ? '更新' : '创建'}}</el-button>
    </template>
    </el-dialog>
</template>
<script setup>
import { reactive, ref,computed,nextTick,watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile, createArticle,updateArticle } from '@/api/admin'
import { fileBaseUrl } from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'

// 父组件通过 v-model:modelValue 控制弹窗显隐
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categoryList: {
        type: Array,
        default: () => []
    },
    article: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['update:modelValue','success'])

// 弹窗内部 v-model 用的可写计算属性：读取父组件的值，写入时通知父组件更新
const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.article?.id)

const handleClose = () => {
    //重置表单数据
    formRef.value.resetFields()
    //重置ID标识
    businessId.value = null
    //重置标签
    formData.tagArray = []
    // 重置预览图片
    handleRemove()

    emit('update:modelValue', false)
}
// 监听 props.article 变化，更新 formData
watch(() => props.article, (newVal) => {
    if (newVal) {
        nextTick(() => {
            Object.assign(formData, newVal)
            //使用现有ID
            businessId.value = newVal.id
            //封面图片
            imgUrl.value = fileBaseUrl + newVal.coverImage
        })
        
    } else {
        // 切换回新增：清空上一次编辑留下的内容
        resetForm()
    }
})

// 把表单恢复为新增时的初始状态
const resetForm = () => {
    Object.assign(formData, {
        title: '',
        content: '',
        coverImage: '',
        categoryId: 1,
        summary: '',
        tagArray: [],
        tags: '',
        id: ''
    })
    imgUrl.value = ''
    businessId.value = null
    formRef.value?.clearValidate()
}

// 移除已上传的封面：清空预览地址和提交字段
const handleRemove = () => {
    imgUrl.value = ''
    formData.coverImage = ''
}

// 表单数据
const formData = reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 1,
    "summary": "",
    "tagArray": [],
    "tags": "",
    "id": ""
})

// 表单校验规则
const rules = reactive({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择文章分类', trigger: 'change' }
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'blur' },
        { max: 5000, message: '文章内容最多5000字符', trigger: 'blur' }
    ]
})
 
const commonTags = [
'情绪管理', '焦虑', '抑郁', '压力', '睡眠',
'冥想', '正念', '放松', '心理健康', '自我成长',
'人际关系', '工作压力', '学习方法', '生活技巧'
]

const imgUrl = ref('')
// 上传封面前的校验
const beforeUpload = (file) => {
    console.log(file)
    const isImage = file.type.startsWith('image/')
    const isLt5MB = file.size / 1024 / 1024 < 5
    if (!isImage) {
        ElMessage.error('请上传图片文件')
        return false
    }
    if (!isLt5MB) {
        ElMessage.error('图片大小不能超过5MB')
        return false
    }
    return isImage && isLt5MB && true
}


const businessId = ref(null)
// 上传封面：el-upload 的 http-request 收到的是请求配置对象，真实文件在 options.file
const handleUploadRequest = async (options) => {
    // 用 UUID 作为本次上传的业务标识
    businessId.value = crypto.randomUUID()
    try {
        const fileRes = await uploadFile(options.file, { businessId: businessId.value })
        // 预览用完整地址，提交给后端的是相对路径
        // fileBaseUrl 末尾和 filePath 开头都有 /，直接拼接会出现 // 导致 403
        imgUrl.value = fileBaseUrl.replace(/\/$/, '') + '/' + fileRes.filePath.replace(/^\//, '')
        formData.coverImage = fileRes.filePath
        options.onSuccess(fileRes)
        ElMessage.success('封面上传成功')
    } catch (err) {
        options.onError(err)
    }
}

// 文章内容改变时触发
const handleContentChange = (data) => {
    console.log(data,'富文本内容')
    formData.content = data.html
}

// 文章内容创建时触发
const editorInstance = ref(null)
const handleEditorCreate = (editor) => {
    editorInstance.value = editor
    //编辑时，设置内容为已有的内容
    if (formData.content && editor) {
        nextTick(() => {
            editor.setHtml(formData.content)
        })
    }
}

const btnPreview = ref(null)

//提交表单
const formRef = ref()
const loading = ref(false)
const handleSubmit = async () => {
    if (!formRef.value) return
    try {
        await formRef.value.validate()
    } catch {
        // 校验不通过直接返回，不要把不完整的数据提交给后端
        return
    }

    loading.value = true
    const submitData = {
        ...formData,
        // 标签框绑定的是 tagArray，提交时拼成逗号分隔的字符串
        tags: (formData.tagArray || []).join(',')
    }
    delete submitData.tagArray
    delete submitData.id

    if(!isEdit.value){
        //新增
        submitData.id = businessId.value
        createArticle(submitData).then(res => {
            loading.value = false
            emit('success')
        })
    }else{
        //编辑
        updateArticle(props.article.id,submitData).then(res => {
            loading.value = false
            emit('success')
        })
    }
}
</script>

<style lang="scss" scoped>
    .cover-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 120px;
        color: #8b949e;
        background: #f6f8fa;
    }

    // 已上传封面的预览容器：作为移除按钮的定位父级
    .cover-preview {
        position: relative;
        width: 200px;
        height: 120px;
    }

    .cover-image {
        display: block;
        width: 200px;
        height: 120px;
        object-fit: cover;
        border-radius: 4px;
    }

</style>
