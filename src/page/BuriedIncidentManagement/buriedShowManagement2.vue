<template>
  <div>
    <template>
      <div>
        <el-row class="mr20">
          <el-col :span="24">
            <span class="float-left ml20 mt20" style="font-size:20px;font-family:PingFangSC-Medium,PingFang SC;
font-weight:500;
color:rgba(0,0,0,0.85);
line-height:24px">确认设备</span>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple-dark title">进入小程序准备定义事件 </div></el-col>
    </el-row>
    <el-row>
        <div  class="grid-content bg-purple-dark title-desc" style="margin-top:20px;">
            <div  class="grid-content text-left " >
            <div  class="grid-content bg-purple-dark " >1、用手机扫描下方二维码 </div>
            <div  class="grid-content  ">2、打开小程序/H5，等待5秒左右，可以看到用户显示在页面中。 </div>               
            </div>
            
        </div>
        <!-- <div class="qrCode">
          <img src="https://images.allcitygo.com/20191220170930596w85qkA.jpg" alt="">
        </div>         -->
        <div class="qrcode">
          <div class="qrcode">
            <div id="qrcodeImg"></div>
          </div>
        </div>
        
    </el-row>
      <div style="margin-top:20px">
        <el-table :data="labelDataTable">
          <!-- <el-table-column prop="categoryCode" label="分类编码" min-width="80" align="center"></el-table-column> -->
          <el-table-column prop="ip" label="IP" min-width="80" align="center"></el-table-column>
          <el-table-column prop="devicemodel" label="设备型号" min-width="100" align="center">
          </el-table-column>
          <el-table-column prop="mobileid" label="操作系统" min-width="80" align="center">
              <template slot-scope="scope" style="text-align:center">
              <div style="display:flex;justify-content: center">
                
                <el-main >{{scope.row.mobileid}}-{{scope.row.osversion}}</el-main>
               
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="appVersion"
           
            label="应用版本"
            min-width="80"
            align="center"
          >
          <template slot-scope="scope" style="text-align:center">
              <div style="display:flex;justify-content: center">
                
                <el-main >AliPay {{" "+scope.row.appversion}}</el-main>
               
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="clientid" label="小程序应用ID" min-width="100" align="center"></el-table-column>
          <el-table-column prop="clientname" label="小程序应用名称" min-width="100" align="center"></el-table-column>
          <!-- <el-table-column prop="categoryStatusDesc" label="分类状态" min-width="80" align="center"></el-table-column> -->
          <!-- <el-table-column prop="statusName" label="任务状态" min-width="80" align="center">
          </el-table-column>-->
          <el-table-column prop="operation" label="操作" min-width="80" align="center">
            <template slot-scope="scope" style="text-align:center">
              <div style="display:flex;justify-content: center">
                
                <el-button type="text" @click="labelCheck(scope.$index,scope.row)">点击圈选</el-button>
               
              </div>
            </template>
          </el-table-column>
        </el-table>
        
      </div>
      <div class="title" style="margin-top:40px;">
          <el-button v-if="showRefresh" type="primary" @click="refresh()">刷新</el-button>
      </div>
    </template>
  </div>
</template>
<script>
import httpService from '../../service/BuriedIncidentManagement/httpService.js'
import QRCode from 'qrcodejs2'
import HOST_CONFIG from 'hostconfig'

export default {
  data() {
    return {
      productId:null,
      pageTitle:null,
      searchParams: {},

      labelDataTable: [],

      rules: {},
      token: '',
      ipAddress: '',
      showRefresh: false,
      timeInterVal: ''
    }
  },
  created() {
    // this.getStatus();
    // this.getChannel();
    // this.getTableList()
  },
  beforeDestroy() {
    window.clearInterval(this.timeInterVal)
  },
  mounted() {
    this.productId = this.$route.query.productId || "";
    this.pageTitle = this.$route.query.pageTitle || ""
    this.token = this.getCookie()
    console.log('token====',this.token)
    let url = `${HOST_CONFIG.webtrackHost}getIp?token=${this.token}`
     console.log('url====',url)
    this.createQrcode(url)
    this.timeInterVal = setInterval(() => {
      this.getBindIp()
    }, 5000)
  },
  methods: {
    getCookie() {
      var strCookie = document.cookie
      var arrCookie = strCookie.split('; ')
      var cookieName = 'x-access-token'
      // console.log(arrCookie)
      for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split('=')
        if (cookieName == arr[0]) {
          return arr[1]
        }
      }
    },
    createQrcode(text) {
      // 生成二维码
      const qrcodeImgEl = document.getElementById('qrcodeImg')
      qrcodeImgEl.innerHTML = ''
      let qrcode = new QRCode(qrcodeImgEl, {
        width: 150,
        height: 150,
        colorDark: '#333333',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L
      })
      qrcode.makeCode(text)
    },
    // 获取当前已绑定IP
    getBindIp() {
      httpService.getBindIp(this.token).then(
        response => {
          console.log(response)
          if (+response.code === 200 && response.data) {
            if (this.ipAddress != response.data) {

              this.$message.success(
              '绑定成功'
            );
              
            }
            this.ipAddress = response.data
            this.showRefresh = true
            this.getTableList()
            if (this.timeInterVal) clearInterval(this.timeInterVal)
          }
        },
        response => {
          clearInterval(this.timeInterVal)
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              '请求服务器失败!'
          )
        }
      )
    },
    newAdd() {
      //       this.tableForm = {};
      //   this.drawer = true;
      //   this.limit = false;
      //   this.disable = false;
      //   this.routeName = "addBuriedIncident";
      this.$router.push({
        name: 'buriedShowManagement'
      })
    },
    refresh() {
      this.getBindIp()
      // this.getTableList()
    },
    //点击搜索
    searchClick() {
      // console.debug('搜索点击')
      this.searchParams.page = 1
      this.getTableList()
    },

    // 查看
    labelCheck(index, row) {
      this.$router.push({
        name: 'addBuriedIncident2',
        query: { ip: row.ip, id: row.clientid, deviceModel: row.devicemodel ,productId:this.productId,pageTitle:this.pageTitle}
      })
    },

    // 获取列表
    getTableList() {
      const data = this.ipAddress || '101.68.118.243'
      httpService.waitBindPrograme(data,this.productId).then(
        response => {
          if (+response.code === 200) {
            if (response.data && response.data instanceof Array) {
              const array = response.data
              this.labelDataTable = array
            } else {
              this.labelDataTable = []
            }
          } else {
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                '服务器未返回数据!'
            )
          }
        },
        response => {
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              '请求服务器失败!'
          )
        }
      )
    },
    //参数处理
    handparams(param) {
      const params = JSON.parse(JSON.stringify(param))
      for (const i in params) {
        if (params[i] === '') {
          delete params[i]
        }
      }
      // console.log("data===" + JSON.stringify(params))
      return params
    }
  }
}
</script>
<style lang="scss" scoped>
.foot-page {
  float: right;
  margin-top: 10px;
  margin-bottom: 50px;
}
.select {
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  line-height: 40px;
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 160px;
  margin-right: 20px;
  margin-top: 20px;
}
.title {
  font-size: 20px;
  font-family: Helvetica;
  text-align: center;
}
.title-desc {
  font-size: 14px;
  width: 100%;
  text-align: center;
}

.text-left {
  width: fit-content;
  text-align: left;
  margin: 0 auto;
}
.qrcode {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

