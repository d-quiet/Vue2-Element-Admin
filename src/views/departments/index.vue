<template>
    <div class="dashboard-container">
        <div class="app-container">
            <!-- 放置新增弹层组件  -->
            <el-card class="tree-card">
                <!-- 用了一个行列布局 -->
                <TreeTools :tree-node="company" :is-root="true" @addDepts="addDepts"></TreeTools>
                <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
                    <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
                    <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
                    <TreeTools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts"
                        @editDept="editDept">
                    </TreeTools>
                </el-tree>
                <AddDept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
            </el-card>
        </div>
    </div>
</template>
  
<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept' // 引入新增部门组件
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
    components: {
        TreeTools,
        AddDept
    },
    data() {
        return {
            company: {},
            departs: [],
            defaultProps: {
                label: 'name' // 表示 从这个属性显示内容
            },
            showDialog: false, // 显示窗体
            node: null // 记录点击的节点
        }
    },
    created() {
        this.getDepartments() // 调用自身的方法
    },
    methods: {
        async getDepartments() {
            const result = await getDepartments()
            this.company = { name: result.companyName, manager: result.companyName, id: '' }
            this.departs = tranListToTreeData(result.depts, '') // 需要将其转化成树形结构
            console.log(result)
        },
        addDepts(node) {
            this.showDialog = true // 显示弹层
            // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
            this.node = node    // 点击的节点 
        },
        editDept(node) {
            this.showDialog = true
            this.node = node
            // 弹出完要拿数据渲染出来
            // 通过nextTick（）
            console.log(this.$refs.addDept)
            this.$nextTick(() => {
                this.$refs.addDept.getDepartDetail()
            })
        },
    },
}
</script>
  
<style scoped>
.tree-card {
    padding: 30px 140px;
    font-size: 14px;
}
</style>