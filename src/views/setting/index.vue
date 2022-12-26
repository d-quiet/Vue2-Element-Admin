<template>
    <div class="dashboard-container">
        <div class="app-container">
            <el-card>
                <el-tabs>
                    <!-- 放置页签 -->
                    <el-tab-pane label="角色管理">
                        <!-- 新增角色按钮 -->
                        <el-row style="height:60px">
                            <el-button icon="el-icon-plus" size="small" type="primary"
                                @click="showDialog = true">新增角色</el-button>
                        </el-row>
                        <!-- 表格 -->
                        <el-table border="" :data="list">
                            <el-table-column label="序号" width="120" type="index" />
                            <el-table-column label="角色名称" prop="name" width="240" />
                            <el-table-column label="描述" prop="description" />
                            <el-table-column label="操作">
                                <template slot-scope="{row}">
                                    <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                                    <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                                    <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- 分页组件 -->
                        <el-row type="flex" justify="center" align="middle" style="height: 60px">
                            <!-- 分页组件 -->
                            <el-pagination :total="page.total" :page-size.sync="page.pagesize"
                                :current-page.sync="page.page" :page-sizes="[2, 5, 10]"
                                layout="total,sizes,prev,pager,next" @current-change="changePage"
                                @size-change="changeSize" />
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="公司信息">
                        <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon
                            :closable="false" />
                        <el-form label-width="120px" style="margin-top:50px">
                            <el-form-item label="公司名称">
                                <el-input v-model="companyInfo.name" disabled style="width:400px" />
                            </el-form-item>
                            <el-form-item label="公司地址">
                                <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
                            </el-form-item>
                            <el-form-item label="邮箱">
                                <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
                            </el-form-item>
                            <el-form-item label="备注">
                                <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled
                                    style="width:400px" />
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                </el-tabs>
            </el-card>
            <!-- 编辑角色弹层 -->
            <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
                <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="roleForm.name" />
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input v-model="roleForm.description" />
                    </el-form-item>
                </el-form>
                <!-- 底部 -->
                <el-row slot="footer" type="flex" justify="center">
                    <el-col :span="6">
                        <el-button size="small" @click="btnCancel">取消</el-button>
                        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
                    </el-col>
                </el-row>
            </el-dialog>
            <!-- 分配权限弹层 -->
            <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
                <!-- 权限是一颗树 -->
                <!-- 将数据绑定到组件上 -->
                <!-- check-strictly 如果为true 那表示父子勾选时,不互相关联 如果为false就互相关联 -->
                <!-- id作为唯一标识 -->
                <el-tree ref="permTree" :data="permData" :props="defaultProps" :show-checkbox="true"
                    :check-strictly="true" :default-expand-all="true" :default-checked-keys="selectCheck"
                    node-key="id" />
                <!-- 确定 取消 -->
                <el-row slot="footer" type="flex" justify="center">
                    <el-col :span="6">
                        <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
                        <el-button size="small" @click="btnPermCancel">取消</el-button>
                    </el-col>
                </el-row>
            </el-dialog>
        </div>
    </div>
</template>
  
<script>
// 1.获取数据
// 2.绑定表格数据
// 3.处理分页
import { getRoleList, getCompanyInfo, delRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { tranListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permission'
export default {
    data() {
        return {
            showPermDialog: false,
            permData: [],
            selectCheck: [],
            roleId: null,
            showDialog: false,
            defaultProps: {
                label: 'name'
            },
            roleForm: {
                name: '',
                description: ''
            },
            rules: {
                name: [{
                    required: true,
                    message: '角色名称不能为空',
                    trigger: 'blur'
                }]
            },
            list: [],
            page: {
                page: 1,
                pagesize: 10,
                total: 0
            },
            companyInfo: {}
        }
    },
    created() {
        this.getRoleList()
        this.getCompanyInfo()
    },
    methods: {
        async getCompanyInfo() {
            this.companyInfo = await getCompanyInfo(this.$store.getters.companyId)
        },
        async getRoleList() {
            const { rows, total } = await getRoleList(this.page)
            this.list = rows
            this.page.total = total
        },
        changePage() {
            this.getRoleList()
        },
        changeSize() {
            this.getRoleList()
        },
        async delRole(id) {
            try {
                // 1.提示是否删除
                await this.$confirm('你确定删除吗？')
                // 2.调删除接口
                await delRole(id)
                // 3.重新渲染数据
                await this.getRoleList()
                // 4.提示删除成功
                this.$message.success('恭喜，删除成功！')
            } catch (error) {
                console.log(error)
            }
        },
        async editRole(id) {
            this.roleForm = await getRoleDetail(id) // 请求详情数据
            this.showDialog = true // 显示弹窗
        },
        async btnOk() {
            try {
                await this.$refs.roleForm.validate()
                if (this.roleForm.id) {
                    await updateRole(this.roleForm)
                } else {
                    await addRole(this.roleForm)
                }
                await this.getRoleList() // 请求列表接口
                this.showDialog = false
                this.$message.success(`${this.roleForm.id ? '编辑' : '新增'}成功啦！！！`)
            } catch (error) {
                console.log(error)
            }
        },
        btnCancel() {
            this.roleForm = {
                name: '',
                description: ''
            }
            // 移除校验
            this.$refs.roleForm.clearValidate()
            this.showDialog = false
        },
        async assignPerm(id) {
            this.permData = tranListToTreeData(await getPermissionList(), '0')
            this.roleId = id
            const { permIds } = await getRoleDetail(id)
            this.selectCheck = permIds
            this.showPermDialog = true
        },
        async btnPermOK() {
            await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
            // console.log(this.$refs.permTree)
            // this.selectCheck = []
            this.$message.success('分配权限成功啦！')
            this.showPermDialog = false
        },
        btnPermCancel() {
            this.selectCheck = [] // 重置数据
            this.showPermDialog = false
        }
    }
}
</script>
  
<style>

</style>