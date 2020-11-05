<template>
  <div class="contain_bg">
    <div >
      <a-row style="width:100%;padding:24px;">
        <a-col @click="newAdd" class="dashed-add" :span="24">
          <a-icon style="width:16px;height:16px;background:rgba(255,255,255,0);" type="plus" />
          <span class="link_add">新增核心链路</span>
        </a-col>
      </a-row>
      <a-row v-for="(item,idx) in coreList" :key="idx" style="width:100%;padding:0px 24px;">
        <a-col class="content-chart" :span="24">
          <a-row>
            <a-col :span="24">
              <a-col :span="4">
                <span class="item_title">{{item.coreName}}</span>
              </a-col>
              <a-col style="text-align:right;line-height:53px;" :span="20">
                <a-range-picker
                  :defaultValue="[moment(defaultStartDay, dateFormat), moment(today, dateFormat)]"
                  :disabledDate="disabledEndDate"
                  @change="(value,dateString) => onRangeChange(value,dateString,item,idx)"
                />
                <!-- :disabled="item.selectedDisabled"-->
                <a-select
                  mode="multiple"
                  style="width:300px;"
                  showArrow
                  @change="value => handleChangeChnnel(item,idx,value)"
                  
                  v-decorator="[
          'apps',
          {     
              rules: [{ required: false, message: '请选择渠道！',type: 'array' }] },
        ]"
                  placeholder="请选择渠道"
                  optionFilterProp="children"
                >
                  <a-select-option
                    v-for="(channel ,index) in item.channelsOptions"
                    :key="index+ '-label' +idx"
                    :value="channel.id"
                  >{{channel.channelName}}</a-select-option>
                </a-select>
                <a-checkbox
                  defaultChecked
                 :disabled="item.checkedDisabled"
                  @change="value => onAllChannelCheckChange(item,idx,value)"
                >渠道汇总</a-checkbox>
                <a-checkbox @change="value => onCheckChange(item,idx,value)">渠道占比</a-checkbox>
                <a-button @click="onSearch(item,idx)">查询</a-button>
                <a-button style="margin-right:24px;" @click="downLoad(item,idx)">导出数据</a-button>
              </a-col>
            </a-col>
            <a-col :span="24">
              <div style="width:auto;height:1px;background:rgba(233,233,233,1);"></div>
            </a-col>

            <a-col v-show="!item.columnar" style="text-align:right" :span="24">
              <a-col :span="15"></a-col>
              <a-col style="text-align:center;padding-top:16px;" :span="3">
                <a-col :span="24">
                  <span class="desc_label">第一步人数</span>
                </a-col>
                <a-col :span="24">
                  <span class="desc_value">{{item.firstStepNum}}</span>
                </a-col>
              </a-col>
              <a-col style="text-align:center;padding-top:16px;" :span="3">
                <a-col :span="24">
                  <span class="desc_label">最后一步人数</span>
                </a-col>
                <a-col :span="24">
                  <span class="desc_value">{{item.lastStepNum}}</span>
                </a-col>
              </a-col>
              <a-col style="text-align:center;padding-top:16px;" :span="3">
                <a-col :span="24">
                  <span class="desc_label">总转化率</span>
                </a-col>
                <a-col :span="24">
                  <span class="desc_value">{{item.convertRate ?  toPercent(parseFloat(item.convertRate)) : '0.00%'}}</span>
                </a-col>
              </a-col>
            </a-col>
            <a-col :span="24">
              <div
                v-show="!item.columnar"
                :id="'coreLinkData'+idx"
                style="margin-right:24px;margin-top:24px;"
              ></div>
              <div
                v-show="item.columnar"
                :id="'colCoreLinkData'+idx"
                style="margin-right:24px;margin-top:24px;"
              ></div>
              <!-- <div v-else id="columnarUniqueData" style="margin-right:24px;margin-top:24px;"></div> -->
            </a-col>
            <a-col :span="24">
              <div style="width:auto;height:1px;background:rgba(233,233,233,1);margin-top:14px;"></div>
            </a-col>

            <a-col style="text-align:right;margin-top:13px;" :span="24">
              <a-button @click="delClick(item,idx)" type="link">删除</a-button>
              <a-button @click="checkDetail(item,idx)" style="margin-right:32px;" type="link">查看详情</a-button>
            </a-col>
          </a-row>
        </a-col>
        
      </a-row>
      <a-modal
            title="删除"
            :visible="delVisible"
            @ok="handleDelOk"
            @cancel="delCancel"
          >
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

      delVisible:false,

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

    // this.searchParams2.productId = id
    // this.searchParams2.startDay = this.defaultStartDay.replace(/-/g, "");
    // this.searchParams2.endDay = this.today.replace(/-/g, "");

    console.log("coreLinkAnalysis======", "核心链路");
    this.getAllData(this.searchParams, 0);
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

    delClick(item,index) {
      this.index = index
      this.delVisible = true
    },
    checkDetail(item,index) {
      this.$router.push({
        name: "coreLinkAnalysisDetail",
        query: { coreId: this.coreList[index].id ,coreName:item.coreName}
      });
    },

    handleDelOk() {
      let id = this.coreList[this.index].id
      this.delData(id);
    },

    delCancel() {
      this.delVisible = false;
    },

    // 删除
    delData(value) {
      httpService.deleteLogcorelinkconf(value).then(
        response => {
          if (response.code) {
            if (+response.code === 200) {
              this.delVisible = false;
              this.getAllData(this.searchParams, 0);
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
        name: "buriedShowManagement2",
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
      this.getAllData(this.searchParamsList[index], 2);
    },

    handleChangeChnnel(item, idx, value) {
      console.log("value====", value);
      this.searchParamsList[idx].channelId = "";
      for (let index = 0; index < value.length; index++) {
        const element = value[index];
        if (index === value.length - 1) {
          this.searchParamsList[idx].channelId =
            this.searchParamsList[idx].channelId + element;
        } else {
          this.searchParamsList[idx].channelId =
            this.searchParamsList[idx].channelId + element + ",";
        }
      }
      console.log("channelId====", this.searchParamsList[idx].channelId);
    },

    onAllChannelCheckChange(item, index, e) {
      if (e.target.checked) {
        item.selectedDisabled = true;
        this.$set(this.coreList, index, item);
        this.searchParamsList[index].matchChannel = 0;
        console.log("selectedDisabled====", item.selectedDisabled);
        // this.coreList[index].selectedDisabled = true
      } else {
        item.selectedDisabled = false;
        this.$set(this.coreList, index, item);
        this.searchParamsList[index].matchChannel = 1;
        console.log("selectedDisabled====", item.selectedDisabled);
      }
    },
    onCheckChange(item, index, e) {
      this.index = index;
      console.log(`checked =${e.target.checked}++ index = ${index}`, item);
      if (e.target.checked) {
        this.searchParamsList[index].distributeFlag = 1;
        item.checkedDisabled = true
        this.coreList[index].columnar = true;
        this.$set(this.coreList, index, item);
      } else {
        this.searchParamsList[index].distributeFlag = 0;
        item.checkedDisabled = false
        this.coreList[index].columnar = false;
        this.$set(this.coreList, index, item);
      }
      this.onSearch(item, index);
      // this.getAllData(this.searchParams,1);
    },
    // 查询
    onSearch(item, index) {
      this.index = index;

      /**if (!this.searchParamsList[index].channelId) {
        for (
          let idx = 0;
          idx < this.coreList[index].channelsOptions.length;
          idx++
        ) {
          let element = this.coreList[index].channelsOptions[idx];

          if (idx === this.coreList[index].channelsOptions.length - 1) {
            this.searchParamsList[index].channelId =
              this.searchParamsList[index].channelId + element.id;
          } else {
            this.searchParamsList[index].channelId =
              this.searchParamsList[index].channelId + element.id + ",";
          }
        }
      }
      **/
      // if (this.searchParamsList[index].matchChannel === 0) {
      //   this.searchParamsList[index].channelId =""
      // }

      // for (let index = 0; index < this.defaultValues.length; index++) {
      //   const element = this.defaultValues[index];
      //   if (element === -1) {
      //   } else {
      //     if (index === this.defaultValues.length - 1) {
      //       this.searchParamsList[index].channelId = this.searchParamsList[index].channelId + element;
      //     } else {
      //       this.searchParamsList[index].channelId =
      //         this.searchParams.searchParamsList[index] + element + ",";
      //     }
      //   }
      // }
      if (item.columnar) {
        this.getAllData(this.searchParamsList[index], 2);
      } else {
        this.getAllData(this.searchParamsList[index], 2);
      }
    },

    // 获取列表数据
    getAllData(params, type) {
      // type: 0 是初次加载获取所有数据 折线图   
    //2、单条数据，更新单个图表  判断线性还是柱状图 this.chart[index].chart)  chart 数组 中元素对象包含 chart 和 colChart 两个对象。new Chart()只能一个节点，（不移除节点的话），setData 更新数据。 
      const data = this.handparams(params);
      httpService.getAllData(data).then(
        response => {
          console.log("esponse.data===", response.data);
          if (+response.code === 200 && response.data) {
            if (response.data instanceof Array) {
              if (type === 1) {
              } else if (type === 2) {
                if (response.data.length > 0) {
                  let columnar = this.coreList[this.index].columnar;
                  
                  let selectedDisabled =  this.coreList[this.index].selectedDisabled;
                  let checkedDisabled = this.coreList[this.index].checkedDisabled;
                  let channelsOptions = this.coreList[this.index].channelsOptions 
                  this.coreList[this.index] = response.data[0];
                  this.coreList[this.index].columnar = columnar;
                  this.coreList[this.index].channelsOptions =[]
                  this.coreList[this.index].channelsOptions.push(...channelsOptions)
                  this.coreList[this.index].selectedDisabled = selectedDisabled
                  this.coreList[this.index].checkedDisabled = checkedDisabled
                  // this.searchParamsList[this.index].coreId = this.coreList[this.index].id
                  this.$set(
                    this.coreList,
                    this.index,
                    this.coreList[this.index]
                  );
                  console.log(
                    "this.coreList[this.index].columnar==",
                    this.coreList[this.index].columnar
                  );
                  setTimeout(() => {
                    if (this.coreList[this.index].columnar) {
                      if (this.coreList[this.index].datas) {
                        this.setColumnarAllData(
                          this.coreList[this.index].datas,
                          this.index,
                          type
                        );
                      }else {
                        this.setColumnarAllData(
                         [],
                          this.index,
                          type
                        );
                      }
                      
                    } else {
                      if (this.coreList[this.index].datas) {
                        this.setAllData(
                        this.coreList[this.index].datas,
                        this.index,
                        type
                      );
                      }else {
                        this.setAllData(
                        [],
                        this.index,
                        type
                        );
                      }
                      
                    }
                  }, 0);
                }
              } else {
                this.coreList = response.data;
                // this.indexList = array;
                // console.log("indexList====", this.indexList);
                // let a = JSON.parse(JSON.stringify(this.coreList[0]));
                // this.coreList.push(a);
                // this.chart = [];

                for (let index = 0; index < this.coreList.length; index++) {
                  let element = this.coreList[index];
                  element.selectedDisabled = true;
                  element.checkedDisabled = false
                  element.columnar = false;
                  this.getChannelsList(index,element.id);
                  setTimeout(() => {
                    if (element.datas) {
                      this.setAllData(element.datas, index, type);
                    }else {
                      this.setAllData([], index, type);
                    }
                    // this.setTableData(this.data);
                    this.searchParamsList[index] = JSON.parse(
                      JSON.stringify(this.searchParams)
                    );
                    this.searchParamsList[index].coreId = element.id
                  }, 0);
                }

                console.log("this.coreList====", this.coreList);

                
              }
            } else {
              this.coreList = [];
              this.$message.error(
                response.message ||
                  response.sub_msg ||
                  response.msg ||
                  "获取的不是列表!"
              );
            }
          } else {
            this.coreList = [];
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

    setColumnarAllData(array, index, type) {
      const data = array;
      // let  colHeight  = 100 *(data.length) + 100
      // if (this.columnarChart === null) {
      //   this.columnarChart = new Chart({
      //     container: "colCoreLinkData",
      //     autoFit: true,
      //     height: 310
      //   });
      // }
      console.log("setColumnarAllData===");
      let colHeight = 0
      if (data) {
        if (data.length<11) {
          colHeight = 310
        }else {
         colHeight = 310 + 31*(data.length -10)
        }
      }else {
        colHeight = 310
      }
      
      if (!this.chart[index]) {
        let chartItem = {};
        chartItem.columnarChart = new Chart({
          container: "colCoreLinkData"+ index,
          autoFit: true,
          height: colHeight
        });
        this.chart.push(chartItem);
        console.log("setColumnarAllData===");
      } else {
        if (!this.chart[index].columnarChart) {
          this.chart[index].columnarChart = new Chart({
            container: "colCoreLinkData"+ index,
            autoFit: true,
            height: colHeight
          });
        }else {
          this.chart[index].columnarChart.destroy()
          this.chart[index].columnarChart = new Chart({
            container: "colCoreLinkData"+ index,
            autoFit: true,
            height: colHeight
          });
        }
        
        // this.chart.splice(index,1,new Chart({
        //   container: "colCoreLinkData",
        //   autoFit: true,
        //   height: 310
        // }));
      }

      for (let index = 0; index < data.length; index++) {
        let element = data[index];
        element.label =this.toPercent(parseFloat( element.convertRate))  + "  (" + element.resultVal + ")";
        element.zero = 0
      }
      this.chart[index].columnarChart.data(data);
      this.chart[index].columnarChart.scale("resultVal", { nice: true });
      this.chart[index].columnarChart.coordinate().transpose();
      this.chart[index].columnarChart.tooltip({
        showMarkers: false
      });
      this.chart[index].columnarChart.interaction("active-region");

      this.chart[index].columnarChart
        .interval()
        .position("channelName*resultVal")
        // .label("label", {
        //   offset: 10, // 文本距离图形的距离
        //   textStyle: {
        //     fill: "#404040",
        //     fontSize: "24",
        //     fontWeight: "bold", // 文本粗细
        //     shadowBlur: 5, // 文本阴影模糊
        //     shadowColor: "#fff" // 阴影颜色
        //   }
        // });
        this.chart[index].columnarChart
        .interval()
        .position("channelName*zero")
        .label("label", {
          offset: 10, // 文本距离图形的距离
          textStyle: {
            fill: "#404040",
            fontSize: "24",
            fontWeight: "bold", // 文本粗细
            shadowBlur: 5, // 文本阴影模糊
            shadowColor: "#fff" // 阴影颜色
          }
        });

      this.chart[index].columnarChart.render();
    },

    setAllData(array, index, type) {
      console.log("alldata===", array);
      const data = array;
      for (let index = 0; index < data.length; index++) {
        let element = data[index];
        element.convertRateString = this.toPercent(parseFloat(element.convertRate));
        element.convertRate = parseFloat(element.convertRate)*100;
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

      if (!this.chart[index]) {
        let chartItem = {};
        chartItem.chart = new Chart({
          container: "coreLinkData" + index,
          autoFit: true,
          height: 310
        });
        this.chart.push(chartItem);
      } else {
        if (!this.chart[index].chart) {
          this.chart[index].chart = new Chart({
          container: "coreLinkData" + index,
          autoFit: true,
          height: 310
        });
        }
      }
      console.log("index====", index);
      this.chart[index].chart.data(data);

      this.chart[index].chart.scale({
        day: {
          range: [0, 1]
        },
        convertRate: {
          nice: true
        }
      });

      this.chart[index].chart.tooltip({
        showCrosshairs: true,
        shared: false
      });

      this.chart[index].chart.axis("convertRate", {
        label: {
          formatter: val => {
            return val + "%";
          }
        }
      });

      this.chart[index].chart
        .line()
        .position("day*convertRate")
        .color("channelName")
        .shape("smooth")
        .tooltip('day*convertRate*channelName', function (day, convertRate,channelName) {
          return {
              name: channelName,//itemTpl:{name}
              value: convertRate + '%'// itemTpl:{value}
          }
          })

      this.chart[index].chart
        .point()
        .position("day*convertRate")
        .color("channelName")
        .tooltip('day*convertRate*channelName', function (day, convertRate,channelName) {
          return {
              name: channelName,//itemTpl:{name}
              value: convertRate + '%'// itemTpl:{value}
          }
          })
        .shape("circle");

      // Step 4: 渲染图表
      this.chart[index].chart.render();
    },

    // 获取渠道列表
    getChannelsList(idx,coreId) {
      // for (let index = 0; index < this.coreList.length; index++) {
      //   let element = this.coreList[index];
      //   element.channelsOptions = [];
      // }
      this.coreList[idx].channelsOptions =[]
      let param= {
        productId:this.productId,
        type:'core',
        coreId:coreId
      }

      const data =this.handparams(param)


      return httpService.getChannelsList(data).then(
        response => {
          if (+response.code === 200 && response.data) {
            if (response.data instanceof Array) {
              let array = response.data;

              // this.channelsOptions.push(...array);
              // for (let index = 0; index < array.length; index++) {
              //   const element = array[index];
              //   // this.defaultValues.push(element.id)
              //   this.detailArray.push(element.id);
              //   if (index === array.length - 1) {
              //     this.searchParams.channelId =
              //       this.searchParams.channelId + element.id;
              //   } else {
              //     this.searchParams.channelId =
              //       this.searchParams.channelId + element.id + ",";
              //   }
              // }
              // this.channelsOptions = array;
              this.coreList[idx].channelsOptions = array
             this.$set(this.coreList, idx, this.coreList[idx]);
              // for (let index = 0; index < this.coreList.length; index++) {
              //   let element = this.coreList[index];
              //   element.channelsOptions.push(...array);
              //    this.$set(this.coreList, index, element);
              //    console.log("getChannelsList"+index,  element.channelsOptions);
              // }
             
            } else {
               this.coreList[idx].channelsOptions =[]
            }
          } else {
            this.coreList[idx].channelsOptions =[]
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                "服务器未返回数据!"
            );
          }
        },
        response => {
          this.coreList[idx].channelsOptions =[]
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
    },

    downLoad(item,index) {
      let param = this.searchParamsList[index];
      
      param.url = "searchCoreLinkResults";
      
      this.export(param);
    },

    // 导出，参数上传
    export(params) {
      const data = this.handparams(params);
      httpService.export(data).then(
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
      httpService.downFile(params);
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
  height:fit-content;
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

