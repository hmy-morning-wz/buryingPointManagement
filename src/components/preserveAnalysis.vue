<template>
  <div class="contain_bg">
    <div style="background:rgba(255,255,255,1); ">
      <a-row style="padding:14px;">
        <a-col :span="24" style="padding-bottom:24px;">
          <span class="title-name">用户留存</span>
        </a-col>
        <a-col :span="24" style="padding-bottom:24px;">
          <a-select
            style="width:200px;"
            showArrow
            placeholder="请选择指标"
            :default-value="1"
            optionFilterProp="children"
            @change="handleTargetChange"
          >
            <a-select-option
              v-for="(item ,index) in targetOptions"
              :key="index"
              :value="item.id"
            >{{item.targetName}}</a-select-option>
          </a-select>
          <a-button style="float:right;margin-right:20px;" @click="downLoad()">导出数据</a-button>
          <a-date-picker
            style="float:right;margin-right:20px;"
            :defaultValue="moment(yesterDay, dateFormat)"
            :disabledDate="disabledEndDate"
            @change="onRange1Change"
          />
        </a-col>

        <a-col :span="24">
          <a-spin :spinning="spinning">
          <a-table
            :columns="columnsRoute"
            :rowKey="record=>record.id"
            :dataSource="dataList"
            @change="handleTableChange1"
          >
            <div
              v-if="oneDayLater"
              class="bg-item"
              :style="choseBg(oneDayLater)"
              slot="oneDayLater"
              slot-scope="oneDayLater"
            >{{ oneDayLater }}</div>
            <div
              v-if="twoDayLater"
              class="bg-item"
              :style="choseBg(twoDayLater)"
              slot="twoDayLater"
              slot-scope="twoDayLater"
            >{{ twoDayLater }}</div>
            <div
              v-if="threeDayLater"
              class="bg-item"
              :style="choseBg(threeDayLater)"
              slot="threeDayLater"
              slot-scope="threeDayLater"
            >{{ threeDayLater }}</div>

            <div
              v-if="fourDayLater"
              class="bg-item"
              :style="choseBg(fourDayLater)"
              slot="fourDayLater"
              slot-scope="fourDayLater"
            >{{ fourDayLater }}</div>
            <div
              v-if="fiveDayLater"
              class="bg-item"
              :style="choseBg(fiveDayLater)"
              slot="fiveDayLater"
              slot-scope="fiveDayLater"
            >{{ fiveDayLater }}</div>
            <div
              v-if="sixDayLater"
              class="bg-item"
              :style="choseBg(sixDayLater)"
              slot="sixDayLater"
              slot-scope="sixDayLater"
            >{{ sixDayLater }}</div>
            <div
              v-if="sevenDayLater"
              class="bg-item"
              :style="choseBg(sevenDayLater)"
              slot="sevenDayLater"
              slot-scope="sevenDayLater"
            >{{ sevenDayLater }}</div>
          </a-table>
          </a-spin>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import httpService from "../service/ProductAnalysist/httpService";
import moment from "moment";
import { Chart } from "@antv/g2";
import { Loading } from "element-ui";
export default {
  props: {
    id: {
      type: String
    },
    eventId: {
      type: String
    }
  },
  data() {
    return {
      total: 0,
      pageTitle: "",
      spinning:false,
      dateFormat: "yyyy-MM-DD",

      yesterDay: "",
      today: "",
      defaultStartDay: "",
      defaultStartDay2: "",
      // defaultValue:[moment(this.defaultStartDay2, this.dateFormat), moment(this.today, this.dateFormat)],
      data: [],

      pagination: {},
      productId: null,
      searchParams: {
        productId: null,
        date: "",
        indexCode: ""
      },
      searchParams3: {
        productId: null,
        startDay: "",
        isAsc: false,
        endDay: "",
        indexCode: ""
      },
      dataList: [],

      tableKeys: [],
      tableData: [],
      routeDataList: [],

      targetOptions: [
        {
          id: 1,
          targetName: "新增账号"
        },
        {
          id: 2,
          targetName: "活跃用户"
        }
      ],
      columnsRoute: [
        {
          title: "日期",
          dataIndex: "day",
          ellipsis: true,
          key: "day",
          align: "center",
          scopedSlots: { customRender: "day" }
        },
        {
          title: "新增账号",
          dataIndex: "activeUser",
          ellipsis: true,
          key: "activeUser",
          align: "center",
          scopedSlots: { customRender: "activeUser" }
        },
        {
          title: "1日后",
          dataIndex: "oneDayLater",
          ellipsis: true,
          key: "oneDayLater",
          align: "center",
          scopedSlots: { customRender: "oneDayLater" }
        },
        {
          title: "2日后",
          dataIndex: "twoDayLater",
          ellipsis: true,
          key: "twoDayLater",
          align: "center",
          scopedSlots: { customRender: "twoDayLater" }
        },
        {
          title: "3日后",
          dataIndex: "threeDayLater",
          ellipsis: true,
          key: "threeDayLater",
          align: "center",
          scopedSlots: { customRender: "threeDayLater" }
        },
        {
          title: "4日后",
          dataIndex: "fourDayLater",
          ellipsis: true,
          key: "fourDayLater",
          align: "center",
          scopedSlots: { customRender: "fourDayLater" }
        },
        {
          title: "5日后",
          dataIndex: "fiveDayLater",
          ellipsis: true,
          key: "fiveDayLater",
          align: "center",
          scopedSlots: { customRender: "fiveDayLater" }
        },
        {
          title: "6日后",
          dataIndex: "sixDayLater",
          ellipsis: true,
          key: "sixDayLater",
          align: "center",
          scopedSlots: { customRender: "sixDayLater" }
        },
        {
          title: "7日后",
          dataIndex: "sevenDayLater",
          ellipsis: true,
          key: "sevenDayLater",
          align: "center",
          scopedSlots: { customRender: "sevenDayLater" }
        }
      ],

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
    let day2 = new Date();
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
    this.today =
      day2.getFullYear() +
      "-" +
      this.getZeroString(day2.getMonth() + 1) +
      "-" +
      this.getZeroString(day2.getDate());

   

    this.searchParams.productId = id;
    this.searchParams.date = this.yesterDay.replace(/-/g, "");
    this.searchParams.indexCode = "baoji_remain_user";

    this.checkTable();

    let gradient = this.gradientColor("#00CDED", "#000081", 100);

    console.log("gradient==", gradient);
    this.gradient = [];
    for (let index = 0; index < gradient.length; index++) {
      let element = gradient[index];
      element = "background:" + element + ";";
      this.gradient.push(element);
    }
    
  
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

    // select 范围选择
    handleTargetChange(value) {
      console.log(`selected ${value}`);
      this.currentValue = value;
      if (value === 1) {
        this.columnsRoute[1].title = "新增账号"
        this.searchParams.indexCode = "baoji_remain_user";
      } else if (value === 2) {
        this.columnsRoute[1].title = "活跃用户"
        this.searchParams.indexCode = "baoji_remain_utd";
      } else {
        this.columnsRoute[1].title = "新增账号"
        this.searchParams.indexCode = "baoji_remain_user";
      }
      this.checkTable();
    },

    resultTypeChange(e) {
      console.log("radio1 checked", e.target.value);
      this.tableForm.resultType = e.target.value;
      console.log("resultType===", this.tableForm.resultType);
      this.checkTable();
    },

    handleTableChange1(pagination, filters, sorter) {
      console.log("sorter===", sorter);

      if (sorter.columnKey === "day") {
        if (sorter.order === "ascend") {
          this.searchParams3.isAsc = true;
        } else {
          this.searchParams3.isAsc = false;
        }
      }

      this.getAllData(this.searchParams3, 2);

      // this.getTopPageData(this.searchParams);
    },

    handleSizeChange(val) {
      this.tableForm.pageSize = val;
      this.checkTable();
    },
    handleCurrentChange(val) {
      this.tableForm.pageNum = val;
      // console.debug('CurrentChange==',val)
      this.checkTable();
    },

    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.searchParams2.page = pagination.current;
      this.getTopPageData(this.searchParams2);
    },

    checkTable() {
      this.spinning = true;
      const data = this.searchParams;
      httpService.userSaveAnalysis(data).then(
        response => {
          console.log("table ===", response.data);

          if (+response.code === 200 && response.data) {
            this.spinning = false;
            if (response.data instanceof Array) {
              const array = response.data;
              let data = [];
              for (let index = 0; index < array.length; index++) {
                const ele = array[index];
                let a = {
                  id:index,
                  day: "",
                  activeUser: "",
                  oneDayLater: "",
                  twoDayLater: "",
                  threeDayLater: "",
                  fourDayLater: "",
                  fiveDayLater: "",
                  sixDayLater: "",
                  sevenDayLater: ""
                };
                for (let idx = 0; idx < ele.length; idx++) {
                  const element = ele[idx];
                  if (idx === 0) {
                    a.day = element.day || "";
                    a.activeUser = element.resultVal || "";
                  }
                  if (idx === 1) {
                    a.oneDayLater = element.rateVal || "";
                  }
                  if (idx === 2) {
                    a.twoDayLater = element.rateVal || "";
                  }
                  if (idx === 3) {
                    a.threeDayLater = element.rateVal || "";
                  }
                  if (idx === 4) {
                    a.fourDayLater = element.rateVal || "";
                  }
                  if (idx === 5) {
                    a.fiveDayLater = element.rateVal || "";
                  }
                  if (idx === 6) {
                    a.sixDayLater = element.rateVal || "";
                  }
                  if (idx === 7) {
                    a.sevenDayLater = element.rateVal || "";
                  }
                }

                data.push(a);
              }

              console.log("data===", data);
              this.dataList = data;
            } else {
              this.dataList = [];
            }
          } else {
            // alert(response.msg || '新增任务失败')
            this.spinning = false;
            this.dataList = [];
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                "查询事件失败!"
            );
          }
        },
        response => {
          this.spinning = false;
          this.$message.error(
            response.message ||
              response.subMsg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
    },

    downTable() {
      const data = this.tableForm;

      let loadingInstance = Loading.service({ fullscreen: true });
      httpService.downTable(data).then(
        response => {
          //console.debug('response===',response.data)
          console.log("===");
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
          if (+response.code === 200 && response.data) {
            this.downLoadExcel(response.data);
          } else {
            // alert(response.msg || '新增任务失败')
            this.$message.error(
              response.message || response.subMsg || response.msg || "下载失败!"
            );
          }
        },
        response => {
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
          this.$message.error(
            response.message ||
              response.subMsg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
    },
    // 下载表格
    downLoadExcel(key) {
      httpService.downLoadExcel(key);
    },

    downLoad() {
      let param = "";
      
        param = this.searchParams;
        param.url = "userSaveAnalysis";
     
      this.export(param);
    },

    onRange1Change(date, dateString) {
      let param = this.searchParams;
      param.date = dateString.replace(/-/g, "");

      this.checkTable();
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
      return (current && current > moment().subtract(1, "days")) || (current && current < moment().subtract(61, "days"));
    },

    toPercent(num) {
      return (Math.round(num * 10000) / 100).toFixed(2) + "%";
    },

    choseBg(percent) {
      if (percent) {
        try {
          if (percent.indexOf(".")) {
            percent = ~~percent.substring(0, percent.indexOf("."));
          }
          // if (percent<20) {
          //   percent = 0
          // }else if (percent<40) {
          //    percent = 1
          // }else if (percent<60) {
          //    percent = 2
          // }else if (percent<80) {
          //    percent = 3
          // }else if (percent<= 100) {
          //    percent = 4
          // }
          return this.gradient[percent];
        } catch (error) {
          return this.gradient[0];
        }
      }
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
    },

    gradientColor(startColor, endColor, step) {
      let startRGB = this.colorRgb(startColor); //转换为rgb数组模式
      let startR = startRGB[0];
      let startG = startRGB[1];
      let startB = startRGB[2];
      let endRGB = this.colorRgb(endColor);
      let endR = endRGB[0];
      let endG = endRGB[1];
      let endB = endRGB[2];
      let sR = (endR - startR) / step; //总差值
      let sG = (endG - startG) / step;
      let sB = (endB - startB) / step;
      var colorArr = [];
      for (var i = 0; i < step; i++) {
        //计算每一步的hex值
        var hex = this.colorHex(
          "rgb(" +
            parseInt(sR * i + startR) +
            "," +
            parseInt(sG * i + startG) +
            "," +
            parseInt(sB * i + startB) +
            ")"
        );
        colorArr.push(hex);
      }
      return colorArr;
    },
    colorRgb(sColor) {
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      var sColor = sColor.toLowerCase();
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
          var sColorNew = "#";
          for (var i = 1; i < 4; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
          }
          sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
          sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return sColorChange;
      } else {
        return sColor;
      }
    },
    colorHex(rgb) {
      var _this = rgb;
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      if (/^(rgb|RGB)/.test(_this)) {
        var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
          var hex = Number(aColor[i]).toString(16);
          hex = hex < 10 ? 0 + "" + hex : hex; // 保证每个rgb的值为2位
          if (hex === "0") {
            hex += hex;
          }
          strHex += hex;
        }
        if (strHex.length !== 7) {
          strHex = _this;
        }
        return strHex;
      } else if (reg.test(_this)) {
        var aNum = _this.replace(/#/, "").split("");
        if (aNum.length === 6) {
          return _this;
        } else if (aNum.length === 3) {
          var numHex = "#";
          for (var i = 0; i < aNum.length; i += 1) {
            numHex += aNum[i] + aNum[i];
          }
          return numHex;
        }
      } else {
        return _this;
      }
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
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
.title-name1 {
  width: fit-content;
  width: -webkit-fit-content;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  margin-left: 16px;
  color: rgba(0, 0, 0, 0.65);
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
.bg-item {
  width: 80px;
  font-size: 14px;
  font-family: HelveticaNeue;
  background: #004181;
  color: #fff;
  line-height: 22px;
  padding: 8px 0px;
  border-radius: 8px;
  text-align: center;
}
</style>

