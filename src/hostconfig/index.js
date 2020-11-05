
const apiHost = {};


if (process.env.ENV === 'dev') {
    // apiHost.nethost = 'http://172.31.254.206:8076/';
    apiHost.netImg = 'http://sit-operation.allcitygo.com/';
    apiHost.typeHost = 'http://172.31.254.206:4000/';
    apiHost.nethost = 'http://sit-basic-gw.allcitygo.com/webtrackbm/';
    // apiHost.nethost = 'https://bmapi.allcitygo.com:13002/webtrackbm/';
    apiHost.webtrackHost = 'https://sit-webtrack-api.allcitygo.com/'
}
if (process.env.ENV === 'test') {
    apiHost.nethost = 'http://sit-operation.allcitygo.com:9109/';
}
if (process.env.ENV === 'beta') {
    apiHost.nethost = 'http://sit-operation.allcitygo.com:9109/';
}
if (process.env.ENV === 'v5') {
    apiHost.nethost = 'http://sit-operation.allcitygo.com:9109/';
}
if (process.env.ENV === 'release') {
    apiHost.netImg = 'https://operation.allcitygo.com/';
    apiHost.nethost = 'https://bmapi.allcitygo.com:13002/webtrackbm/';
    apiHost.webtrackHost = 'https://webtrack.allcitygo.com:8088/'
}


export default apiHost;
