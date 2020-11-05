<template>
  <div class="contain_bg">
    <template>
      <el-row class="route_content">
        <el-col :span="24">
          <span class="float-left page_title">选择路径</span>
          <a-button
            style="margin-right: 30px;float:right;margin-top:10px;margin-bottom:11px;"
            type="primary"
            @click="routerComplete()"
          >完成</a-button>
        </el-col>


        <el-drawer
          title="添加名称"
          :visible.sync="routerDrawer"
          :direction="direction"
          size="40%"
          
          :wrapperClosable="true"
        >
          <template>
            <div style="overflow-x:scroll;height:100%;">
              <el-scrollbar style="height:100%;">
                <template>
                  <div style=" display:flex; margin-top:10px; ">
                    <el-form
                      style="margin:auto;"
                      ref="routerForm"
                      label-width="120px"
                      :model="routerForm"
                      :rules="rules"
                    >
                      <el-form-item label="核心链路名称：" prop="coreName">
                        <el-input
                          
                          placeholder="事件名称"
                          v-model="routerForm.coreName"
                          class="w240 mr20"
                        ></el-input>
                      </el-form-item>
                      
                      <el-form-item label="描述：" prop="coreDesc">
                        <el-input
                          :disabled="disable"
                          placeholder="描述"
                          type="textarea"
                          v-model="routerForm.coreDesc"
                          class="w360 mr20"
                        ></el-input>
                      </el-form-item>

                      <el-form-item v-if="!disable || !limit">
                        <el-button type="primary" @click="submitForm('routerForm')" class="mt20">提交</el-button>
                        <el-button @click="routerDrawerCancel()">取消</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </template>
              </el-scrollbar>
            </div>
          </template>
        </el-drawer>

        <el-col :span="24">
          <div style="width:100%;height:1px;background:rgba(233,233,233,1);"></div>
        </el-col>
        <el-col v-if="!hasChosedRoute" :span="24">
          <span class="no_select">暂未选择</span>
        </el-col>
        <el-col v-else :span="24">
          <el-row>
            <el-scrollbar style="width:100%;height:186px;padding-right:30px;">
              <el-col class="flex"  :span="24" v-for="(item,index) in stepsOptions" :key="index">
                <div class="circle_step"></div>
                <div class="step_num">第{{index+1}}步</div>
                <div class="step_desc">{{item.eventName}}</div>
                <div style="margin-right: 160px; margin-left:auto; margin-top:8px;">
                    <el-button  type="text" @click="delRouter(item,index)">删除</el-button>
                </div>
                 
              </el-col>
            </el-scrollbar>
          </el-row>
        </el-col>
      </el-row>
      <div class="event_list_content">
        <div>
          <el-row class="mr20">
            <el-col :span="24">
              <span class="float-left ml20 mt20">事件列表</span>
            </el-col>
          </el-row>
        </div>

        <div style="margin:20px">
          <div v-for="(item,index) in labelDataTable" :key="index">
            <!-- <div class="flex" style="border: 2px;border-color: #606266;"> -->
            <el-row style="border:1px solid #dcdfe6">
              <el-col :span="4">
                <div class="time">{{item.createtime}}</div>
              </el-col>
              <el-col :span="2">
                <div class="ellipse" style="margin-top:20px;overflow:hidden;">{{item.metrseedval}}</div>
              </el-col>
              <el-col :span="6">
                <div style="margin-top:20px;margin-bottom:20px;">
                  <el-row>
                    <!-- <el-col :span="15">{{item.eventName}}<span v-if="item.status === '未定义'" class="statusRed">未定义</span></el-col> -->
                    <el-col
                      :class="item.status === '未定义'?'statusRed':(item.status === '已定义'? 'statusGreen' :'')"
                      :span="24"
                    >{{item.status}}</el-col>
                  </el-row>
                  <el-row style="margin-top:20px;margin-bottom:20px;">
                    <el-col :span="12">{{item.url}}</el-col>
                  </el-row>
                  <el-row style="margin-top:20px;margin-bottom:20px;">
                    <el-col v-if="item['mtr-index']" :span="4">元素位置</el-col>
                    <el-col :span="2">{{item['mtr-index']}}</el-col>
                    <el-col v-if="item['mtr-group']" :span="4">元素分组</el-col>
                    <el-col :span="14">{{item['mtr-group']}}</el-col>
                    <el-col v-if="item['mtrseed'] && item['mtrseed']!='PAGE_LOAD'" :span="4">元素内容</el-col>
                    <el-col
                      v-if="item['mtrseed'] && item['mtrseed']!='PAGE_LOAD'"
                      :span="14"
                    >{{item['mtrseed']}}</el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="ellipse" style="margin-top:20px;overflow:hidden;">{{item.clientname}}</div>
              </el-col>
              <el-col :span="5" style="margin-top:15px">
                <div v-for="(ele,index2) in item.events" :key="index2" >
                  <el-row>
                    <el-col :span="14">
                      <div
                    type="text"
                    class="ellipse"
                    @click="defineEvent(index,{id:ele.id})"
                    style="padding:5px 19px;color:#409EFF;cursor:pointer;"
                  >{{ele.eventName}}</div>
                    </el-col>
                    <el-col class="btn_add" :span="10">
                      <el-button type="text" @click="addRouter(ele)" >添加</el-button>
                    </el-col>
                  </el-row>
                  
                  
                </div>
              </el-col>
              <el-col :span="4">
                <div style="margin-top:20px;">
                  <el-button type="primary" @click="defineEvent(index,item,'add')">定义事件</el-button>
                </div>
              </el-col>
            </el-row>
            <!-- </div> -->
          </div>
        </div>
        <el-drawer
          title="事件详情"
          :visible.sync="drawer"
          :direction="direction"
          size="70%"
          @closed="closed()"
          :wrapperClosable="true"
        >
          <template>
            <div style="overflow-x:scroll;height:100%;">
              <el-scrollbar style="height:100%;">
                <template>
                  <div style=" display:flex; margin-top:10px; ">
                    <el-form
                      style="margin:auto;"
                      ref="tableForm"
                      label-width="120px"
                      :model="tableForm"
                      :rules="rules"
                    >
                      <el-form-item label="事件名称：" prop="eventName">
                        <el-input
                          :disabled="disable"
                          placeholder="事件名称"
                          v-model="tableForm.eventName"
                          class="w240 mr20"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="应用ID：" prop="clientId">
                        <el-input
                          :disabled="checkDisable"
                          placeholder="应用ID"
                          v-model="tableForm.clientId"
                          class="w240 mr20"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="页面路径：" prop="pageUrl">
                        <el-input
                          :disabled="true"
                          placeholder="页面路径"
                          v-model="tableForm.pageUrl"
                          class="w240 mr20"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="描述：" prop="descr">
                        <el-input
                          :disabled="disable"
                          placeholder="描述"
                          type="textarea"
                          v-model="tableForm.descr"
                          class="w500 mr20"
                        ></el-input>
                      </el-form-item>

                      <el-main
                        v-if="(tableForm.limitContent || tableForm.limitContent == 0)  || (tableForm.limitLocation || tableForm.limitLocation === 0) || (tableForm.mtrseed || tableForm.mtrseed === 0)"
                      >限定条件</el-main>
                      <div class="flex" style="margin-left:20px;">
                        <el-checkbox
                          :disabled="checkDisable"
                          v-if="tableForm.limitContent != '' && tableForm.limitContent != null"
                          @change="contentChange"
                          v-model="tableForm.contentStatus"
                        >
                          分组：
                          {{tableForm.limitContent}}
                        </el-checkbox>
                        <el-checkbox
                          :disabled="checkDisable"
                          v-if="tableForm.limitLocation || tableForm.limitLocation===0 "
                          v-model="tableForm.locationStatus"
                          @change="locationChange"
                          class="flex"
                        >
                          位置：
                          {{tableForm.limitLocation}}
                        </el-checkbox>
                        <el-checkbox
                          :disabled="checkDisable"
                          v-if="(tableForm.limitMtrseed || tableForm.limitMtrseed===0) && tableForm.limitMtrseed!='PAGE_LOAD' "
                          v-model="tableForm.mtrseedStatus"
                          @change="seedChange"
                          class="flex"
                        >
                          内容：
                          {{tableForm.limitMtrseed}}
                        </el-checkbox>
                      </div>
                      <el-form-item v-if="!disable || !limit">
                        <el-button type="primary" @click="submitForm('tableForm')" class="mt20">提交</el-button>
                        <el-button @click="cancel()">取消</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </template>
              </el-scrollbar>
            </div>
          </template>
        </el-drawer>
      </div>
    </template>
  </div>
</template>
<script>
import httpService from "../../service/BuriedIncidentManagement/httpService.js";

export default {
  data() {
    return {
      t2: null,
      searchParams: {
        productId:null,
        ip: "",
        starttime: "",
        clientId: "",
        deviceModel: ""
      },
      pageTitle:null,
      hasChosedRoute: true,
      stepsOptions: [],
      canCommit: true,
      direction: "rtl",
      drawer: false,
      routerDrawer:false,
      title: "",
      disable: false,
      limit: false,
      routeName: "",
      checkDisable: false,
      routerForm:{},

      tableForm: {},

      labelDataTable: [],

      rules: {
        eventName: [
          { required: true, message: "请输入事件名称", trigger: "blur" }
          // { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        coreName:[{ required: true, message: "请输入核心链路名称", trigger: "blur" }],

        // clientId: [
        //   { required: true, message: "请输入应用ID", trigger: "blur" }
        //   // { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        // ],
        coreDesc: [{ required: false, message: "请输入描述", trigger: "blur" }],
        descr: [{ required: true, message: "请输入描述", trigger: "blur" }],
        pageUrl: [{ required: true, message: "页面路径", trigger: "blur" }]
      }
    };
  },
  created() {
    // this.getStatus();
    // this.getChannel();
    // this.getTableList();
    this.searchParams.productId = this.$route.query.productId || "";
    this.pageTitle = this.$route.query.pageTitle || ""
    // this.searchParams.clientId = this.$route.query.id || "";
    this.searchParams.ip = this.$route.query.ip || "";
    this.searchParams.starttime = Date.parse(new Date());
    this.searchParams.deviceModel = this.$route.query.deviceModel || "";
    console.log("time====", this.searchParams.starttime);
    this.getTableList();
    this.t2 = window.setInterval(this.getTableList, 10000);
  },
  beforeDestroy() {
    window.clearInterval(this.t2);
  },
  mounted() {
    // window.clearInterval(this.t2);
  },
  methods: {
    defineEvent(index, item, add) {
      this.tableForm = {};
      window.clearInterval(this.t2);
      // this.tableForm.clientId = item.clientid;
      this.$set(this.tableForm, "clientId", item.clientid);
      // this.tableForm.pageUrl = item.url;
      this.$set(this.tableForm, "pageUrl", item.url);
      //  this.tableForm.logType = item.actionid;
      this.$set(this.tableForm, "logType", item.actionid);

      this.index = index;
      if (item.status === "未定义" || add) {
        this.routeName = "addBuriedIncident";
        this.checkDisable = false;
        //  this.tableForm.limitContent = item['mtr-group'];
        this.$set(this.tableForm, "limitContent", item["mtr-group"]);
        // this.tableForm.limitLocation = item['mtr-index'];
        this.$set(this.tableForm, "limitLocation", item["mtr-index"]);
        this.$set(this.tableForm, "limitMtrseed", item["mtrseed"]);
        // this.tableForm.contentStatus = false;
        this.$set(this.tableForm, "contentStatus", false);
        // this.tableForm.locationStatus = false;
        this.$set(this.tableForm, "locationStatus", false);
        this.$set(this.tableForm, "mtrseedStatus", false);
        this.drawer = true;
      } else {
        this.checkDisable = true;
        this.tableForm.id = item.id;
        // this.tableForm.eventName = item.eventName;
        // this.tableForm.descr = item.descr;
        this.routeName = "updateBuriedIncident";
        this.getDetails();
      }
    },

    addRouter(ele){
      this.stepsOptions.push(ele)
    },
    delRouter(item,index) {
      this.stepsOptions.splice(index,1)
    },
    routerComplete() {
      this.routerForm = {}
      if (this.stepsOptions.length>0) {
         this.routerDrawer = true
      }else {
        this.$message.warning(
                "请先添加路径!"
            );
      }
     
    },

    contentChange() {
      console.log("contentStatus===", this.tableForm.contentStatus);
      this.$set(this.tableForm, "contentStatus", this.tableForm.contentStatus);
    },
    locationChange() {
      this.$set(
        this.tableForm,
        "locationStatus",
        this.tableForm.locationStatus
      );
    },
    seedChange() {
      this.$set(this.tableForm, "mtrseedStatus", this.tableForm.mtrseedStatus);
    },
    cancel() {
      this.drawer = false;
    },
    routerDrawerCancel() {
      this.routerDrawer = false
      this.canCommit = true;
    },
    closed() {
      console.log("closed======");
      this.canCommit = true;
    },
    submitForm(formName) {
      if (this.canCommit) {
        this.canCommit = false;
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (formName==='routerForm') {
              this.commitRouter();
            }else if (formName==='tableForm') {
              this.commitInfo();
            }
            
          } else {
            //console.log('提交失败!!')
            this.canCommit = true;
            return false;
          }
        });
      }
    },

    getDetails() {
      const data = this.tableForm.id;
      httpService.getDetails(data).then(
        response => {
          //console.debug('response===',response.data)
          if (+response.code === 200 && response.data) {
            //   this.$router.push({ path: "/merchandiseManagement" });
            this.tableForm = response.data;
            if (this.tableForm.contentStatus === 1) {
              // this.tableForm.contentStatus = true;
              this.$set(this.tableForm, "contentStatus", true);
            } else {
              // this.tableForm.contentStatus = false;
              this.$set(this.tableForm, "contentStatus", false);
            }
            if (this.tableForm.locationStatus === 1) {
              // this.tableForm.locationStatus = true;
              this.$set(this.tableForm, "locationStatus", true);
            } else {
              // this.tableForm.locationStatus = false;
              this.$set(this.tableForm, "locationStatus", false);
            }
            if (this.tableForm.mtrseedStatus === 1) {
              this.$set(this.tableForm, "mtrseedStatus", true);
            } else {
              this.$set(this.tableForm, "mtrseedStatus", false);
            }
            this.drawer = true;
          } else {
            // alert(response.msg || '新增任务失败')
            this.t2 = window.setInterval(this.getTableList, 10000);
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                "获取事件详情失败!"
            );
          }
        },
        response => {
          this.t2 = window.setInterval(this.getTableList, 10000);
          this.$message.error(
            response.message ||
              response.subMsg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
    },

    commitRouter(){
      this.routerForm.productId = this.searchParams.productId
      let unburyEvents = []
      for (let index = 0; index < this.stepsOptions.length; index++) {
        const element = this.stepsOptions[index];
        let unburyEvent = {}
        unburyEvent.eventId = element.id
        unburyEvent.linkName = element.eventName

        unburyEvent.sortNum = index +1
        unburyEvents.push(unburyEvent)
      }
      this.routerForm.unburyEvents = unburyEvents

      const data = this.handparams(this.routerForm);
        httpService.logcorelinkconf(data).then(
          response => {
            //console.debug('response===',response.data)
            this.canCommit = true;
            if (+response.code === 200 && response.data) {
              //   this.$router.push({ path: "/merchandiseManagement" });
              this.routerDrawer = false
             this.$router.push({ path: "/productAnalysis",query:{id:this.searchParams.productId +"",pageTitle:this.pageTitle,activeKey:"2"}});
            } else {
              
              this.$message.error(
                response.message ||
                  response.subMsg ||
                  response.msg ||
                  "创建核心链路失败!"
              );
            }
          },
          response => {
            this.canCommit = true;
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                "请求服务器失败!"
            );
          }
        );


    },

    commitInfo() {
      if (this.tableForm.contentStatus) {
        this.tableForm.contentStatus = 1;
      } else {
        this.tableForm.contentStatus = 0;
      }
      if (this.tableForm.locationStatus) {
        this.tableForm.locationStatus = 1;
      } else {
        this.tableForm.locationStatus = 0;
      }
      if (this.tableForm.mtrseedStatus) {
        this.tableForm.mtrseedStatus = 1;
      } else {
        this.tableForm.mtrseedStatus = 0;
      }

      const data = this.handparams(this.tableForm);
      //   console.log("data===",data)

      if (this.routeName === "addBuriedIncident") {
        httpService.logappconf(data).then(
          response => {
            //console.debug('response===',response.data)
            if (+response.code === 200 && response.data) {
              //   this.$router.push({ path: "/merchandiseManagement" });
              this.drawer = false;
              this.setTableList(response.data);
              this.t2 = window.setInterval(this.getTableList, 10000);
            } else {
              // alert(response.msg || '新增任务失败')
              this.canCommit = true;
              this.$message.error(
                response.message ||
                  response.subMsg ||
                  response.msg ||
                  "创建事件失败!"
              );
            }
          },
          response => {
            this.canCommit = true;
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                "请求服务器失败!"
            );
          }
        );
      } else {
        httpService.updateBuriedIncident(data).then(
          response => {
            //console.debug('response===',response.data)
            if (+response.code === 200 && response.data) {
              this.drawer = false;
              this.setTableList(this.tableForm.id);
              this.t2 = window.setInterval(this.getTableList, 10000);
              // this.getTableList();
            } else {
              // alert(response.msg || '新增任务失败')
              this.canCommit = true;
              this.$message.error(
                response.message ||
                  response.subMsg ||
                  response.msg ||
                  "编辑事件失败!"
              );
            }
          },
          response => {
            this.canCommit = true;
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                "请求服务器失败!"
            );
          }
        );
      }
    },

    setTableList(id) {
      this.labelDataTable[this.index].id = id;
      this.labelDataTable[this.index].eventName = this.tableForm.eventName;
      this.labelDataTable[this.index].url = this.tableForm.pageUrl;
      this.labelDataTable[this.index].status = "已定义";
      this.labelDataTable[this.index].events.forEach((element, index) => {
        if (element.id == id) {
          this.labelDataTable[this.index].events.splice(index, 1);
        }
      });
      let itemm = {
        id: id,
        eventName: this.tableForm.eventName
      };
      this.labelDataTable[this.index].events.push(itemm);
    },

    // 获取列表
    getTableList() {
      const data = this.handparams(this.searchParams);
      httpService.unburyList(data).then(
        response => {
          if (+response.code === 200) {
            if (response.data && response.data.records instanceof Array) {
              const array = response.data.records;
              this.labelDataTable = array.concat(this.labelDataTable);
              console.log("this.labelDataTable===", this.labelDataTable);
              this.searchParams.starttime = response.msg;
            } else {
              this.labelDataTable = [];
            }
          } else {
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                "服务器未返回数据!"
            );
          }
        },
        response => {
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
    },
    //参数处理
    handparams(param) {
      const params = JSON.parse(JSON.stringify(param));
      for (const i in params) {
        if (params[i] === "") {
          delete params[i];
        }
      }
      // console.log("data===" + JSON.stringify(params))
      return params;
    }
  }
};
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
.time {
  margin: 20px;
}
.statusRed {
  color: rgb(252, 5, 5);
}
.statusGreen {
  color: rgb(24, 143, 8);
}
.ellipse {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content {
  width: auto;
  height: fit-content;
  height: -webkit-fit-content;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  margin: 0 24px 24px 24px;
}
.contain_bg {
  width: 100%;
  height: auto;
  background: rgba(240, 242, 245, 1);
  padding: 24px;
}
.route_content {
  width: 100%;
  height: 240px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
}
.page_title {
  width: fit-content;
  width: -webkit-fit-content;
  height: 24px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
  margin-top: 16px;
  margin-left: 24px;
}
.no_select {
  width: fit-content;
  width: -webkit-fit-content;
  height: 24px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 186px;
  margin-left: 100px;
}
.circle_step {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 1);
  margin: 22px 6px 10px 24px;
  border-color: rgba(24, 144, 255, 1);
  border-style: solid;
  border-width: 1px;
  border-radius: 10px;
}
.step_num {
  width: fit-content;
  width: -webkit-fit-content;
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  margin-top: 16px;
  margin-right: 21px;
}
.step_desc {
  width: fit-content;
  width: -webkit-fit-content;
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
  margin-top: 16px;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.event_list_content {
  width: 100%;
min-height: 640px;
background:rgba(255,255,255,1);
border-radius:2px;
margin-top: 24px;
}
 .btn_add  {
//     border: 1px solid #D8DCE5;
  
//     padding: 10px 19px;
margin-top: -4px;
 }
</style>

