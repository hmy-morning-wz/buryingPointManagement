import HOST_CONFIG from 'hostconfig'
import * as ajax from 'ajax'
import {
    getJSON,
    postJSON,
    putJSON,
    delData
} from '../../utils/ajax'
import { get } from 'http';

let host = HOST_CONFIG.nethost

export default {
    //获取列表数据接口
    getTableList(data) {
        const url = `${host}logproductconf/page`
        return getJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    // 获取应用列表
    getAppList() {
        const url = `${host}logappconf/appList`
        return getJSON(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    downFile(data) {
        const url = `${host}logproductindexresult/downFile?key=${data}`
        window.location.href = url
    },

    export(data) {
        const url = `${host}logproductindexresult/export`
        return getJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    downTable(data) {
        const url = `${host}eventDataExport`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    downLoadExcel(data){
        const url = `${host}downFile?key=${data}`
        window.location.href = url
    },

    // 产品关联的渠道列表
    getChannelsList(data) {
        const url = `${host}logproductindexresult/channelListByProductId?productId=${data}`
        return getJSON(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    // 产品分析页多指标环比查询
    indexListInfo(data) {
        const url = `${host}logproductindexresult/indexListInfo`
        return getJSON(url,data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    // 产品实时尾部请求

    getTopPageData(data) {
        const url = `${host}logproductindexresult/searchTopPageData`
        return getJSON(url,data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    getAllData(data) {
        const url = `${host}logproductindexresult/searchProductData`
        return getJSON(url,data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    // 实时数据上部
    getRealTimeTopData (data) {
        const url = `${host}logproductindexresult/searchOnlineSearchTop`
        return getJSON(url,data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    // 实时数据中间
    getRealTimeData(data){
        const url = `${host}logproductindexresult/searchOnlineSearchSecond`
        return getJSON(url,data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    getEventDetails(data) {
        const url = `${host}logeventdeminconf/${data}`
        return getJSON(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    getDimenList(data) {
        const url = `${host}logeventdeminconf/eventDimenList/${data}`
        return getJSON(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    eventSearch(data) {
        const url = `${host}logeventdeminconf/eventSearch`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    eventSearchById(data) {
        const url = `${host}logeventdeminconf/eventSearchById`
        return getJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    userSaveAnalysis(data) {
        const url = `${host}logproductindexresult/userSaveAnalysis`
        return getJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    // 获取详情
    getDetails(data) {
        const url = `${host}logproductconf/${data}`
        return getJSON(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    logproductconf(data) {
        const url = `${host}logproductconf`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    updateLogproductconf(data) {
        const url = `${host}logproductconf`
        return putJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    deleteEventVariable(data) {
        const url = `${host}logproductconf/${data}`
        return delData(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
   

};
