<template>
  <div class="contain_bg" style="padding-top: 24px;">
    <a-row class="content" style="height:-webkit-fit-content;height:fit-content;padding-bottom:20px;">
      <a-col :span="24">
        <a-row>
          <a-col :span="24">
            <a-col :span="4">
              <span class="item_title">{{coreName}}</span>
            </a-col>
            <a-col style="text-align:right;line-height:53px;" :span="20">
              <a-date-picker
                :defaultValue="moment(yesterDay, dateFormat)"
                :disabledDate="disabledEndDate"
                @change="onDateChange"
              />
              <a-button style="margin-right:24px;" @click="downLoad()">导出数据</a-button>
            </a-col>
          </a-col>
          <a-col :span="24">
            <div style="width:auto;height:1px;background:rgba(233,233,233,1);"></div>
          </a-col>
          <a-col style="padding-top: 24px;" :span="24">
            <span class="convertRate_title">总转化率</span>
          </a-col>
          <a-col style="padding-top: 8px;" :span="24">
            <span class="convertRate_value">{{convertRate?toPercent(parseFloat(convertRate)):'0.00%' }}</span>
          </a-col>
          <a-col :span="24" >
            <div id="coreFunnel" style="margin-top:24px;"></div>
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
      chart: null,
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
    this.searchParams.coreId = this.coreId;
    this.searchParams.date = this.yesterDay.replace(/-/g, "");

    // this.searchParams2.productId = id
    // this.searchParams2.startDay = this.defaultStartDay.replace(/-/g, "");
    // this.searchParams2.endDay = this.yesterDay.replace(/-/g, "");

    this.getFunnelData(this.searchParams);
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

    onDateChange(date, dateString) {
      console.log(date, dateString);
      this.searchParams.date = dateString.replace(/-/g, "");

      this.getFunnelData(this.searchParams);
    },

    getFunnelData(params) {
      const data = this.handparams(params);
      httpService.getFunnelData(data).then(
        response => {
          console.log("esponse.data===", response.data);
          if (+response.code === 200 && response.data) {
            if (response.data.convertRate) {
              this.convertRate = response.data.convertRate ;
            }else {
               this.convertRate ="0.00%"
            }
            
            this.data = response.data.linksDatas || [];
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
      
      //   array = a
      let channels = [];
      let channelIds = [];
      let data = [];
      for (let index = 0; index < array.length; index++) {
        let element = array[index];
        let item = {};
        item.State = element.eventName + "\n第" + element.sortNum + "步";
        item.title = element.eventName + "  第" + element.sortNum + "步";
        console.log("compareRate===", element.compareRate);
        console.log("parseFloat===", parseFloat(element.compareRate));
        item.label =
          "转化率  " +
          this.toPercent(parseFloat(element.convertRate)) +
          "  较前日 " +
          this.toPercent(parseFloat(element.compareRate));
        // item.compareRate = this.toPercent(parseFloat(item.compareRate))
        for (let idx = 0; idx < element.datas.length; idx++) {
          const ele = element.datas[idx];
          item[ele.channelName] = ele.resultVal;
          if (channelIds.indexOf(ele.channelId) > -1) {
          } else {
            channelIds.push(ele.channelId);
            if (channels.indexOf(ele.channelName) > -1) {
              channels.push(ele.channelName + idx);
            } else {
              channels.push(ele.channelName);
            }
          }
        }
        data.push(item);
      }


        // 漏斗数据补 0
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        let currentChannelIds = [];
        let currentChannelNames = [];
        for (let idx = 0; idx < element.datas.length; idx++) {
          const ele = element.datas[idx];

          if (currentChannelIds.indexOf(ele.channelId) > -1) {
          } else {
            currentChannelIds.push(ele.channelId);
            currentChannelNames.push(ele.channelName);
          }
        }
        console.log("channelIds===", channelIds);
        console.log("currentChannelIds===", currentChannelIds);
        for (let idx = 0; idx < channelIds.length; idx++) {
          const ele = channelIds[idx];
          if (currentChannelIds.indexOf(ele) > -1) {
          } else {
            console.log("channels[idx]===", channels[idx]);
            data[index][channels[idx]] = 0;
          }
        }
        console.log("===========================");
      }

      console.log("a====", array);
      console.log("data====", data);
      console.log("channels====", channels);

      //     const data = [
      //   { State: 'WY', 小于5岁: 25635, '5至13岁': 1890, '14至17岁': 9314 },
      //   { State: 'DC', 小于5岁: 30352, '5至13岁': 20439, '14至17岁': 10225 },
      //   { State: 'VT', 小于5岁: 38253, '5至13岁': 42538, '14至17岁': 15757 },
      //   { State: 'ND', 小于5岁: 51896, '5至13岁': 67358, '14至17岁': 18794 },
      //   { State: 'AK', 小于5岁: 72083, '5至13岁': 85640, '14至17岁': 22153 },
      // ];
      if (channels.length === 0) {
        channels.push("");
      }
      data.reverse()
      const ds = new DataSet();
      const dv = ds.createView().source(data);
      dv.transform({
        type: "fold",
        fields: channels, // 展开字段集
        key: "channelName", // key字段
        value: "resultVal", // value字段
        retains: ["State", "label","title"] // 保留字段集，默认为除fields以外的所有字段
      });

      let colHeight = 0
      if (data) {
        if (data.length<5) {
          colHeight = 310
        }else {
         colHeight = 310 + 77.5*(data.length -4)
        }
      }else {
        colHeight = 310
      }

      // 数据被加工成 {State: 'WY', 年龄段: '小于5岁', 人口数量: 25635}
      if (this.chart === null) {
        this.chart = new Chart({
          container: "coreFunnel",
          autoFit: true,
          height: colHeight
        });
      }else {
        this.chart.destroy()
        this.chart = new Chart({
          container: "coreFunnel",
          autoFit: true,
          height: colHeight
        });

      }

      this.chart.coordinate().transpose();

      this.chart.data(dv.rows);
      this.chart.scale("resultVal", { nice: true });

      this.chart.axis("State", {
        label: {
          offset: 12
        }
      });
      //   this.chart.axis("label", {
      //       label: {
      //       offset: 120
      //     }
      //   })

      this.chart.tooltip({
        shared: false,
        // itemTpl: '<li><span  class="g2-tooltip-marker"></span>{name}: {value}</li>',//定义标头
        showMarkers: false
      });

      

      this.chart
        .interval()
        // .adjust("stack")
       
        .position("State*resultVal")
        // .color("channelName")
        .label("label", {
          offset: 10, // 文本距离图形的距离
          position:1000,
          textStyle: {
            fill: "#404040",
            fontSize: "24",
            fontWeight: "bold", // 文本粗细
            shadowBlur: 5, // 文本阴影模糊
            shadowColor: "#fff" // 阴影颜色
          }
        })
       
        

        this.chart
        .interval()
        .adjust("stack")
        .position("State*resultVal")
        .color("channelName")
        .tooltip('State*resultVal*channelName*title', function (State, resultVal, channelName,title) {
          return {
              title:title,
              name: channelName,//itemTpl:{name}
              value: resultVal// itemTpl:{value}
          }
        })

      // this.chart
      // .interval()
      // .adjust("stack")
      // .position("State*resultVal")
      // .label('label',{
      //     offset: 50, // 文本距离图形的距离
      //     textStyle: {
      //       fill: '#404040',
      //       fontSize:'24',
      //       fontWeight: 'bold', // 文本粗细
      //       shadowBlur: 5, // 文本阴影模糊
      //       shadowColor: '#fff' // 阴影颜色
      //     },
      // })

      

      this.chart.interaction("active-region");

      this.chart.render();

      //   const data = array;
      //   console.log('data=====',data)
      //   if (this.chart === null) {
      //     this.chart = new Chart({
      //       container: "coreFunnel",
      //       autoFit: true,
      //       height: 300
      //     });
      //   }

      //   this.chart.data(data);
      //   this.chart.scale({
      //     hour: {
      //       range: [0, 1]
      //     },
      //     val: {
      //       nice: true
      //     }
      //   });

      //   this.chart.tooltip({
      //     showCrosshairs: true,
      //     shared: true
      //   });

      //   this.chart.axis("val", {
      //     label: {
      //       formatter: val => {
      //         return val + "";
      //       }
      //     }
      //   });

      //   this.chart
      //     .line()
      //     .position("hour*val")
      //     .color("day")
      //     .shape("smooth");

      //   this.chart
      //     .point()
      //     .position("hour*val")
      //     .color("day")
      //     .shape("circle");

      //   // Step 4: 渲染图表
      //   this.chart.render();
    },

    downLoad() {
      let param = this.searchParams;

      param.url = "searchCoreLinkFunnelPlotResult";

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

