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
        const url = `${host}logunburyeventconf/page`
        return getJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    waitBindPrograme(data,productId) {
        let url = ""
        if (productId) {
            url = `${host}logunburyeventconf/waitBindPrograme?ip=${data}&productId=${productId}`
        }else {
            url = `${host}logunburyeventconf/waitBindPrograme?ip=${data}`
        }
        // const url = `${host}logunburyeventconf/waitBindPrograme?ip=${data}&productId=${productId}` // sit 本地
        // const url = `${host}logunburyeventconf/waitBindPrograme?ip=${data}` // sit 本地
        // const url = `${host}logunburyeventconf/waitBindPrograme` // sit 线上
        return getJSON(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    getBindIp(data) {
        const url = `${host}logunburyeventconf/getBindIp?token=${data}`
        return getJSON(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    unburyList(data) {
        const url = `${host}logunburyeventconf/unburyList`
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
        const url = `${host}logunburyeventconf/${data}`
        return getJSON(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    logappconf(data) {
        const url = `${host}logunburyeventconf`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    logcorelinkconf(data) {
        const url = `${host}logcorelinkconf`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    updateBuriedIncident(data) {
        const url = `${host}logunburyeventconf`
        return putJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    getRelaVars() {
        const url = `${host}logunburyeventconf/list`
        return getJSON(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    deleteBuriedIncident( data) {
        const url = `${host}logunburyeventconf/${data}`
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
