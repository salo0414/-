<template>
    <div>
        <div class="container">
            <!-- 登录标题 -->
            <div class="title">
                <div class="back-home">
                    <el-icon><Back /></el-icon>
                    <span>返回首页</span>
                </div>
                <div class="title-text">
                    <h2>登录您的账户</h2>
                    <p>请输入您的用户名和密码</p>
                </div>
            </div>
            <!-- 登录表单 -->
            <div class="form-container">
                <!-- 登录表单内容 -->
                <el-form :model="formData" :rules="rules" ref="ruleFormRef" label-width="120px" label-position="top">
                    <el-form-item label="用户名或邮箱" prop="username">
                        <el-input v-model="formData.username" size="large" placeholder="请输入用户名或邮箱" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="formData.password" type="password" size="large" placeholder="请输入密码" show-password />
                    </el-form-item>
                    <!-- 登录表单提交按钮 -->
                    <el-button class="btn" type="primary" size="large" @click="submitForm(ruleFormRef)">登录账户</el-button>
                </el-form>
                <!-- 登录表单底部 -->
                <div class="footer">
                    <p>还没有账户？<router-link to="/auth/register">去注册</router-link></p>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref,reactive } from 'vue'
import { Back } from '@element-plus/icons-vue'
import { login } from '@/api/admin'
import { useRouter } from 'vue-router'

const formData = reactive({
    username: '',
    password: ''
})

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})
const ruleFormRef = ref()

// 登录账户：先校验表单，通过后再提交
const router = useRouter()
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid,fields) => {
        if(valid) {
        console.log(formData,'formData')
        login(formData).then(data => {
            ///判断token是否为存在
            if(!data.token) {
                ///登录成功，跳转到首页
                return console.error('登录失败')
            } 
            //登录成功，保存token和用户信息
            localStorage.setItem('token', data.token)
            localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
            ///根据用户角色跳转到不同的页面
            if(data.userInfo.userType === 2) {
                router.push('/back/dashboard')
            } else {
                router.push('/')
            }
        })
        }
    })
    
}




</script>
<style scoped lang="scss">
// 登录容器
       .container {
        width: 384px;
        // 登录标题
        .title {
            .back-home {
                margin-bottom: 60px;
            }
        }
        // 登录标题文本
        .title-text {
            text-align: center;
            h2{
                font-size: 36px;
                margin-bottom: 10px;
            }
            p{
                font-size: 14px;
                color: #6b7280;
            }
        }
    }
    // 登录表单
    .form-container {
        margin-top: 30px;
        .btn {
            margin-top: 40px;
            width: 100%;
        }
        .footer {
            padding: 30px;
            text-align: center;
        }
    }
</style>
