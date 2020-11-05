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
        const url = `${host}logchannelconf/page`
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
    // 获取渠道列表
    getChannelsList() {
        const url = `${host}logchannelconf/channelList`
        return getJSON(url).then(
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
        const url = `${host}logchannelconf/${data}`
        return getJSON(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    logchannelconf(data) {
        const url = `${host}logchannelconf`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    updatelogchannelconf(data) {
        const url = `${host}logchannelconf`
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
        const url = `${host}logchannelconf/${data}`
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
