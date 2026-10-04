<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"><Fold /></el-icon>
            <ul class="flex-box">
                <li v-for="(item,index) in selectMenu" 
                :key="item.path"
                :class="{selected:route.path === item.path}"
                class="flex-box tab"
                
                >
                <el-icon  size="12"><component :is="item.icon"/></el-icon>
                <router-link class="text flex-box" :to="{ path: item.path}" >
                    {{ item.name }}
                </router-link>
                
                <el-icon class="close" size="12" @click="closeTab(item,index)"><Close /></el-icon>
            </li>
            </ul>
        </div>
        <div class="header-right">
            <el-dropdown @command="handClick">
                <div class="el-dropdown-link flex-box">
                    <el-avatar
                        :src="userInfo.avatar"
                    />
                    <p class="user-name">{{ userInfo.name }}</p>
                </div>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="cancel">退出</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute,useRouter } from 'vue-router'
//拿到store的实例
const store = useStore()
//拿到当前的路由对象
const route = useRoute()
const router = useRouter()
const selectMenu = computed(() => store.state.menu.selectMenu)

//本地缓存可能缺失或被写坏，解析失败时降级为空对象，避免整个顶栏渲染报错
const getUserInfo = () => {
    try {
        return JSON.parse(localStorage.getItem('pz_userInfo')) || {}
    }
    catch {
        return {}
    }
}
const userInfo = getUserInfo()

//点击关闭tag
const closeTab = (item,index) => {
    store.commit('closeMenu',item)
    if(route.path !== item.path){
        return
    }
    const selectMenuData = selectMenu.value
    if(index === selectMenuData.length){
        if(!selectMenuData.length){
            router.push('/')
        }
        else{
            router.push({
                path:selectMenuData[index - 1].path
            })
        }
    }
    else{
        router.push({
            path:selectMenuData[index].path
        })
    }
}

const handClick = (command) => {
    if(command === "cancel"){
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        localStorage.removeItem('pz_v3pz')
        router.push('/login')
    }
}

</script>

<style lang="less" scoped>
.flex-box{
    display: flex;
    align-items: center;
    height: 100%;
}
.header-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;
    .header-left{
        height: 100%;
        .icon{
            width: 45px;
            height: 100%;
        }
        .icon:hover{
            background-color: #e7e7e7;
            cursor: pointer;
        }
        .tab{
            padding: 0 10px;
            height: 100%;
            .text{
                margin: 0 5px;
            }
            .close {
                visibility: hidden;               
            }
            &.selected{
                a{
                    color: #409eff;
                }
                i{
                    color: #409eff;
                }
                background-color: #f5f5f5;
            }
        }
        .tab:hover{
            background-color: #e7e7e7;
            .close{
                visibility: inherit;
                cursor: pointer;
                color: #000; 
            }
            
        }
    }
    .header-right{
        .user-name{
            margin-left: 10px;
        }
    }
    a {
        height: 100%;
        color: #333;
        font-size: 15px;
    }
    

}
</style>