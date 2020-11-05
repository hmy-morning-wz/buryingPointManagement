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
        const url = `${host}logeventdeminconf/page`
        return getJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    getUserType(data) {
        const url = `${host}logeventdeminconf/getEventResultType/${data}`
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
    getEventType(data) {
        const url = `${host}logcustomeventconf/list`
        return getJSON(url,data).then(
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
    getEventConditionByProductId(data) {
        const url = `${host}logeventdeminconf/getEventConditionByProductId?productId=${data}`
        return getJSON(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    logeventdeminconf(data) {
        const url = `${host}logeventdeminconf/`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    updateEventAnalysis(data) {
        const url = `${host}logeventdeminconf`
        return putJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    eventCondtionList(data) {
        const url = `${host}logeventdeminconf/eventCondtionList`
        return getJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    deleteBuriedIncident(data){
        const url = `${host}logeventdeminconf/${data}`
        return delData(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    }

};
