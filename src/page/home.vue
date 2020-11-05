<template>
    <div class="wrapper">
        <div>
            <el-row class="tac" v-if="show">
                <el-col :span="4">
                    <el-menu default-active="2" class="el-menu-vertical-demo">
                        <el-submenu  v-for="(item,indx) in menulist" :key="indx" :index="indx +''">
                            <template slot="title"><i class="el-icon-message"></i>{{item.template}}</template>
                            <router-link :to="subitem.linkto"  v-for="(subitem,subindx) in item.menuitem" :key="subindx">
                                    <el-menu-item   :index="indx+'-'+subindx" >
                                        <i class="el-icon-message"></i>{{subitem.name}}
                                    </el-menu-item>
                            </router-link>
                        </el-submenu>
                    </el-menu>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            show: true,
            menulist: [
                { template: '运营平台', menuitem: [
                    // { linkto: '/activityList', name: '活动列表' },
                    { linkto: '/applicationManagement', name: '应用管理'},
                    { linkto: '/buriedIncidentManagement', name: '无埋点事件'},
                    { linkto: '/customEventManagement', name: '自定义事件'},
                    { linkto: '/eventVariableManagement', name: '事件级变量'},
                    { linkto: '/eventAnalysisManagement', name: '事件分析'},
                    { linkto: '/productAnalysisList', name: '产品分析列表'},
                    { linkto: '/channelManagement', name: '渠道管理'},
                    { linkto: '/productAnalysis', name: '产品分析'},
                    { linkto: '/appProductAnalysis', name: '宝鸡app分析详情'},
                    { linkto: '/baojiAppProductAnalysis', name: '宝鸡app分析'},
                    ]
                },
            ]
        };
    },
    created() {
        if (process.env.ENV === 'dev') {
            this.show = true;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}
</style>
