<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="registerFormRef" size="large" autocomplete="off" v-if="isRegister" :model="registerData"
                :rules="rules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码"
                        v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="onRegister">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="loginFormRef" :rules="rules" :model="form" size="large" autocomplete="off" v-else>
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <!-- <el-checkbox>记住我</el-checkbox> -->
                        <!-- <el-link type="primary" :underline="false">忘记密码？</el-link> -->
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="onLogin">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ElMessage, ElForm, ElFormItem } from 'element-plus';
import { useTokenStore } from '@/store/mytoken'
import { login, register } from "@/api/users.js"
import { useRouter, useRoute } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue';


const router = useRouter()
const route = useRoute()
const tokenStore = useTokenStore()
const loginFormRef = ref(null);
const registerFormRef = ref(null);

const form = ref({
    username: '',
    password: ''
});

//判断显示登录页面还是注册页面
const isRegister = ref(false)
const registerData = ref({
    username: '',
    password: '',
    rePassword: '',
})
//再次输入密码的校验规则
const checkRePassword = (rule, value, callback) => {
    if (value == '') {
        callback(new Error('请再次确认密码'))
    } else if (value !== registerData.value.password) {
        callback(new Error('请再次确认密码'))
    } else {
        callback()
    }
}
//定义表单校验规则
const rules = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16为非空字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16为非空字符', trigger: 'blur' }
    ],
    rePassword: [
        { required: true, validator: checkRePassword, trigger: 'blur' }
    ]
};

function onLogin() {
    loginFormRef.value.validate(async (valid) => {
        if (valid) {
            let result = await login(form.value);
            console.log("result1",result.data.data)
            console.log("result.code1",result.data.code);
            if (result.data.code == 0) {
                tokenStore.saveToken(result.data.data) 
                ElMessage.success("登录成功！");
                router.push(route.query.redirect || '/')
            } else if(result.data.code == 2){
                tokenStore.saveToken(result.data.data) 
                ElMessage.success("登录成功！");
                router.push("/admin")
            }else {
                ElMessage.error('登录信息有误')
                throw new Error("登录信息有误")
            }
        } else {
            ElMessage.error("请检查输入的信息");
            return false;
        }
    })
}

function onRegister() {
    console.log("zhuce")
    registerFormRef.value.validate(async (valid) => {
        if (valid) {
            console.log("registerData", registerData);
            let result = await register(registerData.value);
            console.log("result", result);
            if (result.data.code == 0) {
                ElMessage.success("注册成功！");
                isRegister.value = false;
            } else {
                ElMessage.error('注册失败')
                throw new Error("注册失败")
            }
        } else {
            ElMessage.error("请检查输入的信息");
            return false;
        }
    })
}
</script>




<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background:
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>