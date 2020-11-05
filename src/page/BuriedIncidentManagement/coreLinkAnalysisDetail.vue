<template>
  <div style="background:rgba(255,255,255,1);">
        
        <a-row>
          <a-col :span="24">
            <div >
              <a-tabs  defaultActiveKey="1">
                <a-tab-pane tab="漏斗" key="1">
                  <CoreLinkFunnel :coreId="coreId" :coreName="coreName"></CoreLinkFunnel>
                </a-tab-pane>
                <!-- forceRender -->
                <a-tab-pane tab="趋势" key="2" >
                    <CoreLinkTrend :coreId="coreId" :coreName="coreName"></CoreLinkTrend>
                </a-tab-pane>
              </a-tabs>
            </div>
          </a-col>
        </a-row>
      </div>
</template>
<script>

import CoreLinkTrend from '../../components/coreLinkTrend'
import CoreLinkFunnel from '../../components/coreLinkFunnel'

export default {
  
  data() {
    return {
      dateFormat: "yyyy-MM-DD",
      coreName:'',
      coreId:null,

      rules: {
        
      }
    };
  },
  created() {
    this.coreName = this.$route.query.coreName || "";
    console.log('details===coreName===',this.coreName)
    this.coreId = this.$route.query.coreId || "";
   
   

    // this.searchParams2.productId = id
    // this.searchParams2.startDay = this.defaultStartDay.replace(/-/g, "");
    // this.searchParams2.endDay = this.yesterDay.replace(/-/g, "");

    
  },
  mounted() {},
  components:{
      CoreLinkTrend,
      CoreLinkFunnel
  },
  methods: {

    getZeroString(num) {
      if (num < 10) {
        return "0" + num;
      } else {
        return "" + num;
      }
    },

    

    

    setAllData(array, index, type) {
      console.log("alldata===", array);
      const data = array;
      for (let index = 0; index < data.length; index++) {
        let element = data[index];
        element.convertRateString = element.convertRate + "%";
        element.convertRate = parseFloat(element.convertRate);
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
        shared: true
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
        .shape("smooth");

      this.chart[index].chart
        .point()
        .position("day*convertRate")
        .color("channelName")
        .shape("circle");

      // Step 4: 渲染图表
      this.chart[index].chart.render();
    },

    

    downLoad(type) {
      let param = this.searchParams;
      if (type === 1) {
        param.url = "searchProductData";
      }
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

</style>

