const activityList = (resolve) => {
    require(['@/page/OperationManagement/activity-mage/activityList.vue'], resolve);
};

const applicationManagement = (resolve) => {
    require(['@/page/ApplicationManagement/applicationManagement.vue'], resolve);
};
const addApplication = (resolve) => {
    require(['@/page/ApplicationManagement/addApplication.vue'], resolve);
};

const buriedIncidentManagement = (resolve) => {
    require(['@/page/BuriedIncidentManagement/buriedIncidentManagement.vue'], resolve);
};
const buriedShowManagement = (resolve) => {
    require(['@/page/BuriedIncidentManagement/buriedShowManagement.vue'], resolve);
};
const buriedShowManagement2 = (resolve) => {
    require(['@/page/BuriedIncidentManagement/buriedShowManagement2.vue'], resolve);
};
const addBuriedIncident = (resolve) => {
    require(['@/page/BuriedIncidentManagement/addBuriedIncident.vue'], resolve);
};

const addBuriedIncident2 = (resolve) => {
    require(['@/page/BuriedIncidentManagement/addBuriedIncident2.vue'], resolve);
};
const customEventManagement = (resolve) => {
    require(['@/page/CustomEventManagement/customEventManagement.vue'], resolve);
};
const addCustomEvent = (resolve) => {
    require(['@/page/CustomEventManagement/addCustomEvent.vue'], resolve);
};
const eventVariableManagement = (resolve) => {
    require(['@/page/EventVariableManagement/eventVariableManagement.vue'], resolve);
};

const addEventVariable = (resolve) => {
    require(['@/page/EventVariableManagement/addEventVariable.vue'], resolve);
};
const pageVariableManagement = (resolve) => {
    require(['@/page/PageVariableManagement/pageVariableManagement.vue'], resolve);
};

const addPageVariable = (resolve) => {
    require(['@/page/PageVariableManagement/addPageVariable.vue'], resolve);
};

const eventAnalysisManagement = (resolve) => {
    require(['@/page/EventAnalysisManagement/eventAnalysisManagement.vue'], resolve);
};

const addEventAnalysis = (resolve) => {
    require(['@/page/EventAnalysisManagement/addEventAnalysis.vue'], resolve);
};
const addEventAnalysis2 = (resolve) => {
    require(['@/page/EventAnalysisManagement/addEventAnalysis2.vue'], resolve);
};

const productAnalysisList = (resolve) => {
    require(['@/page/ProductAnalysis/productAnalysisList.vue'], resolve);
};
const channelManagement = (resolve) => {
    require(['@/page/ChannelManagement/channelManagement.vue'], resolve);
};

const productAnalysis = (resolve) => {
    require(['@/page/ProductAnalysis/productAnalysis.vue'], resolve);
};

const appProductAnalysis = (resolve) => {
    require(['@/page/ProductAnalysis/appProductAnalysis.vue'], resolve);
};

const baojiAppProductAnalysis = (resolve) => {
    require(['@/page/ProductAnalysis/baojiAppProductAnalysis.vue'], resolve);
};

const coreLinkAnalysisDetail= (resolve) => {
    require(['@/page/BuriedIncidentManagement/coreLinkAnalysisDetail.vue'], resolve);
};

export default [{
    path: '/activityList',
    component: activityList,
    meta: ['活动列表'],
},
{
    path: '/applicationManagement',
    component: applicationManagement,
    name: 'applicationManagement',
    meta: ['应用管理']
},
{
    path: '/addApplication',
    component: addApplication,
    name: 'addApplication',
    meta: ['创建应用']
},
{
    path: '/updateApplication',
    component: addApplication,
    name: 'updateApplication',
    meta: ['编辑应用']
},
{
    path: '/checkApplication',
    component: addApplication,
    name: 'checkApplication',
    meta: ['查看应用']
},
{
    path: '/buriedIncidentManagement',
    component: buriedIncidentManagement,
    name: 'buriedIncidentManagement',
    meta: ['无埋点事件']
},
{
    path: '/buriedShowManagement',
    component: buriedShowManagement,
    name: 'buriedShowManagement',
    meta: ['无埋点事件圈选']
},
{
    path: '/buriedShowManagement2',
    component: buriedShowManagement2,
    name: 'buriedShowManagement2',
    meta: ['确认设备']
},
{
    path: '/addBuriedIncident',
    component: addBuriedIncident,
    name: 'addBuriedIncident',
    meta: ['正在圈选']
},
{
    path: '/addBuriedIncident2',
    component: addBuriedIncident2,
    name: 'addBuriedIncident2',
    meta: ['选择路径']
},
{
    path: '/customEventManagement',
    component: customEventManagement,
    name: 'customEventManagement',
    meta: ['自定义事件']
},
{
    path: '/addCustomEvent',
    component: addCustomEvent,
    name: 'addCustomEvent',
    meta: ['添加自定义事件']
},
{
    path: '/updateCustomEvent',
    component: addCustomEvent,
    name: 'updateCustomEvent',
    meta: ['编辑自定义事件']
},
{
    path: '/checkCustomEvent',
    component: addCustomEvent,
    name: 'checkCustomEvent',
    meta: ['查看自定义事件']
},
{
    path: '/eventVariableManagement',
    component: eventVariableManagement,
    name: 'eventVariableManagement',
    meta: ['事件级变量']
},
{
    path: '/addEventVariable',
    component: addEventVariable,
    name: 'addEventVariable',
    meta: ['添加事件级变量']
},
{
    path: '/updateEventVariable',
    component: addEventVariable,
    name: 'updateEventVariable',
    meta: ['编辑事件级变量']
},
{
    path: '/checkEventVariable',
    component: addEventVariable,
    name: 'checkEventVariable',
    meta: ['查看事件级变量']
},
{
    path: '/pageVariableManagement',
    component: pageVariableManagement,
    name: 'pageVariableManagement',
    meta: ['页面级变量']
},
{
    path: '/addPageVariable',
    component: addPageVariable,
    name: 'addPageVariable',
    meta: ['添加页面级变量']
},
{
    path: '/updatePageVariable',
    component: addPageVariable,
    name: 'updatePageVariable',
    meta: ['编辑页面级变量']
},
{
    path: '/checkPageVariable',
    component: addPageVariable,
    name: 'checkPageVariable',
    meta: ['查看页面级变量']
},
{
    path: '/eventAnalysisManagement',
    component: eventAnalysisManagement,
    name: 'eventAnalysisManagement',
    meta: ['事件分析']
},
{
    path: '/addEventAnalysis',
    component: addEventAnalysis,
    name: 'addEventAnalysis',
    meta: ['新建事件分析']
},
{
    path: '/addEventAnalysis2',
    component: addEventAnalysis2,
    name: 'addEventAnalysis2',
    meta: ['新建事件分析']
},
{
    path: '/updateEventAnalysis',
    component: addEventAnalysis,
    name: 'updateEventAnalysis',
    meta: ['编辑事件分析']
},

{
    path: '/updateEventAnalysis2',
    component: addEventAnalysis2,
    name: 'updateEventAnalysis2',
    meta: ['编辑事件分析']
},
{
    path: '/checkEventAnalysis',
    component: addEventAnalysis,
    name: 'checkEventAnalysis',
    meta: ['查看事件分析']
},
{
    path: '/productAnalysisList',
    component: productAnalysisList,
    name: 'productAnalysisList',
    meta: ['产品分析列表']
},
{
    path: '/channelManagement',
    component: channelManagement,
    name: 'channelManagement',
    meta: ['渠道管理列表']
},

{
    path: '/productAnalysis',
    component: productAnalysis,
    name: 'productAnalysis',
    meta: ['产品分析']
},
{
    path: '/appProductAnalysis',
    component: appProductAnalysis,
    name: 'appProductAnalysis',
    meta: ['app产品分析']
},
{
    path: '/baojiAppProductAnalysis',
    component: baojiAppProductAnalysis,
    name: 'baojiAppProductAnalysis',
    meta: ['宝鸡App产品分析']
},
{
    path: '/coreLinkAnalysisDetail',
    component: coreLinkAnalysisDetail,
    name: 'coreLinkAnalysisDetail',
    meta: ['核心链路详情']
},
]
