<template>
    <div>
        <!-- 页头：左侧标题，右侧通过 button 插槽注入操作按钮 -->
        <PageHead title="知识文章">
            <template #button>
                <el-button type="primary" size="small" @click="handleEdit({})">新增</el-button>
            </template>
        </PageHead>
        <!-- 搜索栏：formItem 描述需要渲染哪些查询项，搜索时通过 search 事件回传查询条件 -->
        <TableSearch :form-item="formItem" @search="handleSearch"></TableSearch>
        <!-- 表格：展示查询结果 -->
        <el-table :data="tableData" style="width: 100%; margin-top: 25px;">
            <el-table-column width="450" label="文章标题" fixed="left">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-icon><timer /></el-icon>
                        <span>{{ scope.row.title }}</span>
                    </div>
                </template>
            </el-table-column>
             <el-table-column label="文章分类" width="200">
                <template #default="scope">
                    <div style="display: flex; align-items: center;">
                        <el-icon><Timer /></el-icon>
                        <span>{{ categoryMap[scope.row.categoryId] }}</span>
                    </div>
                </template>
            </el-table-column>
             <el-table-column prop="authorName" label="作者" width="150"></el-table-column>
             <el-table-column prop="readCount" label="阅读量" width="150"></el-table-column>    
             <el-table-column prop="updatedAt" label="发布时间" width="150"></el-table-column>
             <el-table-column label="操作" width="240" fixed="right">
                <template #default="scope">
                    <el-button text type="primary" size="small" @click="handleEdit(scope.row)" >编辑</el-button>
                    <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0 || scope.row.status === 2" text type="success" >发布</el-button>
                    <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status === 1" text type="warning" >下线</el-button>
                    <el-button @click="handleDelete(scope.row)"  text type="danger" >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination 
            style="margin-top: 25px;"
            :page-size="pagination.size"  
            layout="prev,pager,next" 
            :total="pagination.total"
            @change="handleChange"
        ></el-pagination>
        <!-- 新增文章弹窗 -->
        <ArticleDialog v-model:modelValue="dialogVisible" :article="currentArticle" :categoryList="categoryList" @success="handleSucces"></ArticleDialog>
    </div>
</template>
<script setup>
import { onMounted,reactive } from 'vue'
import { ref } from 'vue'
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { categoryTree,articlePage,getArticleDetail,deleteArticle } from '@/api/admin'
import { Timer } from '@element-plus/icons-vue'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { ElMessageBox,ElMessage } from 'element-plus'
import { changeArticleStatus } from '@/api/admin'



// 搜索表单的字段配置：comp 决定控件类型，prop 是字段名，options 供下拉框渲染
const formItem = reactive([
    {
        comp: 'input',
        prop: 'title',
        label: '文章标题',
        placeholder: '请输入文章标题'
    },
    {
        comp: 'select',
        prop: 'category',
        label: '文章分类',
        placeholder: '请选择文章分类',
       
    },
    {
        comp: 'select',
        prop: 'status',
        label: '状态',
        placeholder: '请选择状态',
        options: [
            {
                label: '草稿',
                value: 0
            },
            {
                label: '已发布',
                value: 1
            },
            {
                label: '已下架',
                value: 2
            }
        ]
    }
])

// 分页改变时触发
const handleChange = (page) => {
    pagination.currentPage = page
    handleSearch()
}



// 当前查询条件，后续分页/请求接口时从这里取值
const queryParams = ref({})

//分页参数
const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})

// 接收搜索栏回传的条件并保存（后续在此处调用列表接口）
const handleSearch = async (formData) => {
    console.log(formData,'查询参数')

    const params = {
        ...formData,
        ...pagination
    }
    const { records,total} = await articlePage(params)
    tableData.value = records
    pagination.total = total
    
}
// 分类映射表：key 是分类 ID，value 是分类名称
const categoryMap = reactive({})
//分类列表
const categoryList = ref([])

// 表格数据
const tableData = ref([])
// 新增和编辑
const dialogVisible = ref(false)
// 新增/编辑成功后：关闭弹窗并重新查询列表（回到第一页，新建文章按时间排在最前）
const handleSucces = () => {
    dialogVisible.value = false
    pagination.currentPage = 1
    handleSearch({})
}
const currentArticle = ref(null)
// 编辑文章
const handleEdit = (row) => {
    if (!row.id) {
        // 新增文章：先清空当前编辑的文章，否则弹窗会沿用上一次的编辑状态
        currentArticle.value = null
        dialogVisible.value = true
    }else{
        getArticleDetail(row.id).then(res => {
        console.log(res,'文章详情')
        // 编辑文章时，将文章详情赋值给 currentArticle
        currentArticle.value = res
        // 打开弹窗
        dialogVisible.value = true
    })
    } 
}

// 发布文章
const handlePublish = (row) => {
    ElMessageBox.confirm('确认发布文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
    }).then(() => {
        changeArticleStatus(row.id,{status:1}).then(res => {
            ElMessage.success('发布成功')
            // 发布成功后，刷新列表
            handleSearch({})
        })
    })
        
}

// 下线文章
const handleUnpublish = (row) => {
    ElMessageBox.confirm('确认下线文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        changeArticleStatus(row.id,{status:2}).then(res => {
            ElMessage.success('下架成功')
            // 下架成功后，刷新列表
            handleSearch({})
        })
    })
        
}
// 删除文章
const handleDelete = (row) => {
    ElMessageBox.confirm('确认删除文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
    }).then(() => {
        deleteArticle(row.id).then(res => {
            ElMessage.success('删除成功')
            // 删除成功后，刷新列表
            handleSearch({})
        })
    })
        
}



// 组件挂载时获取分类树
onMounted( async () => {
    try {
        const data = await categoryTree()
        // 将接口分类转换为 el-option 需要的 label/value，并保存结果
        categoryList.value = data.map(item => {
            categoryMap[item.id] = item.categoryName
            return {
                label: item.categoryName,
                value: item.id
            }
        })
        console.log(categoryList.value)
        formItem[1].options = categoryList.value
    } catch (err) {
        // 分类加载失败不应阻塞文章列表，否则页面会整体空掉
        console.error('分类加载失败', err)
    }

    //获取文章分页查询结果
    handleSearch({})
})

</script>
