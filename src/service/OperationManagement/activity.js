import HOST_CONFIG from 'hostconfig'
import * as ajax from 'ajax'
import {
    getJSON,
    postJSON,
    putJSON,
    delData
} from '../../utils/ajax'

let host = HOST_CONFIG.nethost
export default {
    //获取列表数据接口
    getTableList(data) {
        const url = `${host}buslove/participantManage/getReviewList`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response)
            }
        )
    },
       //活动列表接口
    getActivityList(data) {
        const url = `${host}operation-activity/activity/getActivityList`;
        return postJSON(url, data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
                return Promise.reject(response.data || response);
            });
    },

};
