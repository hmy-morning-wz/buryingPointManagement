<template>
  <div class="contain_bg">
    <div style="background:rgba(255,255,255,1); ">
      <a-row>
        <a-col :span="24">
          <a-date-picker
            :defaultValue="moment(today, dateFormat)"
            :disabledDate="disabledEndDate"
            @change="onDateChange"
          />
          <a-button @click="downLoad(1)">导出折线图数据</a-button>
          <a-button @click="downLoad(2)">导出列表数据</a-button>
        </a-col>
        <a-col :span="24">
            <span class="title-name2">概览</span>
        </a-col>
        <a-col :span="24">
            <div style="width:auto;height:1px;background:rgba(233,233,233,1);"></div>
        </a-col>
         
        <a-col :span="6">
          <a-row style="text-align:center;">
            <a-col style="margin-top:20px;" :span="24">
                <span style="color: rgba(40, 143, 194, 1);">今日使用人数</span>
            </a-col>
             <a-col style="margin-top:20px;" :span="24">
                <span style="color: rgba(40, 143, 194, 1);">{{dataItem.userTodayVal || 0}}</span>
            </a-col>
            <a-col style="margin-top:20px;" :span="24">
                <span :class="dataItem.userIndex>=0?'acsValue':'desValue'">{{toPercent(dataItem.userIndex || 0) }}</span>
                <span>同比上周</span>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="6">
          <a-row  style="text-align:center;">
            <a-col style="margin-top:20px;" :span="24">
                <span >今日页面访问次数</span>
            </a-col>
             <a-col style="margin-top:20px;" :span="24">
                <span>{{dataItem.pageTodayVal || 0}}</span>
            </a-col>
            <a-col style="margin-top:20px;" :span="24">
                <span :class="dataItem.userIndex>=0?'acsValue':'desValue'">{{toPercent(dataItem.pageIndex || 0)}}</span>
                <span>同比上周</span>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <div id="pageCount" style="margin-right:24px;margin-top:24px;"></div>
        </a-col>
      </a-row>
      <div style="width:auto;height:2px;background:rgba(233,233,233,1);margin-top:24px;"></div>

      <!-- <a-row style="margin-top:24px;padding-bottom:24px;">
        <a-col :span="24" style="padding-bottom:24px;">
          <a-range-picker
            :defaultValue="[moment(defaultStartDay, dateFormat), moment(yesterDay, dateFormat)]"
            @change="onRange1Change"
          />
          <a-button>导出数据</a-button>
        </a-col>
        <a-col :span="24">
          <a-table
            :columns="columns"
            :dataSource="dataList"
            
            
          ></a-table>
        </a-col>
      </a-row>

       <div style="width:auto;height:2px;background:rgba(233,233,233,1);"></div> -->

      <a-row style="margin-top:24px;padding-bottom:24px;">
        <!-- <a-col :span="24" style="padding-bottom:24px;">
          <a-range-picker
            :defaultValue="[moment(defaultStartDay, dateFormat), moment(yesterDay, dateFormat)]"
            @change="onRange2Change"
          />
          <a-button>导出数据</a-button>
        </a-col> -->
        <a-col :span="24">
          <a-table
            :columns="columnsRoute"
            :dataSource="routeDataList"
            :pagination="pagination"
           @change="handleTableChange"
          ></a-table>
        </a-col>
      </a-row>

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
      pageTitle: "樱花节",
      dateFormat: "yyyy-MM-DD",
      indexList: [],
      today: "",
      defaultStartDay: "",
      pagination: {},
      data: [],
      chart: null,
      productId: null,
      searchParams: {
        productId: null,
        startDay: "",
        endDay: "",
        indexCode: ""
      },
      dataList:[],

      columns: [
        
      ],
      routeDataList:[],

      columnsRoute:[
          {
          title: "序号",
          dataIndex: "num",
          ellipsis: true,
          key: "num",
          scopedSlots: { customRender: "num" }
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

      dataItem:{},

      searchParams2: {
        productId: null,
        startDay: "",
        endDay: "",
        page:1,
        limit: 10,
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
      defaultStartDay.getTime() - 24 * 60 * 60 * 1000 * 7
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
   
    this.searchParams.date = this.today.replace(/-/g, "");
   

    this.searchParams2.productId = id
   this.searchParams2.startDay = this.today.replace(/-/g, "");
    this.searchParams2.endDay = this.today.replace(/-/g, "");

    this.getRealTimeTopData(this.searchParams);

    this.getRealTimeData(this.searchParams);

    this.getTopPageData(this.searchParams2);

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


    disabledEndDate(current) {
      //   const yesterDay = this.yesterDay;
      //   if (!endValue || !yesterDay) {
      //     return false;
      //   }
      
      return current && current > moment().endOf('day');
    },


     downLoad(type){
      let param = ""
        if (type === 1) {
            param =  this.searchParams
            param.url ="searchOnlineSearchSecond"
            
        }else if (type === 2) {
            param =  this.searchParams2
            param.url ="searchTopPageData"
        }
        this.export(param)
    },

    // 导出，参数上床
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

    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.searchParams2.page = pagination.current;
      this.getTopPageData(this.searchParams2);
    },

    onDateChange(date, dateString) {
      console.log(date, dateString);
      this.searchParams.date = dateString.replace(/-/g, "");

      this.searchParams2.startDay = dateString.replace(/-/g, "");
    this.searchParams2.endDay = dateString.replace(/-/g, "");

    this.getRealTimeTopData(this.searchParams);

    this.getRealTimeData(this.searchParams);

    this.getTopPageData(this.searchParams2);
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
          container: "pageCount",
          autoFit: true,
          height: 300
        });
      }

      this.chart.data(data);
      this.chart.scale({
        hour: {
          range: [0, 1]
        },
        val: {
          nice: true
        }
      });

      this.chart.tooltip({
        showCrosshairs: true,
        shared: true
      });

      this.chart.axis("val", {
        label: {
          formatter: val => {
            return val + "";
          }
        }
      });

      this.chart
        .line()
        .position("hour*val")
        .color("day")
        .shape("smooth");

      this.chart
        .point()
        .position("hour*val")
        .color("day")
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

              let num = 0
            if (response.data.total % response.data.size === 0) {
               num = response.data.size * (response.data.current -1) +1
            }else {
              num = response.data.size * (response.data.current -1) +1
            }
           
            console.log("num====",num)
            for (let index = 0; index < this.routeDataList.length; index++) {
              let element = this.routeDataList[index];
              element.num = num + index
            }

               const pagination = { ...this.pagination };
            // Read total count from server
            // pagination.total = data.totalCount;
            pagination.total = response.data.total || 0;
            pagination.pageSize = response.data.size || 10;
            console.log("total===", pagination.total);
            this.pagination = pagination;
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

    onRange1Change(dae,dateString) {
      
    },

    getRealTimeTopData(params) {
      const data = this.handparams(params);
      httpService.getRealTimeTopData(data).then(
        response => {
          if (+response.code === 200 && response.data) {
            this.dataItem = response.data
          } else {
            this.dataItem = {}
          }
        },
        response => {
          this.dataItem = {}
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
    },

    getRealTimeData(params) {
      const data = this.handparams(params);
      httpService.getRealTimeData(data).then(
        response => {
          if (+response.code === 200 && response.data) {
            if (response.data.records instanceof Array) {
              this.data = response.data.records;
              // this.indexList = array;
              // console.log("indexList====", this.indexList);
              
                this.setAllData(this.data);
              
            } else {
              this.setAllData([]);
            }
          } else {
            this.setAllData([]);
          }
        },
        response => {
          this.setAllData([]);
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
  color: rgba(71, 69, 69, 0.85);
  line-height: 56px;
}
.title-name2 {
  width: fit-content;
  width: -webkit-fit-content;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(70, 67, 67, 0.85);
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

