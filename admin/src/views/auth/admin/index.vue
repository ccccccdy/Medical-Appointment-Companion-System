<template>
    <panel-head :route="route" />
    <el-table :data="tableData.list" style="width:100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissions_id" label="所属组别">
            <template #default="scope">
                {{ permissionName(scope.row.permissions_id) }}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? '正常' : '失效' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column  label="创建时间">
            <template #default="scope">
                <div class="flex-box">
                    <el-icon><Clock /></el-icon>
                    <span style="margin-left:10px;">{{ scope.row.create_time }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination
            v-model:current-page="paginationData.pageNum"
            :page-size="paginationData.pageSize"
            :background="false"
            size="small"
            layout="total, prev, pager, next, jumper, sizes"
            :total="tableData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            />
    </div>
    <el-dialog
        v-model="dialogFormVisable"
        :before-close="beforeClose"
        title="添加权限"
        width="500px"
    >
        <el-form
                ref="formRef"
                label-width="100px"
                label-position="left"
                :model="form"
                :rules="rules"
        >
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" disabled />
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name"  />
            </el-form-item>
            <el-form-item label="菜单权限" prop="permissions_id">
                <el-select
                    v-model="form.permissions_id"
                    placeholder="请选择菜单权限"
                    style="width: 240px;"
                >
                    <el-option 
                        v-for="item in options" 
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirm(formRef)">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { authAdmin, menuSelectList, updateUser } from '../../../api'
import { reactive,onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'

const route = useRoute()


const paginationData = reactive({
    pageNum:1,
    pageSize:10
})
//列表数据
const tableData = reactive({
    list:[],
    total:0
})

onMounted(() => {
    getListData()
    menuSelectList().then(({ data }) => {
        options.value = data.data
    })
})

//请求列表
const getListData = () => {
    authAdmin(paginationData).then(({data}) => {
        console.log(data,'authAdmin')
        const { list,total } = data.data
        list.forEach(item => {
            item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
        })
        tableData.list = list
        tableData.total = total
    })
}

//分页方法
const handleSizeChange = ( val ) => {
        paginationData.pageSize = val
        getListData()
    }

const handleCurrentChange = ( val ) => {
        paginationData.pageNum = val
        getListData()
    }

//弹窗
const dialogFormVisable = ref(false)
const beforeClose = () => {
    dialogFormVisable.value = false
}

const rules = reactive({
    name:[{ required: true, trigger: 'blur', message: '请填写昵称' }],
    permissions_id:[{ required: true, trigger: 'blur', message: '请选择菜单权限' }]
})

//编辑表单
const formRef = ref()
const form = reactive({
    mobile:'',
    name:'',
    permissions_id:''
})

//表单提交
const confirm = async (formEl) => {
        if(!formEl) return
        await formEl.validate((valid,fields) => {
            if(valid){
                const { name, permissions_id } = form
                // 注意解构出 data：axios 返回的是完整 response，不解构拿不到 code
                updateUser({ name, permissions_id }).then(({ data }) => {
                    if(data.code === 10000){
                        dialogFormVisable.value = false
                        getListData()
                    }
                })
            }
            else{
                console.log('error submit!', fields)
            }
        })
    }

const options = ref([])

//根据权限id匹配权限名称
const permissionName = (id) => {
    const data = options.value.find(el => el.id === id)
    return data ? data.name : '超级管理员'
}
const open = (rowData) => {
    dialogFormVisable.value = true
    Object.assign(form,{ mobile:rowData.mobile, name:rowData.name, permissions_id: rowData.permissions_id})
}
</script>

<style lang="less" scoped>
.flex-box{
    display: flex;
    align-items: center;
}
</style>