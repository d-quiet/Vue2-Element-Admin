<template>
    <!-- 新增部门的弹层 -->
    <el-dialog title="新增部门" :visible="showDialog" @close="btnCancel">
        <!-- 表单组件  el-form   label-width设置label的宽度   -->
        <!-- 匿名插槽 -->
        <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
            <el-form-item label="部门名称" prop="name">
                <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
            </el-form-item>
            <el-form-item label="部门编码" prop="code">
                <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
            </el-form-item>
            <el-form-item label="部门负责人" prop="manager">
                <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
                    <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
                    <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
                </el-select>
            </el-form-item>
            <el-form-item label="部门介绍" prop="introduce">
                <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea"
                    :rows="3" />
            </el-form-item>
        </el-form>
        <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
        <el-row slot="footer" type="flex" justify="center">
            <!-- 列被分为24 -->
            <el-col :span="6">
                <el-button type="primary" size="small" @click="submit">确定</el-button>
                <el-button size="small" @click="btnCancel">取消</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</template>
<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
    // 需要传入一个props变量来控制 显示或者隐藏
    data() {
        // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
        // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
        const checkNameRepeat = async (rule, value, callback) => {
            // 先要获取最新的组织架构数据
            const { depts } = await getDepartments()
            // depts是所有的部门数据
            // 如何去找技术部所有的子节点
            let isRepeat = false
            if (this.formData.id) {
                // 有id就是编辑模式
                // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
                isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.treeNode.pid).some(item => item.name === value)
            } else {
                // 没id就是新增模式
                isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
            }
            isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
        }
        const checkCodeRepeat = async (rule, value, callback) => {
            // 先要获取最新的组织架构数据
            const { depts } = await getDepartments()
            let isRepeat = false
            if (this.formData.id) {
                // 编辑模式  因为编辑模式下 不能算自己
                isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
            } else {
                // 新增模式
                isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
            }
            isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
        }
        return {
            peoples: [], // 接收获取的员工简单列表的数据
            formData: {
                name: '', // 部门名称
                code: '', // 部门编码
                manager: '', // 部门管理者
                introduce: '' // 部门介绍
            },
            treeNode: {
                type: Object,
                default: null
            },
            rules: {
                name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
                { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' }, {
                    validator: checkNameRepeat,
                    trigger: 'blur'
                }],
                code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
                { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }, {
                    validator: checkCodeRepeat,
                    trigger: 'blur'
                }],
                manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
                introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
                { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
            },
        }
    },
    computed: {
        showTitle() {
            return this.formData.id ? '编辑部门' : '新增子部门'
        }
    },
    props: {
        showDialog: {
            type: Boolean,
            default: false
        },
        treeNode: {
            type: Object,
            default: null
        },

    },
    methods: {
        // 获取员工简单列表数据
        async getEmployeeSimple() {
            this.peoples = await getEmployeeSimple()
        },
        submit() {
            this.$refs.deptForm.validate(async isOK => {
                if (isOK) {
                    // 表示可以提交了
                    if (this.formData.id) {
                        await updateDepartments({ ...this.formData })
                    } else {
                        await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id
                    }
                    this.$emit('addDepts')
                    this.$emit('update:show-dialog', false) //触发事件
                }
            })
        },
        btnCancel() {
            this.$refs.deptForm.resetFields() // 重置校验字段
            this.$emit('update:show-dialog', false) //触发事件
            this.formData.id = ''
        },
        async getDepartDetail() {
            const result = await getDepartDetail(this.treeNode.id)
            this.formData = result
        }
    },
}
</script>