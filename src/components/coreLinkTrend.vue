<template>
  <div class="contain_bg" style="padding-top: 24px;">
    <a-row class="content" style="height:500px;">
      <a-col :span="24">
        <a-row>
          <a-col :span="24">
            <a-col :span="4">
              <span class="item_title">{{coreName}}</span>
            </a-col>
            <a-col style="text-align:right;line-height:53px;" :span="20">
              <!-- <a-date-picker
                :defaultValue="moment(yesterDay, dateFormat)"
                :disabledDate="disabledEndDate"
                @change="onDateChange"
              /> -->
              <a-range-picker
            :defaultValue="[moment(defaultStartDay, dateFormat), moment(yesterDay, dateFormat)]"
            :disabledDate="disabledEndDate"
            @change="onRangeChange"
          />
              <a-button style="margin-right:24px;" @click="downLoad()">导出数据</a-button>
            </a-col>
          </a-col>
          <a-col :span="24">
            <div style="width:auto;height:1px;background:rgba(233,233,233,1);"></div>
          </a-col>
          <a-col style="padding-top: 24px;" :span="24">
            <span class="convertRate_title">转化率</span>
          </a-col>
          <a-col style="padding-top: 8px;" :span="24">
            <span class="convertRate_value">{{convertRate}}</span>
          </a-col>
          <a-col :span="24">
            <div id="coreTrend" style="margin-right:24px;margin-top:24px;"></div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import httpService from "../service/CoreLinkAnalysis/httpService";
import DataSet from "@antv/data-set";
import moment from "moment";
import { Chart } from "@antv/g2";

export default {
  data() {
    return {
      dateFormat: "yyyy-MM-DD",
      yesterDay: "",
      convertRate: "",
      searchParams: {},
      chart:null,
      rules: {}
    };
  },
  props: {
    coreId: {
      type: String
    },
    coreName: {
      type: String
    }
  },
  created() {
    console.log("coreName====", this.coreName);
    let day1 = new Date();
    day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
    let defaultStartDay = new Date();
    defaultStartDay.setTime(
      defaultStartDay.getTime() - 24 * 60 * 60 * 1000 * 14
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
    this.searchParams.coreId = this.coreId;
    this.searchParams.startDay = this.defaultStartDay.replace(/-/g, "");
    this.searchParams.endDay = this.yesterDay.replace(/-/g, "");

    // this.searchParams2.productId = id
    // this.searchParams2.startDay = this.defaultStartDay.replace(/-/g, "");
    // this.searchParams2.endDay = this.yesterDay.replace(/-/g, "");

    this.getTrendData(this.searchParams);
  },
  mounted() {},
  components: {},
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

      return current && current > moment().subtract(1, "days");
    },

    onRangeChange(date, dateString) {
      console.log(date, dateString);
      this.searchParams.startDay = dateString[0].replace(/-/g, "");
      this.searchParams.endDay = dateString[1].replace(/-/g, "");
      console.log("date====", this.searchParams.date);
      this.getTrendData(this.searchParams);
    },

    getTrendData(params) {
      const data = this.handparams(params);
      httpService.getTrendData(data).then(
        response => {
          console.log("esponse.data===", response.data);
          if (+response.code === 200 && response.data) {
           if (response.data.convertRate) {
              this.convertRate = this.toPercent(parseFloat(response.data.convertRate)) ;
            }else {
               this.convertRate ="0.00%"
            }
            this.data = response.data.datas || [];
            console.log("this.data====", this.data);
            this.setAllData(this.data);
          } else {
            this.setAllData([]);
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                "获取数据失败!"
            );
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

    setAllData(array) {
      
        const data = array;

        for (let index = 0; index < data.length; index++) {
        let element = data[index];
        element.convertRateString = this.toPercent(parseFloat(element.convertRate));
        element.convertRate = parseFloat(element.convertRate) *100;
      }
        console.log('data=====',data)
        if (this.chart === null) {
          this.chart = new Chart({
            container: "coreTrend",
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
          shared: true,
          //  itemTpl: '<li><span  class="g2-tooltip-marker"></span>{name}: {value}</li>'//定义标头
        });

        this.chart.axis("convertRate", {
          label: {
            formatter: val => {
              return val + "%";
            }
          }
        });

        this.chart
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

        this.chart
          .point()
          .position("day*convertRate")
          .color("channelName")
          .shape("circle")
          

          

        // Step 4: 渲染图表
        this.chart.render();
    },

    downLoad() {
      let param = this.searchParams;
     
    param.url = "searchCoreLinkTrendData";
     
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
.convertRate_title {
  width: fit-content;
  width: -webkit-fit-content;
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
  margin-left: 32px;
}
.convertRate_value {
  width: fit-content;
  width: -webkit-fit-content;
  height: 32px;
  font-size: 24px;
  font-family: HelveticaNeue;
  color: rgba(0, 0, 0, 0.85);
  line-height: 32px;
  margin-left: 32px;
}
</style>

