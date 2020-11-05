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
    
    getAllData(data) {
        const url = `${host}logcorelinkeventresult/searchCoreLinkResults`
        return getJSON(url,data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    eventSearchById (data) {
        const url = `${host}logeventdeminconf/eventSearchById`
        return getJSON(url,data).then(
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

    //产品关联事件列表
    getEventDeminConfListOfProduct(data){
        const url = `${host}logeventdeminconf/getEventDeminConfListOfProduct?productId=${data}`
        return getJSON(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    eventDownFile(data) {
        const url = `${host}downFile?key=${data}`
        window.location.href = url
    },

    downFile(data) {
        const url = `${host}logcorelinkeventresult/downFile?key=${data}`
        window.location.href = url
    },

    eventDataExport(data) {
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

    export(data) {
        const url = `${host}logcorelinkeventresult/export`
        return getJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

    // 产品关联的渠道列表
    getChannelsList(data) {
        const url = `${host}logproductindexresult/channelListByProductId`
        return getJSON(url,data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    delLogeventdeminconf(data) {
        const url = `${host}logeventdeminconf/${data}`
        return delData(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    deleteLogcorelinkconf (data) {
        const url = `${host}logcorelinkconf/${data}`
        return delData(url).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    getFunnelData (data) {
        const url = `${host}logcorelinkeventresult/searchCoreLinkFunnelPlotResult`
        return getJSON(url,data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
    getTrendData(data) {
        const url = `${host}logcorelinkeventresult/searchCoreLinkTrendData`
        return getJSON(url,data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },

};
