<template>
  <div class="contain_bg">
    <div style="background:rgba(255,255,255,1); ">
      <a-row>
        <a-col :span="24">
          <a-range-picker
            :defaultValue="[moment(defaultStartDay, dateFormat), moment(yesterDay, dateFormat)]"
            :disabledDate="disabledEndDate"
            @change="onRangeChange"
          />

          <a-select
                    mode="multiple"
                     style="width:300px;"
                    showArrow
                    v-decorator="[
          'apps',
          {     
              rules: [{ required: false, message: '请选择渠道！',type: 'array' }] },
        ]"
                    placeholder="请选择渠道"
                    @select="select"
                    @deselect="deselect"
                    :value="defaultValues"
                    optionFilterProp="children"
                  >
                    <a-select-option
                      v-for="(channel ,index) in channelsOptions"
                      :key="index"
                      :value="channel.id"
                    >{{channel.channelName}}</a-select-option>
                  </a-select>
            <a-checkbox @change="onCheckChange">渠道占比</a-checkbox>
            <a-button @click="onSearch">查询</a-button>
          <a-button @click="downLoad(1)">导出数据</a-button>
        </a-col>
        <a-col style="padding-top:30px;padding-bottom:100px;" :span="24">
          <div v-show="!columnar" id="newUniqueData" style="margin-right:24px;margin-top:24px;"></div>
          <div v-show="columnar" id="colNewUniqueData" style="margin-right:24px;margin-top:24px;"></div>
          <!-- <div v-else id="columnarUniqueData" style="margin-right:24px;margin-top:24px;"></div> -->
        </a-col>
        
      </a-row>
      <div style="width:auto;height:2px;background:rgba(233,233,233,1);margin-top:24px;"></div>

      

    </div>
  </div>
</template>
<script>
import httpService from "../service/ProductAnalysist/httpService";

import moment from "moment";
import { Chart } from "@antv/g2";
export default {
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      pageTitle: "",
      dateFormat: "yyyy-MM-DD",
      indexList: [],
      channelsOptions: [
      ],
      columnar:false,
      values:"",
      disabled:false,
      defaultValues:[],
      yesterDay: "",
      defaultStartDay: "",
      data: [],
      chart: null,
      columnarChart:null,
      productId: null,
      searchParams: {
        productId: null,
        startDay: "",
        endDay: "",
        channelId:"",
        distributeFlag:0,
        indexCode: ""
      },
      dataList:[],
      detailArray:[],

      columns: [
        
      ],
      routeDataList:[],

      columnsRoute:[
          {
          title: "序号",
          dataIndex: "num",
          ellipsis: true,
          key: "num",
          scopedSlots: { customRender: "id" }
        },
        {
          title: "页面路径",
          dataIndex: "url",
          ellipsis: true,
          key: "url",
          scopedSlots: { customRender: "url" }
        },
        {
          title: "访问人数",
          dataIndex: "val",
          ellipsis: true,
          key: "val",
          scopedSlots: { customRender: "val" }
        },
        {
          title: "访问次数",
          dataIndex:"pageVal",
          key: "pageVal",
          scopedSlots: { customRender: "pageVal" }
        }
      ],

      searchParams2: {
        productId: null,
        startDay: "",
        endDay: "",
        page:10,
        limit: 0,
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
    day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
    let defaultStartDay = new Date();
    defaultStartDay.setTime(
      defaultStartDay.getTime() - 24 * 60 * 60 * 1000 * 7
    );
    let s1 = day1.getFullYear() + (day1.getMonth() + 1) + "" + day1.getDate();
    this.yesterDay =
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
    this.searchParams.endDay = this.yesterDay.replace(/-/g, "");
    this.searchParams.indexCode = "add_num";
    this.searchParams.distributeFlag = 0;


    this.searchParams2.productId = id
    this.searchParams2.startDay = this.defaultStartDay.replace(/-/g, "");
    this.searchParams2.endDay = this.yesterDay.replace(/-/g, "");


     this.getAllData(this.searchParams, 0);
    this.getChannelsList();

    

    // this.getTopPageData(this.searchParams2);

    // this.getStatus();
    // this.getChannel();
    // this.getTableList();
    // setTimeout(() => {
    //   this.setAllData();
    // }, 5000);

    // this.indexListInfo(this.searchParams);
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

    // handleSelectChange(value) {
    //   console.log(value);
    //   if (value.indexOf(-1) >-1) {
    //       this.defaultValues = [-1]
    //       this.defaultValues.push(...this.detailArray)

    //   }else {

    //       if (value.length === this.detailArray.length) {
    //         this.defaultValues = [-1]
    //         this.defaultValues.push(...value)
    //       }else {
    //         this.defaultValues = value
    //       }
          

    //   }
    // },


disabledEndDate(current) {
      //   const yesterDay = this.yesterDay;
      //   if (!endValue || !yesterDay) {
      //     return false;
      //   }
      console.log("moment===", moment().endOf("day"));
      console.log("current===", current);
      console.log(
        "boolen===",
        current && current > moment().subtract(1, "days")
      );
      return current && current > moment().subtract(1, "days");
    },

    downLoad(type){
      let param = this.searchParams
        if (type === 1) {
            
            param.url ="searchProductData"
            
        }
        this.export(param)
    },

    // 导出，参数上传
    export(params) {
        const data = this.handparams(params);
        httpService.export(data).then(
        response => {
          if (+response.code === 200 && response.data) {
            this.downFile(response.data)
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
    downFile(params){
        httpService.downFile(params)
    },


    select(value){
         console.log("value===",value);
        console.log("this.defaultValues===",this.defaultValues);
        if (value === -1) {
            this.defaultValues = [-1]
            this.defaultValues.push(...this.detailArray)
        }else {

            if (this.defaultValues.length === this.detailArray.length -1) {
                if (this.defaultValues.indexOf(-1) >-1) {
                    this.defaultValues.push(value)
                }else {
                    this.defaultValues.push(value)
                    // this.defaultValues.unshift(-1)
                }
           
          }else {
            this.defaultValues.push(value)
          }
           
            
        }
    },
    deselect(value){

        console.log("value===",value);
        console.log("this.defaultValues===",this.defaultValues);
        if (value === -1) {
             this.defaultValues  = []
        }else {
            if (this.defaultValues.indexOf(-1) >-1) {
                this.defaultValues.splice(this.defaultValues.indexOf(value), 1);
                this.defaultValues.shift()
            }else {
                
                this.defaultValues.splice(this.defaultValues.indexOf(value), 1);
            }
            
        }
    },

    onCheckChange(e) {
      console.log(`checked = ${e.target.checked}`);
      if (e.target.checked) {
          this.searchParams.distributeFlag = 1;
          this.disabled  = true
          this.columnar = true
      }else {
          this.searchParams.distributeFlag = 0;
          this.disabled  = false
          this.columnar = false
      }
      this.onSearch();
    //   this.getAllData(this.searchParams,1);
    },

    onSearch(){
        this.searchParams.channelId = ""
        for (let index = 0; index < this.defaultValues.length; index++) {
            const element = this.defaultValues[index];
            if (element === -1) {
                
            }else {
                if (index === this.defaultValues.length - 1) {
                    this.searchParams.channelId = this.searchParams.channelId +element
                }else {
                    this.searchParams.channelId = this.searchParams.channelId +element + ","
                }
            }
            
        }
        
        this.getAllData(this.searchParams,this.searchParams.distributeFlag);
        
    },

    onRangeChange(date, dateString) {
      console.log(date, dateString);
      this.searchParams.startDay = dateString[0].replace(/-/g, "");
      this.searchParams.endDay = dateString[1].replace(/-/g, "");
      console.log("date====", this.searchParams.date);
      this.getAllData(this.searchParams, this.searchParams.distributeFlag);
    },
    onRange1Change(date,dateString) {

    },
     onRange2Change(date,dateString) {
      
    },

    // 获取渠道列表
    getChannelsList() {
      this.channelsOptions = [
         
      ];
      this.defaultValues = [];
        this.detailArray = []
        this.searchParams.channelId = ""
      return httpService.getChannelsList(this.productId).then(
        response => {
          if (+response.code === 200 && response.data) {
            if (response.data instanceof Array) {
              const array = response.data;
             
              this.channelsOptions.push(...array) ;
              for (let index = 0; index < array.length; index++) {
                  const element = array[index];
                  // this.defaultValues.push(element.id)
                  this.detailArray.push(element.id)
                  if (index === array.length -1) {
                      this.searchParams.channelId = this.searchParams.channelId+element.id 
                  }else {
                        this.searchParams.channelId = this.searchParams.channelId+element.id +","
                  }
                  
              }
              console.log("getChannelsList",this.channelsOptions);
            } else {
              this.channelsOptions = [];
            }
          } else {
            this.channelsOptions = [];
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                "服务器未返回数据!"
            );
          }
        },
        response => {
          this.channelsOptions = [];
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
    },
    setTableData(array) {
      let indexNameList = [];
      let day = [];
      let indexCodeList = [];
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (indexNameList.indexOf(element.indexName) > -1) {
        } else {
          indexNameList.push(element.indexName);
        }
        if (day.indexOf(element.day) > -1) {
        } else {
          day.push(element.day);
        }
        if (indexCodeList.indexOf(element.indexCode) > -1) {
        } else {
          indexCodeList.push(element.indexCode);
        }
      }
      let dataList = [];
      for (let index = 0; index < day.length; index++) {
        const element = day[index];
        let a = {};
        for (let ix = 0; ix < indexCodeList.length; ix++) {
          const el = indexCodeList[ix];

          for (let idx = 0; idx < array.length; idx++) {
            const ele = array[idx];
            if (element === ele.day && el === ele.indexCode) {
                a[ele.indexCode] = ele.resultVal
            }
          }
        }
        dataList.push(a)
      }

      // columns: [
      //   {
      //     title: "序号",
      //     dataIndex: "id",
      //     ellipsis: true,
      //     key: "id",
      //     scopedSlots: { customRender: "id" }
      //   },
      //   {
      //     title: "产品名称",
      //     dataIndex: "productName",
      //     ellipsis: true,
      //     key: "productName",
      //     scopedSlots: { customRender: "productName" }
      //   },
      //   {
      //     title: "相关应用",
      //     dataIndex: "apps",
      //     ellipsis: true,
      //     key: "apps",
      //     scopedSlots: { customRender: "apps" }
      //   },
      //   {
      //     title: "操作",
      //     key: "action",
      //     scopedSlots: { customRender: "action" }
      //   }
      // ],

      for (let index = 0; index < indexNameList.length; index++) {
        const element = indexNameList[index];
        let column = {}
        column.title = element
        column.dataIndex = indexCodeList[index]
        column.key = indexCodeList[index]
        this.columns.push(column)
      }

    console.log("this.columns ===",this.columns);

      console.log("dataList ===",dataList);
      this.dataList  = dataList
    },
    setColumnarAllData(array){

// const data = [
//   { country: '巴西', population: 18203 },
//   { country: '印尼', population: 23489 },
//   { country: '美国', population: 29034 },
//   { country: '印度', population: 104970 },
//   { country: '中国', population: 131744 },
// ];

// const chart = new Chart({
//   container: 'allUniqueData',
//   autoFit: true,
//   height: 500,
// });

// chart.data(data);
// chart.scale('population', { nice: true });
// chart.coordinate().transpose();
// chart.tooltip({
//   showMarkers: false
// });
// chart.interaction('active-region');
// chart.interval().position('country*population');
// chart.render();

        const data = array;
        // let  colHeight  = 100 *(data.length) + 100
         let colHeight = 0
      if (data) {
        if (data.length<5) {
          colHeight = 300
        }else {
         colHeight = 300 + 75*(data.length -4)
        }
      }else {
        colHeight = 300
      }
      if (this.columnarChart === null) {
        this.columnarChart = new Chart({
          container: "colNewUniqueData",
          autoFit: true,
          height: colHeight
        });
      }else {
        this.columnarChart.destroy()
        this.columnarChart = new Chart({
          container: "colNewUniqueData",
          autoFit: true,
          height: colHeight
        });
      }

      for (let index = 0; index < data.length; index++) {
        let element = data[index];
        element.label =  element.rateVal +"  (" +element.resultVal+")"
      }
      this.columnarChart.data(data);
      this.columnarChart.scale('resultVal', { nice: true });
        this.columnarChart.coordinate().transpose();
      this.columnarChart.tooltip({
        showMarkers: false
      });
    this.columnarChart.interaction('active-region');

    this.columnarChart.interval().position('channelName*resultVal').label('label',{
            offset: 10, // 文本距离图形的距离
            textStyle: {
              fill: '#404040',
              fontSize:'24',
              fontWeight: 'bold', // 文本粗细
              shadowBlur: 5, // 文本阴影模糊
              shadowColor: '#fff' // 阴影颜色
            },
        });

      this.columnarChart.render();
    },

    setAllData(array) {
      // const data = [
      //   { month: "Jan", city: "Tokyo", temperature: 7 },
      //   { month: "Jan", city: "London", temperature: 3.9 },
      //   { month: "Feb", city: "Tokyo", temperature: 6.9 },
      //   { month: "Feb", city: "London", temperature: 4.2 },
      //   { month: "Mar", city: "Tokyo", temperature: 9.5 },
      //   { month: "Mar", city: "London", temperature: 5.7 },
      //   { month: "Apr", city: "Tokyo", temperature: 14.5 },
      //   { month: "Apr", city: "London", temperature: 8.5 },
      //   { month: "May", city: "Tokyo", temperature: 18.4 },
      //   { month: "May", city: "London", temperature: 11.9 },
      //   { month: "Jun", city: "Tokyo", temperature: 21.5 },
      //   { month: "Jun", city: "London", temperature: 15.2 },
      //   { month: "Jul", city: "Tokyo", temperature: 25.2 },
      //   { month: "Jul", city: "London", temperature: 17 },
      //   { month: "Aug", city: "Tokyo", temperature: 26.5 },
      //   { month: "Aug", city: "London", temperature: 16.6 },
      //   { month: "Sep", city: "Tokyo", temperature: 23.3 },
      //   { month: "Sep", city: "London", temperature: 14.2 },
      //   { month: "Oct", city: "Tokyo", temperature: 18.3 },
      //   { month: "Oct", city: "London", temperature: 10.3 },
      //   { month: "Nov", city: "Tokyo", temperature: 13.9 },
      //   { month: "Nov", city: "London", temperature: 6.6 },
      //   { month: "Dec", city: "Tokyo", temperature: 9.6 },
      //   { month: "Dec", city: "London", temperature: 4.8 }
      // ];

      const data = array;
      if (this.chart === null) {
        this.chart = new Chart({
          container: "newUniqueData",
          autoFit: true,
          height: 300
        });
      }

      this.chart.data(data);
      this.chart.scale({
        day: {
          range: [0, 1]
        },
        resultVal: {
          nice: true
        }
      });

      this.chart.tooltip({
        showCrosshairs: true,
        shared: false
      });

      this.chart.axis("resultVal", {
        label: {
          formatter: val => {
            return val + "";
          }
        }
      });

      this.chart
        .line()
        .position("day*resultVal")
        .color("channelName")
        .shape("smooth");

      this.chart
        .point()
        .position("day*resultVal")
        .color("channelName")
        .shape("circle");

      // Step 4: 渲染图表
      this.chart.render();
    },

    getTopPageData(params){
      const data = this.handparams(params);
      httpService.getTopPageData(data).then(
        response => {
          if (+response.code === 200 && response.data) {
            if (response.data.records instanceof Array) {
              this.routeDataList = response.data.records;
              // this.indexList = array;
              // console.log("indexList====", this.indexList);
              
            } else {
              this.routeDataList = [];
            }
          } else {
            this.routeDataList = [];
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                "服务器未返回数据!"
            );
          }
        },
        response => {
          this.routeDataList = [];
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
    },

    getAllData(params, type) {
      const data = this.handparams(params);
      httpService.getAllData(data).then(
        response => {
            console.log("===",response.data)
          if (+response.code === 200 && response.data) {
            if (response.data instanceof Array) {
              this.data = response.data;
              console.log("===",response.data)
              // this.indexList = array;
              // console.log("indexList====", this.indexList);
              if (type === 1) {
                  
                this.setColumnarAllData(this.data);
              } else if (type === 2) {
                  
                this.setTableData(this.data);
              } else {
                 
                this.setAllData(this.data);
                // this.setTableData(this.data);
              }
            } else {


                console.log("else===",response.data.records)
              if (response.data.records instanceof Array) {
                  
                  if (type === 1) {
                      console.log("AllData===",response.data.records)
                    this.setColumnarAllData(response.data.records);
                }else {
                    this.setColumnarAllData([]);
                }
              }else {
                  this.setColumnarAllData([]);
              }

              
            }
          } else {
              
            if (type === 1) {
                 
                this.setColumnarAllData([]);
              } else if (type === 2) {
                  
                this.setTableData([]);
              } else {
                 
                this.setAllData([]);
                // this.setTableData([]);
              }
          }
        },
        response => {
          if (type === 1) {
                this.setColumnarAllData([]);
              } else if (type === 2) {
                this.setTableData([]);
              } else {
                this.setAllData([]);
                this.setTableData([]);
              }
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
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
.title-contet {
  width: auto;
  height: 56px;
}
.title-name {
  width: fit-content;
  width: -webkit-fit-content;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 56px;
}
.indexName {
  width: fit-content;
  width: -webkit-fit-content;
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
  margin-left: 40px;
  margin-top: 20px;
}
.indexValue {
  width: fit-content;
  width: -webkit-fit-content;
  height: 38px;
  font-size: 30px;
  font-family: HelveticaNeue;
  color: rgba(0, 0, 0, 0.85);
  line-height: 38px;
  margin-left: 40px;
}
.compared {
  width: fit-content;
  width: -webkit-fit-content;
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  margin-top: 8px;
  margin-left: 40px;
}
.desValue {
  width: fit-content;
  width: -webkit-fit-content;
  height: 22px;
  font-size: 14px;
  font-family: HelveticaNeue;
  color: rgba(82, 196, 26, 1);
  line-height: 22px;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparen;
  margin-left: 4px;
}
.acsValue {
  width: fit-content;
  width: -webkit-fit-content;
  height: 22px;
  font-size: 14px;
  font-family: HelveticaNeue;
  color: rgba(245, 34, 45, 1);
  line-height: 22px;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparen;
  margin-left: 4px;
}
</style>

