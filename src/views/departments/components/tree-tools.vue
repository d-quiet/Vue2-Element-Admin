<template>
    <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
        <el-col>
            <!-- 左侧内容 -->
            <span>{{ treeNode.name }}</span>
        </el-col>
        <el-col :span="4">
            <el-row type="flex" justify="end">
                <el-col>{{ treeNode.manager }}</el-col>
                <el-col>
                    <!-- 放置下拉菜单 -->
                    <el-dropdown @command="operateDepts">
                        <!-- 内容 -->
                        <span>操作
                            <i class="el-icon-arrow-down" />
                        </span>
                        <!-- 具名插槽 -->
                        <el-dropdown-menu slot="dropdown">
                            <!-- 下拉选项 -->
                            <el-dropdown-item command="create">添加子部门</el-dropdown-item>
                            <el-dropdown-item v-if="!isRoot" command="update">编辑部门</el-dropdown-item>
                            <el-dropdown-item v-if="!isRoot" command="delete">删除部门</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
            <!-- 右侧内容 -->
        </el-col>
    </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'

export default {
    // props可以用数组来接收数据 也可以用对象来接收
    // props: {   props属性: {  配置选项 }  }
    props: {
        treeNode: {
            type: Object, // 对象类型
            required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
        },
        isRoot: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        async operateDepts(command) {
            switch (command) {
                case 'create':
                    console.log('新增')
                    this.$emit('addDepts', this.treeNode) // 为何传出treeNode 因为是添加子部门 需要当前部门的数据
                    break
                case 'update':
                    console.log('更新')
                    this.$emit('editDept', this.treeNode)
                    break
                case 'delete':
                    try {
                        await this.$confirm('此操作将永久删除该数，你确定吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                        // 调用接口
                        await delDepartments(this.treeNode.id)
                        // 再次获取数据
                        // 用 $emit 传过去一个函数调用，重新调用一遍数据
                        this.$emit('delDepts')
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                    } catch (error) {
                        console.log(error)
                    }
                    break
            }
        }
    },
}
</script>

<style scoped>

</style>