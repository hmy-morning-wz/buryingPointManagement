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
        const url = `${host}logeventvariableconf/page`
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
        const url = `${host}logeventvariableconf/${data}`
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
        const url = `${host}logeventvariableconf`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    updateEventVariable(data) {
        const url = `${host}logeventvariableconf`
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
        const url = `${host}logeventvariableconf/${data}`
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
