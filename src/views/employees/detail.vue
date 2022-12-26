<template>
    <div class="dashboard-container">
        <div class="app-container">
            <el-card>
                <el-tabs>
                    <el-tab-pane label="登录账户设置">

                        <!-- 放置表单 -->
                        <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px"
                            style="margin-left: 120px; margin-top:30px">
                            <el-form-item label="姓名:" prop="username">
                                <el-input v-model="userInfo.username" style="width:300px" />
                            </el-form-item>
                            <el-form-item label="密码:" prop="password">
                                <el-input v-model="userInfo.password" style="width:300px" type="password" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="saveUser">更新</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="个人详情">
                        <!-- 放置个人详情 -->
                        <!-- <component :is="userComponent" /> -->
                        <!-- 动态组件component，它通过 `is`属性来绑定需要显示在该位置的组件，is属性可以直接为`注册组件`的组件名称 -->
                        <UserInfo />
                    </el-tab-pane>
                    <el-tab-pane label="岗位详情">
                        <!-- 放置岗位详情 -->
                        <!-- <component :is="JobInfo" /> -->
                        <JobInfo></JobInfo>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>
  
<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
    data() {
        return {
            userId: this.$route.params.id,
            userInfo: {
                username: '',
                password: ''
            },
            rules: {
                username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
                password: [{ required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
            }
        }
    },
    components: {
        UserInfo,
        JobInfo
    },
    created() {
        this.getUserDetailById()
    },
    methods: {
        async getUserDetailById() {
            this.userInfo = await getUserDetailById(this.userId)
            this.userInfo.password = undefined
        },
        async saveUser() {
            try {
                // 先校验
                await this.$refs.userForm.validate()
                // 将新密码替换原密码
                await saveUserDetailById({ ...this.userInfo })
                this.$message.success('保存成功')
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
  
<style>

</style>