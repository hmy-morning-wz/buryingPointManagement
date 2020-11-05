import HOST_CONFIG from 'hostconfig';
import * as ajax from 'ajax';
import {
    getJSON,
    postJSON,
    putJSON,
    delData
} from '../../utils/ajax';

let host = HOST_CONFIG.nethost;
export default {
    //获取信息接口
    getDetail(data) {
        const url = `${host}prefer/icons/manage`;
        return postJSON(url, data)
            .then((response) => {
                return Promise.resolve(response.data || response);
            }, (response) => {
                return Promise.reject(response.data || response);
            });
    },
    //下拉框选品库接口
    getFavorites() {
        const url = `${host}prefer/tbk/getFavorites`;
        return postJSON(url)
            .then((response) => {
                return Promise.resolve(response.data || response);
            }, (response) => {
                return Promise.reject(response.data || response);
            });
    },
    //更新信息接口
    updateDetail(data) {
        const url = `${host}prefer/icons/manage/update`;
        return postJSON(url, data)
            .then((response) => {
                return Promise.resolve(response.data || response);
            }, (response) => {
                return Promise.reject(response.data || response);
            });
    },
    //基础功能管理详情接口
    getBaseDetail() {
        const url = `${host}prefer/hzCard/icons`;
        return postJSON(url)
            .then((response) => {
                return Promise.resolve(response.data || response);
            }, (response) => {
                return Promise.reject(response.data || response);
            });
    },
    //基础管理页面更新接口
    upBaseDateDetail(data) {
        const url = `${host}prefer/hzCard/update`;
        return postJSON(url, data)
            .then((response) => {
                return Promise.resolve(response.data || response);
            }, (response) => {
                return Promise.reject(response.data || response);
            });
    },
    //删除二级页面信息接口
    deleteDetail(id) {
        const url = `${host}prefer/secondIcon/delete?secondIconId=${id}`;
        return postJSON(url)
            .then((response) => {
                return Promise.resolve(response.data || response);
            }, (response) => {
                return Promise.reject(response.data || response);
            });
    },
    //获取二级页面数据
    getSecondeInfor(id) {
        const url = `${host}prefer/secondIcon/get?parentIconId=${id}`;
        return postJSON(url)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
                return Promise.reject(response.data || response);
            });
    },
    //资讯增加
    addNotice(data) {
        const url = `${host}prefer/notice/addNotice`;
        return postJSON(url, data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
                return Promise.reject(response);
            });
    },
    //资讯删除
    deleteNotice(id) {
        const url = `${host}prefer/notice/deleteNotice?noticeId=${id}`;
        return postJSON(url)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
                return Promise.reject(response);
            });
    },
    //资讯获取详情
    getNoticeByParam(data) {
        const url = `${host}prefer/notice/getNoticeByParam`;
        return postJSON(url, data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
                return Promise.reject(response);
            });
    },
    //资讯更新
    updateNotice(data) {
        const url = `${host}prefer/notice/addNotice`;
        return postJSON(url, data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
                return Promise.reject(response);
            });
    },
    //增加实时公交和开通路线
    addBus(data) {
        const url = `${host}prefer/icon/addNew`;
        return postJSON(url, data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
                return Promise.reject(response);
            });
    },
    //删除实时公交和开通路线
    deleteBus(id) {
        const url = `${host}prefer/icon/delete?iconId=${id}`;
        return postJSON(url)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
                return Promise.reject(response);
            });
    },
    //获取实时公交和开通路线详情
    getByParamBus(data) {
        const url = `${host}prefer/icon/getByParam`;
        return postJSON(url, data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
                return Promise.reject(response);
            });
    },
     //更新实时公交和开通路线
     updateBus(data) {
        const url = `${host}prefer/icon/update`;
        return postJSON(url, data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
                return Promise.reject(response);
            });
    },

};
