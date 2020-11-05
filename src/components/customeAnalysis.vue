<template>
  <div class="contain_bg">
    <div>
      <a-row style="width:100%;padding:24px;">
        <a-col @click="newAdd" class="dashed-add" :span="24">
          <a-icon style="width:16px;height:16px;background:rgba(255,255,255,0);" type="plus" />
          <span class="link_add">新增分析数据</span>
        </a-col>
      </a-row>
      <a-row v-for="(item,idx) in coreList" :key="idx" style="width:100%;padding:0px 24px;">
        <a-col class="content-chart" :span="24">
          <a-row>
            <a-col :span="24">
              <a-col :span="4">
                <span class="item_title">{{item.name}}</span>
              </a-col>
              <a-col style="text-align:right;line-height:53px;" :span="20">
                <a-range-picker
                    v-show="item.showPicker"
                  :defaultValue="[moment(item.startDay, dateFormat), moment(item.endDay, dateFormat)]"
                  :disabledDate="disabledEndDate"
                  @change="(value,dateString) => onRangeChange(value,dateString,item,idx)"
                />
                <!-- :disabled="item.selectedDisabled"-->

                <!-- <a-button @click="onSearch(item,idx)">查询</a-button> -->
                <a-button style="margin-right:24px;" @click="downLoad(item,idx)">导出数据</a-button>
              </a-col>
            </a-col>
            <a-col :span="24">
              <div style="width:auto;height:1px;background:rgba(233,233,233,1);"></div>
            </a-col>

            <a-col :span="24">
              
              <a-spin :spinning="item.spinning">
      <div
                v-show="item.showChart"
                :id="'customeAnalysisData'+idx"
                style="margin-right:24px;margin-top:24px;"
              ></div>
              <a-table v-show="!item.showChart" :columns="item.columns" :dataSource="item.data"></a-table>
            </a-spin>
              <!-- <div
                v-show="item.columnar"
                :id="'colCoreLinkData'+idx"
                style="margin-right:24px;margin-top:24px;"
              ></div>-->
              <!-- <div v-else id="columnarUniqueData" style="margin-right:24px;margin-top:24px;"></div> -->
            </a-col>
            <a-col :span="24">
              <div style="width:auto;height:1px;background:rgba(233,233,233,1);margin-top:14px;"></div>
            </a-col>

            <a-col style="text-align:right;margin-top:13px;" :span="24">
              <a-button @click="delClick(item,idx)" type="link">删除</a-button>
              <a-button @click="checkDetail(item,idx)" style="margin-right:32px;" type="link">编辑详情</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-modal title="删除" :visible="delVisible" @ok="handleDelOk" @cancel="delCancel">
        <p>{{ delText }}</p>
      </a-modal>
    </div>
  </div>
</template>
<script>
import httpService from "../service/CoreLinkAnalysis/httpService";

import moment from "moment";
import { Chart } from "@antv/g2";
export default {
  props: {
    id: {
      type: String
    },
    pageTitle: {
      type: String
    }
  },
  data() {
    return {
      dateFormat: "yyyy-MM-DD",
      columnar: false,
      productId: null,
      channelsOptions: [],
      eventDeminConfList: [],
      searchParams: {
        productId: null,
        startDay: "",
        endDay: "",
        channelId: "",
        distributeFlag: 0,
        indexCode: ""
      },
      searchParamsList: [],
      index: 0,
      delText: "是否确认需要删除",

      delVisible: false,

      chart: [],
      columnarChart: null,

      coreList: [],

      searchParams2: {
        productId: null,
        startDay: "",
        endDay: "",
        page: 10,
        limit: 0
      },

      rules: {
        variName: [
          { required: true, message: "请输入变量名称", trigger: "blur" }
          // { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],

        identifyName: [
          { required: true, message: "请输入标识符", trigger: "blur" }
          // { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        // descr: [{ required: true, message: "请输入描述", trigger: "blur" }],
        variType: [{ required: true, message: "请选择类型", trigger: "change" }]
      }
    };
  },
  created() {
    const id = this.id || "";
    this.productId = id;
    let day1 = new Date();
    day1.setTime(day1.getTime() );
    let defaultStartDay = new Date();
    defaultStartDay.setTime(
      defaultStartDay.getTime() - 24 * 60 * 60 * 1000 * 6
    );
    let s1 = day1.getFullYear() + (day1.getMonth() + 1) + "" + day1.getDate();
    this.today =
      day1.getFullYear() +
      "-" +
      this.getZeroString(day1.getMonth() + 1) +
      "-" +
      this.getZeroString(day1.getDate());
    this.defaultStartDay =
      defaultStartDay.getFullYear() +
      "-" +
      this.getZeroString(defaultStartDay.getMonth() + 1) +
      "-" +
      this.getZeroString(defaultStartDay.getDate());
    this.searchParams.productId = id;
    this.searchParams.startDay = this.defaultStartDay.replace(/-/g, "");
    this.searchParams.endDay = this.today.replace(/-/g, "");
    this.searchParams.distributeFlag = 0;
    this.searchParams.matchChannel = 0;

  ;

    console.log("coreLinkAnalysis======", "核心链路");
    this.getEventDeminConfListOfProduct();
    // this.getAllData(this.searchParams, 0);
  },
  mounted() {},
  methods: {
    moment,

    getZeroString(num) {
      if (num < 10) {
        return "0" + num;
      } else {
        return "" + num;
      }
    },

    delClick(item, index) {
      this.index = index;
      this.delVisible = true;
    },
    checkDetail(item, index) {

      this.$router.push({
        name: "updateEventAnalysis2",
        query: { id:this.coreList[index].id, productId: this.productId, pageTitle: this.pageTitle }
      });

    },

    handleDelOk() {
      let id = this.coreList[this.index].id;
      this.delData(id);
    },

    delCancel() {
      this.delVisible = false;
    },

    // 删除
    delData(value) {
      httpService.delLogeventdeminconf(value).then(
        response => {
          if (response.code) {
            if (+response.code === 200) {
              this.delVisible = false;
              this.getEventDeminConfListOfProduct();
            } else {
              this.$message.error(
                response.message ||
                  response.sub_msg ||
                  response.msg ||
                  "服务器未返回数据!"
              );
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
      //   } else {
      //     this.$message.error("请先选择条目!");
      //   }
    },

    newAdd() {
      this.$router.push({
        name: "addEventAnalysis2",
        query: { productId: this.productId, pageTitle: this.pageTitle }
      });
    },

    disabledEndDate(current) {
      //   console.log("moment===", moment().endOf("day"));
      //   console.log("current===", current);
      //   console.log(
      //     "boolen===",
      //     current && current > moment().subtract(1, "days")
      //   );
      return current && current > moment().endOf("day");
    },

    onRangeChange(date, dateString, item, index) {
      console.log("dateString====", dateString);
      console.log("dateString0====", dateString[0]);
      console.log("this.searchParamsList====", this.searchParamsList);
      this.index = index;
      this.searchParamsList[index].startDay = dateString[0].replace(/-/g, "");
      this.searchParamsList[index].endDay = dateString[1].replace(/-/g, "");
      console.log(
        "this.searchParamsList[index]===",
        this.searchParamsList[index]
      );
      this.getAllData(this.searchParamsList[index], index);
    },

    

   
    onCheckChange(item, index, e) {
      this.index = index;
      console.log(`checked =${e.target.checked}++ index = ${index}`, item);
      if (e.target.checked) {
        this.searchParamsList[index].distributeFlag = 1;
        item.checkedDisabled = true;
        this.coreList[index].columnar = true;
        this.$set(this.coreList, index, item);
      } else {
        this.searchParamsList[index].distributeFlag = 0;
        item.checkedDisabled = false;
        this.coreList[index].columnar = false;
        this.$set(this.coreList, index, item);
      }
      this.onSearch(item, index);
      // this.getAllData(this.searchParams,1);
    },
    // 查询
    onSearch(item, index) {
      this.index = index;

      
      if (item.columnar) {
        this.getAllData(this.searchParamsList[index], index);
      } else {
        this.getAllData(this.searchParamsList[index], index);
      }
    },

    //产品关联事件列表
    getEventDeminConfListOfProduct() {
      const data = this.productId;
      httpService.getEventDeminConfListOfProduct(data).then(
        response => {
          if (+response.code === 200 && response.data) {
            if (response.data instanceof Array) {
              this.eventDeminConfList = response.data;
              this.coreList = [];
              if (this.eventDeminConfList.length != 0) {
                for (
                  let index = 0;
                  index < this.eventDeminConfList.length;
                  index++
                ) {
                  const element = this.eventDeminConfList[index];
                  setTimeout(() => {
                    if (!this.chart[index]) {
                      let chartItem = {};
                      chartItem.chart = new Chart({
                        container: "customeAnalysisData" + index,
                        autoFit: true,
                        height: 310
                      });
                      this.chart.push(chartItem);
                    } else {
                      if (!this.chart[index].chart) {
                        this.chart[index].chart = new Chart({
                          container: "customeAnalysisData" + index,
                          autoFit: true,
                          height: 310
                        });
                      }
                    }
                  }, 0);

                  let param = {
                    //this.eventDeminConfList[0].id
                    id: element.id,
                    startDay: element.startDay,
                    endDay: element.endDay
                  };
                  this.searchParamsList[index] = param
                  let startDay = ""
                  let endDay  = ""
                  if (element.startDay.length === 8) {
                    startDay = element.startDay.substring(0,4)+'-'+ element.startDay.substring(4,6)+'-'+element.startDay.substring(6,element.startDay.length)
                  }
                  if (element.endDay.length === 8) {
                      endDay = element.endDay.substring(0,4)+'-'+ element.endDay.substring(4,6)+'-'+element.endDay.substring(6,element.endDay.length)
                  }
                  console.log('startDay======',startDay)
                  let a = {
                      id:element.id,
                      eventId:element.eventId,
                    name: element.name,
                    data: [],
                    startDay:startDay,
                    endDay:endDay,
                    showPicker:true,
                    demin: element.demin
                  };
                  if (element.demin && element.demin.indexOf(",") === -1) {
                    a.showChart = true;
                    console.log("showChart====", a.showChart);
                    //   this.$set(this.coreList,index,this.coreList[index])
                  } else {
                    a.showChart = false;
                    //    this.$set(this.coreList,index,this.coreList[index])
                    console.log("showChart====else===", a.showChart);
                  }
                  this.coreList.push(a);
                  this.getAllData(param, index);
                }
              }
            } else {
              this.eventDeminConfList = [];
              this.$message.error(
                response.message ||
                  response.sub_msg ||
                  response.msg ||
                  "获取的不是列表!"
              );
            }
          } else {
            this.eventDeminConfList = [];
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                "获取列表失败!"
            );
          }
        },
        response => {
          this.coreList = [];
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
    },

    // 获取列表数据
    getAllData(params, index) {
     this.coreList[index].spinning = true
     this.$set(this.coreList,index, this.coreList[index])
      const data = this.handparams(params);
      httpService.eventSearchById(data).then(
        response => {
          console.log("esponse.data===", response.data);
          this.coreList[index].spinning = false
          if (
            +response.code === 200 &&
            response.data &&
            response.data.records
          ) {
            if (response.data.records instanceof Array) {
              let array = response.data.records;
              // this.indexList = array;
              // console.log("indexList====", this.indexList);
              // let a = JSON.parse(JSON.stringify(this.coreList[0]));
              this.coreList[index].data = array;

              if (this.coreList[index].showChart) {
                console.log("showChart====", this.coreList[index].showChart);
                //   this.$set(this.coreList,index,this.coreList[index])
                this.setAllData(this.coreList[index].data, index);
              } else {
                console.log(
                  "showChart====else===",
                  this.coreList[index].showChart
                );
                this.setTableData(this.coreList[index].data, index);
              }

        
            } else {
              
              this.setAllData([], index);
            this.setTableData([], index);
              this.$message.error(
                response.message ||
                  response.sub_msg ||
                  response.msg ||
                  "获取的不是列表!"
              );
            }
          } else {
            
           this.setAllData([], index);
            this.setTableData([], index);
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                "获取列表失败!"
            );
          }
        },
        response => {
            this.coreList[index].spinning = false
         this.setAllData([], index);
            this.setTableData([], index);
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
    },

    setTableData(array, index) {
      const data = this.coreList[index].eventId;
      httpService.getDimenList(data).then(
        response => {
          //console.debug('response===',response.data)
          if (+response.code === 200) {
            if (response.data && response.data instanceof Array) {
              this.coreList[index].deminOptions = response.data;

              this.tableKeys = [];
              let keys = [];

              
              if (this.coreList[index].demin.indexOf(",") > -1) {
                keys = this.coreList[index].demin.split(",");
              } else {
                keys.push(this.coreList[index].demin);
              }
              if (this.coreList[index].data != 0) {
                
                if (this.coreList[index].data[0].hour) {
                  keys.unshift("hour");
                }
                if (this.coreList[index].data[0].day) {
                  keys.unshift("day");
                }
              }

              keys.push("val");

              console.log("keys===",keys)
             this.coreList[index].columns = []
              for (let indx = 0; indx < keys.length; indx++) {
                const element = keys[indx];
                let title = "";
                if (element === "day") {
                  title = "日";
                }
                if (element === "hour") {
                  title = "时";
                }
                if (element === "val") {
                  title = "值";
                }
                console.log("deminOptions====",this.coreList[index].deminOptions)
                for (let inde = 0; inde < this.coreList[index].deminOptions.length; inde++) {
                  const ele = this.coreList[index].deminOptions[inde];
                  if (element === ele.identifyName) {
                    title = ele.dimenName;
                  }
                  console.log("title===", title);
                }
                let item = {
                  key: element,
                  title: title
                };
                let column = {};
                column.title = title;
                column.dataIndex = element;
                column.key = element;
                this.coreList[index].columns.push(column);
                
                console.log("columns====",this.coreList[index].columns)

                this.coreList[index].data = JSON.parse(JSON.stringify(array))
                // this.coreList[index].data = [
                //     {client_id:"dsf",day:"3436",val:3254},
                //      {client_id:"dsf",day:"3436",val:3254},
                //       {client_id:"dsf",day:"3436",val:3254},
                      
                // ]
                 console.log("data====",array)
                // this.tableKeys.push(item);
              }
            } else {
              this.coreList[index].deminOptions = [];
            }
          } else {
            this.coreList[index].deminOptions = [];
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                "请求服务器失败!"
            );
          }
        },
        response => {
          this.coreList[index].deminOptions = [];
          this.$message.error(
            response.message ||
              response.subMsg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
    },

    

    setAllData(array, index, type) {
      console.log("alldata===", array);
      let data = array;
        for (let index = 0; index < data.length; index++) {
          let element = data[index];
          if ( element.hour) {
              element.time = element.hour;
          }else {
            element.time = element.day;
          }

          element.val =  +element.val
          

        }
      // if (type === 2) {

      // }else {
      //   this.chart.push(
      //   new Chart({
      //     container: "coreLinkData" + index,
      //     autoFit: true,
      //     height: 310
      //   })
      //   );
      // }

      //   if (!this.chart[index]) {
      //     let chartItem = {};
      //     chartItem.chart = new Chart({
      //       container: "coreLinkData" + index,
      //       autoFit: true,
      //       height: 310
      //     });
      //     this.chart.push(chartItem);
      //   } else {
      //     if (!this.chart[index].chart) {
      //       this.chart[index].chart = new Chart({
      //       container: "coreLinkData" + index,
      //       autoFit: true,
      //       height: 310
      //     });
      //     }
      //   }
      console.log("index====", index);
      this.chart[index].chart.data(data);

      this.chart[index].chart.scale({
        time: {
          range: [0, 1]
        },
        val: {
          nice: true
        }
      });

      this.chart[index].chart.tooltip({
        showCrosshairs: true,
        shared: false
      });

      this.chart[index].chart.axis("val", {
        label: {
          formatter: val => {
            return val + "";
          }
        }
      });
      // this.coreList[index].demin = "client_id"
      this.chart[index].chart
        .line()
        .position("time*val")
        .color(this.coreList[index].demin)
        .shape("smooth")
        .tooltip(`time*val*${this.coreList[index].demin}`, function(
          day,
          val,
          name
        ) {
          return {
            name: name, //itemTpl:{name}
            value: val + "" // itemTpl:{value}
          };
        });

      this.chart[index].chart
        .point()
        .position("time*val")
        .color(this.coreList[index].demin)
        .tooltip(`time*val*${this.coreList[index].demin}`, function(
          day,
          val,
          name
        ) {
          return {
            name: name, //itemTpl:{name}
            value: val + "" // itemTpl:{value}
          };
        })
        .shape("circle");

      // Step 4: 渲染图表
      this.chart[index].chart.render();
    },

    // 获取渠道列表
    getChannelsList(idx, coreId) {
      // for (let index = 0; index < this.coreList.length; index++) {
      //   let element = this.coreList[index];
      //   element.channelsOptions = [];
      // }
      this.coreList[idx].channelsOptions = [];
      let param = {
        productId: this.productId,
        type: "core",
        coreId: coreId
      };

      const data = this.handparams(param);

      return httpService.getChannelsList(data).then(
        response => {
          if (+response.code === 200 && response.data) {
            if (response.data instanceof Array) {
              let array = response.data;

              
              this.coreList[idx].channelsOptions = array;
              this.$set(this.coreList, idx, this.coreList[idx]);
              // for (let index = 0; index < this.coreList.length; index++) {
              //   let element = this.coreList[index];
              //   element.channelsOptions.push(...array);
              //    this.$set(this.coreList, index, element);
              //    console.log("getChannelsList"+index,  element.channelsOptions);
              // }
            } else {
              this.coreList[idx].channelsOptions = [];
            }
          } else {
            this.coreList[idx].channelsOptions = [];
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                "服务器未返回数据!"
            );
          }
        },
        response => {
          this.coreList[idx].channelsOptions = [];
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
    },

    downLoad(item, index) {
      let param = this.searchParamsList[index];

    //   param.url = "eventSearchById";

      this.export(param);
    },

    // 导出，参数上传
    export(params) {
      const data = this.handparams(params);
      httpService.eventDataExport(data).then(
        response => {
          if (+response.code === 200 && response.data) {
            this.downFile(response.data);
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
    downFile(params) {
      httpService.eventDownFile(params);
    },

    toPercent(num) {
      return (Math.round(num * 10000) / 100).toFixed(2) + "%";
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
    },
    // 下划线转换驼峰
    toHump(name) {
      return name.replace(/\_(\w)/g, function(all, letter) {
        return letter.toUpperCase();
      });
    },
    // 驼峰转换下划线
    toLine(name) {
      return name.replace(/([A-Z])/g, "_$1").toLowerCase();
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
.dashed-add {
  height: 120px;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px dashed rgba(217, 217, 217, 1);
  text-align: center;
}
.title {
  width: 100%;
  height: 60px;
  text-align: center;
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  background: rgba(255, 255, 255, 1);
  line-height: 60px;
  padding-left: 24px;
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
  height: 100%;
  background: rgba(240, 242, 245, 1);
}
.link_add {
  width: fit-content;
  width: -webkit-fit-content;
  height: 24px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 120px;
}
.content-chart {
  width: 100%;
  height: fit-content;
  height: -webkit-fit-content;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  margin-bottom: 24px;
  padding-bottom: 10px;
}
.item_title {
  width: fit-content;
  width: -webkit-fit-content;
  height: 24px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 53px;
  text-align: center;
  margin-left: 24px;
}
.desc_label {
  width: fit-content;
  width: -webkit-fit-content;
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
}
.desc_value {
  width: fit-content;
  width: -webkit-fit-content;
  height: 32px;
  font-size: 24px;
  font-family: HelveticaNeue;
  color: rgba(0, 0, 0, 0.85);
  line-height: 32px;
  margin-top: 13px;
  margin-bottom: 16px;
}
</style>

