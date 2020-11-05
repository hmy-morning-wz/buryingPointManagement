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
          <a-button @click="downLoad(1)">导出数据</a-button>
        </a-col>
        <a-col :span="24">
          <div id="allData" style="margin-right:24px;margin-top:24px;"></div>
        </a-col>
      </a-row>
      <div style="width:auto;height:2px;background:rgba(233,233,233,1);margin-top:24px;"></div>

      <a-row style="margin-top:24px;padding-bottom:24px;">
        <a-col :span="24" style="padding-bottom:24px;">
          <a-range-picker
            :defaultValue="[moment(defaultStartDay, dateFormat), moment(yesterDay, dateFormat)]"
            :disabledDate="disabledEndDate"
            @change="onRange1Change"
          />
          <a-button @click="downLoad(2)">导出数据</a-button>
        </a-col>
        <a-col :span="24">
          <a-table
            :columns="columns"
            :dataSource="dataList"
            @change="handleTableChange1"
            
          ></a-table>
        </a-col>
      </a-row>

       <div style="width:auto;height:2px;background:rgba(233,233,233,1);"></div>

      <a-row style="margin-top:24px;padding-bottom:24px;">
        <a-col :span="24" style="padding-bottom:24px;">
          <a-range-picker
            :defaultValue="[moment(defaultStartDay, dateFormat), moment(yesterDay, dateFormat)]"
            :disabledDate="disabledEndDate"
            @change="onRange2Change"
          />
          <a-button @click="downLoad(3)">导出数据</a-button>
        </a-col>
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
      yesterDay: "",
      defaultStartDay: "",
      data: [],
      chart: null,
      pagination: {},
      productId: null,
      searchParams: {
        productId: null,
        startDay: "",
        isAsc:true,
        endDay: "",
        indexCode: ""
      },
      searchParams3: {
        productId: null,
        startDay: "",
        isAsc:false,
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
    this.searchParams.indexCode = "visit_num,visit_cnt,add_num,add_cnt";

    this.searchParams2.productId = id
    this.searchParams2.startDay = this.defaultStartDay.replace(/-/g, "");
    this.searchParams2.endDay = this.yesterDay.replace(/-/g, "");

     this.searchParams3.productId = id;
    this.searchParams3.startDay = this.defaultStartDay.replace(/-/g, "");
    this.searchParams3.endDay = this.yesterDay.replace(/-/g, "");
    this.searchParams3.indexCode = "visit_num,visit_cnt,add_num,add_cnt";

    this.searchParams3.isAsc = false

    this.getAllData(this.searchParams, 1);
    this.getAllData(this.searchParams3, 2);


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

    handleTableChange1(pagination, filters, sorter) {
      console.log("sorter===",sorter);

      if (sorter.columnKey === "day") {
        if (sorter.order ===  "ascend") {
          this.searchParams3.isAsc = true
        }else {
          this.searchParams3.isAsc = false
        }
      }

      this.getAllData(this.searchParams3,2)

      // this.getTopPageData(this.searchParams);
    },

    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.searchParams2.page = pagination.current;
      this.getTopPageData(this.searchParams2);
    },



    downLoad(type){
      let param = ""
        if (type === 1) {
            param = this.searchParams
            param.url ="searchProductData"
            
        }else if (type === 2) {
          param = this.searchParams3
            param.url ="searchProductData"
        }else if (type === 3) {
          param = this.searchParams2
          param.url ="searchTopPageData"
        }
        this.export(param)
    },

    onRangeChange(date, dateString) {
      console.log(date, dateString);
      this.searchParams.startDay = dateString[0].replace(/-/g, "");
      this.searchParams.endDay = dateString[1].replace(/-/g, "");
      console.log("date====", this.searchParams.date);
      this.getAllData(this.searchParams, 1);
    },
    onRange1Change(datee,dateString) {
      let param = this.searchParams3
      param.startDay = dateString[0].replace(/-/g, "");
      param.endDay = dateString[1].replace(/-/g, "");
      this.getAllData(param, 2);
    },
     onRange2Change(date,dateString) {
      this.searchParams2.startDay = dateString[0].replace(/-/g, "");
      this.searchParams2.endDay = dateString[1].replace(/-/g, "");
      this.getTopPageData(this.searchParams2);
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
        a.day = element
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
    this.columns = []
      for (let index = 0; index < indexNameList.length; index++) {
        const element = indexNameList[index];
        let column = {}
        column.title = element
        column.dataIndex = indexCodeList[index]
        column.key = indexCodeList[index]
        this.columns.push(column)
      }
      let column = {
        title:"时间",
        sorter: true,
        dataIndex:"day",
        key:"day"
      }
      this.columns.unshift(column);

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
          container: "allData",
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
        shared: true
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
        .color("indexName")
        .shape("smooth");

      this.chart
        .point()
        .position("day*resultVal")
        .color("indexName")
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

    getAllData(params, type) {
      const data = this.handparams(params);
      httpService.getAllData(data).then(
        response => {
          if (+response.code === 200 && response.data) {
            if (response.data instanceof Array) {
              
              // this.indexList = array;
              // console.log("indexList====", this.indexList);
              if (type === 1) {
                this.setAllData(response.data);
              } else if (type === 2) {
                this.setTableData(response.data);
              } else {
                this.setAllData(response.data);
                this.setTableData(response.data);
              }
            } else {
              if (type === 1) {
                this.setAllData([]);
              } else if (type === 2) {
                this.setTableData([]);
              } else {
                this.setAllData([]);
                this.setTableData([]);
              }
            }
          } else {
            if (type === 1) {
                this.setAllData([]);
              } else if (type === 2) {
                this.setTableData([]);
              } else {
                this.setAllData([]);
                this.setTableData([]);
              }
          }
        },
        response => {
          if (type === 1) {
                this.setAllData([]);
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

