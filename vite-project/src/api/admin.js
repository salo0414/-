import request from '@/assets/utils/request'

// 登录：baseURL 已是 /api，实际请求 http://.../api/user/login
export function login(data) {
    return request.post('/user/login',data)
}


// 分类树：后端使用 GET，POST 会返回业务错误“系统错误”
export function categoryTree() {
    return request.get('/knowledge/category/tree')
}

// 文章分页查询：后端使用 GET，POST 会返回业务错误“系统错误”
export function articlePage(params) {
    return request.get('/knowledge/article/page',{params})
}

// 文件上传：后端字段名是 businessId（小写 d），写成 businessID 会返回“系统错误”
export function uploadFile(file, businessInfo) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('businessType', 'ARTICLE')
    formData.append('businessId', businessInfo.businessId)
    formData.append('businessField', 'cover')
    
    return request.post('/file/upload',formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function createArticle(data) {
    return request.post('/knowledge/article',data)
}

export function getArticleDetail(id) {
    return request.get(`/knowledge/article/${id}`)
}

export function updateArticle(id,data) {
    return request.put(`/knowledge/article/${id}`,data)
}

export function changeArticleStatus(id,data) {
    return request.put(`/knowledge/article/${id}/status`,data)
}

export function deleteArticle(id) {
    return request.delete(`/knowledge/article/${id}`)
}

export function getConsultionPage(params) {
    return request.get('/psychological-chat/sessions',{params})
}

export function getSessionDetail(sessionId) {
    return request.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export function getEmotionalPage(params) {
    return request.get('/emotion-diary/admin/page',{params})
}

export function deleteEmotional(id) {
    return request.delete(`/emotion-diary/admin/${id}`)
}

export function getArticleOverview() {
    return request.get(`/data-analytics/overview`)
}

export function logout() {
    return request.post(`/user/logout`)
}