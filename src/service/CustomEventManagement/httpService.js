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
        const url = `${host}logcustomeventconf/page`
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
        const url = `${host}logcustomeventconf/${data}`
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
        const url = `${host}logcustomeventconf`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    updateCustomEvent(data) {
        const url = `${host}logcustomeventconf`
        return putJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    deleteCustomEvent(data) {
        const url = `${host}logcustomeventconf/${data}`
        return delData(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    getRelaVars() {
        const url = `${host}logeventvariableconf/list`
        return getJSON(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
   

};
