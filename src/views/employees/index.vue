<template>
    <div class="dashboard-container">
        <div class="app-container">
            <template>
                <div class="dashboard-container">
                    <div class="app-container">
                        <page-tools :show-before="true">
                            <span slot="before">共166条记录</span>
                            <template slot="after">
                                <el-button type="warning" size="small"
                                    @click="$router.push('/import?type=user')">导入</el-button>
                                <el-button size="small" type="danger">导出</el-button>
                                <el-button size="small" type="primary" @click="addDog">新增员工</el-button>
                            </template>
                        </page-tools>
                        <!-- 放置表格和分页 -->
                        <el-card v-loading="loading">
                            <el-table border :data="list">
                                <el-table-column label="序号" sortable="" type="index" />
                                <el-table-column label="姓名" sortable="" prop="username" />
                                <el-table-column label="头像" align="center">
                                    <template slot-scope="{row}">
                                        <img slot="reference" v-imagerror="require('@/assets/common/bigUserHeader.png')"
                                            :src="row.staffPhoto"
                                            style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                                            alt="" @click="showQrCode(row.staffPhoto)">
                                    </template>
                                </el-table-column>
                                <el-table-column label="工号" sortable="" prop="workNumber" />
                                <el-table-column label="聘用形式" sortable="" prop="formOfEmployment"
                                    :formatter="formatEmployment" />
                                <el-table-column label="部门" sortable="" prop="departmentName" />
                                <el-table-column label="入职时间" sortable="" align="center">
                                    <!-- 作用域插槽 -->
                                    <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
                                </el-table-column>
                                <el-table-column label="账户状态" align="center" sortable="" prop="enableState">
                                    <template slot-scope="{ row }">
                                        <!-- 根据当前状态来确定 是否打开开关 -->
                                        <el-switch :value="row.enableState === 1" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" sortable="" fixed="right" width="280">
                                    <template slot-scope="{ row }">
                                        <el-button :disabled="!checkPermission('POINT-USER-UPDATE')" type="text"
                                            size="small"
                                            @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
                                        <el-button type="text" size="small">转正</el-button>
                                        <el-button type="text" size="small">调岗</el-button>
                                        <el-button type="text" size="small">离职</el-button>
                                        <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
                                        <el-button type="text" size="small" @click="delEmp(row.id)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- 分页组件 -->
                            <el-row type="flex" justify="center" align="middle" style="height: 60px">
                                <el-pagination layout="prev, pager, next" :page-size="page.size"
                                    :current-page="page.page" :total="page.total" @current-change="changePage" />
                            </el-row>
                        </el-card>
                        <AddDemployee :showDialog.sync="showDialog"></AddDemployee>
                        <el-dialog title="二维码" :visible.sync="showCodeDialog">
                            <el-row type="flex" justify="center">
                                <canvas ref="myCanvas" />
                            </el-row>
                        </el-dialog>
                        <AssignRole ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
  
<script>
import QrCode from 'qrcode'
import EmployeeEnum from '@/api/constant/employees'
import AddDemployee from './components/add-employee'
import { getEmployeeList, delEmployee } from '@/api/employees'
import AssignRole from './components/assign-role.vue'
import checkP from '@/mixin/checkPermission'
export default {
    mixins: [checkP],
    data() {
        return {
            loading: false,
            list: [], // 接数据的
            page: {
                page: 1, // 当前页码
                size: 10,
                total: 0 // 总数
            },
            showDialog: false,
            showCodeDialog: false,
            showRoleDialog: false,
            userId: null
        }
    },
    components: {
        AddDemployee,
        AssignRole
    },
    created() {
        this.getEmployeeList()
    },
    methods: {
        addDog() {
            this.showDialog = true
        },
        changePage(newPage) {
            this.page.page = newPage
            this.getEmployeeList()
        },
        async getEmployeeList() {
            this.loading = true
            const { total, rows } = await getEmployeeList(this.page)
            this.page.total = total
            this.list = rows
            this.loading = false
        },
        formatEmployment(row, column, cellValue, index) {
            const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
            return obj ? obj.value : "未知";
        },
        async delEmp() {
            try {
                await this.$confirm('您确定删除该员工吗')
                await delEmployee(id)
                this.getEmployeeList()
                this.$message.success('删除员工成功')
            } catch (error) {
                console.log(error)
            }
        },
        showQrCode(url) {
            console.log(1)
            // url存在的情况下 才弹出层
            if (url) {
                this.showCodeDialog = true
                this.$nextTick(() => {
                    QrCode.toCanvas(this.$refs.myCanvas, url)
                })
            } else {
                this.$message.warning('该用户还未上传头像')
            }
        },
        async editRole(id) {    // 弹层
            this.userId = id
            await this.$refs.assignRole.getUserDetailById(id)
            this.showRoleDialog = true
        },
    }
}
</script>
  
<style>

</style>