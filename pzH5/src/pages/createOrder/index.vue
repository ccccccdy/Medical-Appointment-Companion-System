<template>
    <div class="container">
        <div class="header">
            <van-icon @click="goBack" name="arrow-left" class="header-left" size="30" />
            填写服务订单
        </div>
        <status-bar item="0" />
        <van-cell class="cell">
            <template #title>
                <van-image
                    width="25"
                    height="25"
                    :src="createInfo.service.serviceImg"
                />
                <span class="server-name">
                    {{ createInfo.service.serviceName }}
                </span>
            </template>
            <template #default>
                <div class="service-text">
                    服务内容
                </div>
            </template>
        </van-cell>
        <van-cell-group class="cell">
            <van-cell >
                <template #title>
                    就诊医院
                </template>
                <template #default>
                    <div @click="showHospital = true">
                        {{ form.hospital_name || '请选择就诊医院' }}
                        <van-icon name="arrow" />
                    </div>
                    
                </template>
            </van-cell>
            <van-cell >
                <template #title>
                    就诊时间
                </template>
                <template #default>
                    <div @click="showStartTime = true">
                        {{ currentDate || '请选择就诊时间' }}
                        <van-icon name="arrow" />
                    </div>
                </template>
            </van-cell>
            <van-cell >
                <template #title>
                    陪诊师
                </template>
                <template #default>
                    <div @click="showComponion = true">
                        {{ companionName || '请选择陪诊师' }}
                        <van-icon name="arrow" />
                    </div>
                </template>
            </van-cell>
            <van-cell >
                <template #title>
                    接送地址
                </template>
                <template #default>
                    <van-field
                        class="text"
                        input-align="right"
                        v-model="form.receiveAddress"
                        placeholder="请填写接送地址"
                    />
                </template>
            </van-cell>
            <van-cell >
                <template #title>
                    联系电话
                </template>
                <template #default>
                    <van-field
                        class="text"
                        input-align="right"
                        v-model="form.tel"
                        placeholder="请填写联系电话"
                    />
                </template>
            </van-cell>
        </van-cell-group>
        <van-cell-group title="服务需求" class="cell">
            <van-field
                class="text"
                style="height: 100px;"
                v-model="form.demand"
                placeholder="请简单描述您要就诊的科室..."
            />   
        </van-cell-group>
        <van-button @click="submit" :loading="submitting" :disabled="submitting" class="submit" type="primary" size="large" >
            提交订单
        </van-button>

        <van-popup
            v-model:show="showHospital"
            position="bottom"
            :style="{ height: '30%' }"
        >
            <van-picker
                title="选择就诊医院"
                :columns="showHospitalColumns"
                @confirm="showHospitalConfirm"
                @cancel="showHospital = false"
            />
        </van-popup>
        <van-popup
            v-model:show="showStartTime"
            position="bottom"
            :style="{ height: '30%' }"
        >
            <van-date-picker
                title="选择日期"
                :min-date="minDate"
                @confirm="showTimeConfirm"
                @cancel="showStartTime = false"
            />
        </van-popup>
        <van-popup
            v-model:show="showComponion"
            position="bottom"
            :style="{ height: '30%' }"
        >
            <van-picker
                title="选择陪诊师"
                :columns="componionColumns"
                @confirm="showComponionConfirm"
                @cancel="showComponion = false"
            />
        </van-popup>
        <!-- 支付二维码弹窗 -->
        <van-dialog v-model:show="showCode" :show-confirm-button="false">
            <van-icon name="cross" class="close" @click="closeCode" />
            <div>微信支付</div>
            <van-image width="150" height="150" :src="codeImg" />
            <div>请使用本人微信扫描二维码</div>
        </van-dialog>
    </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import statusBar from '../../components/statusBar.vue' 
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue'
import Qrcode from 'qrcode'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const createInfo = reactive({
    companion:[],
    hospitals:[],
    service:{}
})

//点击返回
const goBack = () => {
    router.back()
}

//form数据
const form = reactive({

}) 

//就诊医院
const showHospital = ref(false)
const showHospitalColumns = computed(() => {
    return createInfo.hospitals.map(item => {
        return { text:item.name ,value: item.id }
    })
})
//选择医院
const showHospitalConfirm = (item) => {
    form.hospital_id = item.selectedOptions[0].value
    form.hospital_name = item.selectedOptions[0].text
    showHospital.value = false
    // console.log(item)
}

//选择就诊时间
const showStartTime = ref(false)
const currentDate = ref()
//最小日期
const minDate = ref(new Date())
//提交
const showTimeConfirm = (item) => {
    const dateStr = item.selectedValues.join('-')
    currentDate.value = dateStr
    form.starttime = new Date(dateStr).getTime()
    showStartTime.value = false
}

//选择陪诊师
const showComponion = ref(false)
const componionColumns = computed(() => {
    return createInfo.companion.map(item => {
        return { text:item.name ,value: item.id }
    })
})
const companionName = ref()
const showComponionConfirm = (item) => {
    console.log(item)
    companionName.value = item.selectedOptions[0].text
    form.companion_id = item.selectedOptions[0].value
    showComponion.value = false
}
//支付弹窗
const showCode = ref(false)
const codeImg = ref('')
const closeCode = () => {
    showCode.value = false
    router.push('/order')
}

//提交表单
const submitting = ref(false)
const submit = async () => {
    // 防重复提交：请求返回前按钮保持禁用
    if (submitting.value) return
    const params = [
        'hospital_id',
        'hospital_name',
        'demand',
        'companion_id',
        'receiveAddress',
        'tel',
        'starttime'
    ]
    for (const i of params){
        if(!form[i]){
            showNotify({ message: '请把每一项都填写' })
            return
        }
    }
    try {
        submitting.value = true
        const { data:orderRes } = await proxy.$api.createOrder(form)
        // 后端未返回支付链接时给出提示
        const payUrl = orderRes.data && orderRes.data.wx_code
        if(!payUrl){
            showNotify({ message: orderRes.message || '订单创建失败，请稍后重试' })
            return
        }
        codeImg.value = await Qrcode.toDataURL(payUrl)
        showCode.value = true
    } finally {
        submitting.value = false
    }

}
onMounted(async() => {
    const { data } = await proxy.$api.h5Companion()
    Object.assign(createInfo,data.data)
    const urlId = Number(route.query.id)
    if (!urlId || isNaN(urlId)) return
    const targetHospital = data.data.hospitals.find(item => item.id === urlId)
    if (targetHospital) {
        form.hospital_id = targetHospital.id
        form.hospital_name = targetHospital.name
    } else {
        //用户该医院不存在
        showNotify({ message: '该医院不存在或已下线' })
    }
})

</script>
<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
}
.header {
  padding: 10px 0;
  text-align: center;
  line-height: 30px;
  font-size: 15px;
  .header-left {
    float: left;
  }
}

.cell {
  width: 95%;
  margin: 5px auto;
  background-color: #fff;
  ::v-deep(.van-field__control) {
    color: var(--van-cell-value-color);
  }
  ::v-deep(.van-cell__title) {
	display: flex;
	align-items: center;
  }
  .server-name {
	  margin-left: 10px;
  }
}
.service-text {
  background: url(data:image/png;base64,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)
    no-repeat center center;
  background-size: 20px;
}
.submit {
  position: absolute;
  bottom: 0;
}
::v-deep(.van-dialog__content) {
  text-align: center;
  padding: 20px;
  .close {
    position: absolute;
    left: 20px;
  }
}
</style>
