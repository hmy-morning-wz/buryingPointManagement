<template>
  <div class="contain_bg">
    <template>
      <div style="background:rgba(255,255,255,1);">
        <a-row class="mr20">
          <a-col :span="24">
            <span class="title">{{pageTitle}}</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <div>
              <a-tabs @change="topTabChange" :activeKey="activeKey">
                <a-tab-pane tab="访问分析" key="1">
                  <div class="contain_bg" style="padding-top:24px;">
                    <div class="content">
                      <div style="padding-left:24px;padding-right:24px;">
                        <div style="background:rgba(255,255,255,1);border-radius:2px;">
                          <a-row>
                            <a-col :span="24">
                              <span class="title-name">关键指标</span>
                              <a-button
                                style="float:right;margin-top:10px;"
                                @click="downLoad(0)"
                              >导出数据</a-button>
                              <a-date-picker
                                style="float:right;margin-top:10px;margin-right:16px;"
                                :defaultValue="moment(yesterDay, 'yyyy-MM-DD')"
                                :disabledDate="disabledEndDate"
                                @change="targetDateChange"
                              />
                            </a-col>
                          </a-row>
                          <div style="width:auto;height:1px;background:rgba(233,233,233,1);"></div>
                          <a-row type="flex">
                            <a-col v-for="(indexItem, index) in indexList" :key="index" :span="6">
                              <a-row style="position: relative;">
                                <a-col :span="24">
                                  <div>
                                    <span
                                      class="indexName"
                                      style="float:left;"
                                    >{{indexItem.indexName}}</span>
                                    <a-tooltip placement="top">
                                      <template slot="title">
                                        <span>{{indexItem.desc}}</span>
                                      </template>
                                      <a-icon
                                        style="float:right;margin-top:28px;margin-right:28px;"
                                        type="question-circle"
                                      />
                                    </a-tooltip>
                                  </div>
                                </a-col>
                                <a-col :span="24">
                                  <div class="flex" style="margin-top:4px;">
                                    <span class="indexValue">{{indexItem.index || 0}}</span>
                                  </div>
                                </a-col>
                                <a-col :span="24">
                                  <div class="flex" style="margin-top:12px;">
                                    <span class="compared">日环比</span>
                                    <a-icon
                                      v-if="indexItem.index2<0"
                                      style="margin-left:16px;"
                                      :style="{ fontSize: '16px', color: '#52C41A' }"
                                      type="arrow-down"
                                    ></a-icon>
                                    <a-icon
                                      v-else
                                      style="margin-left:16px;"
                                      :style="{ fontSize: '16px', color: '#F5222D' }"
                                      type="arrow-up"
                                    ></a-icon>
                                    <span
                                      :class="[indexItem.index2<0?'desValue':'acsValue']"
                                    >{{toPercentAbsolute(indexItem.index2)}}</span>
                                  </div>
                                </a-col>
                                <a-col :span="24">
                                  <div class="flex">
                                    <span class="compared">周同比</span>
                                    <a-icon
                                      v-if="indexItem.index3<0"
                                      style="margin-left:16px;"
                                      :style="{ fontSize: '16px', color: '#52C41A' }"
                                      type="arrow-down"
                                    ></a-icon>
                                    <a-icon
                                      v-else
                                      style="margin-left:16px;"
                                      :style="{ fontSize: '16px', color: '#F5222D' }"
                                      type="arrow-up"
                                    ></a-icon>
                                    <span
                                      :class="[indexItem.index3<0?'desValue':'acsValue']"
                                    >{{toPercentAbsolute(indexItem.index3)}}</span>
                                  </div>
                                </a-col>
                                <a-col :span="24">
                                  <div class="flex" style="margin-bottom:17px;">
                                    <span class="compared">月同比</span>
                                    <a-icon
                                      v-if="indexItem.index4<0"
                                      style="margin-left:16px;"
                                      :style="{ fontSize: '16px', color: '#52C41A' }"
                                      type="arrow-down"
                                    ></a-icon>
                                    <a-icon
                                      v-else
                                      style="margin-left:16px;"
                                      :style="{ fontSize: '16px', color: '#F5222D' }"
                                      type="arrow-up"
                                    ></a-icon>
                                    <span
                                      :class="[indexItem.index4<0?'desValue':'acsValue']"
                                    >{{toPercentAbsolute(indexItem.index4)}}</span>
                                  </div>
                                </a-col>

                                <div
                                  v-if="index !== 0 && index !== 1&& index !== 2&& index !== 3"
                                  style="width:auto;height:1px;background:rgba(233,233,233,1);"
                                ></div>
                                <div
                                  v-if="index !== 0 && index !== 4"
                                  style="position:absolute;width:1px;height:180px;background:rgba(233,233,233,1);"
                                ></div>
                              </a-row>
                            </a-col>
                          </a-row>

                          <!-- <div class="flex title-contet">
                              <div class="title-name">关键指标</div>
                              <a-button style="margin-right: 30px;justify-content: flex-end;margin-left:auto;margin-top:16px;">导出数据</a-button>
                          </div>-->
                        </div>
                      </div>
                    </div>

                    <div class="content" style="magin-top:24px;background: rgba(240, 242, 245, 1);">
                      <div
                        style="padding-left:24px;padding-right:24px; padding-top:24px; background:rgba(255,255,255,1);"
                      >
                        <div style="border-radius:2px;">
                          <a-row>
                            <a-col :span="24">
                              <a-tabs defaultActiveKey="1">
                                <a-tab-pane tab="全部" key="1">
                                  <ProductAnalysisAll :id="productId"></ProductAnalysisAll>
                                </a-tab-pane>
                                <a-tab-pane tab="总访问人数" key="2">
                                  <AllUniqueVisitor :id="productId"></AllUniqueVisitor>
                                </a-tab-pane>
                                <a-tab-pane tab="总访问次数" key="3">
                                  <AllVisitTimes :id="productId"></AllVisitTimes>
                                </a-tab-pane>
                                <a-tab-pane tab="新访问人数" key="4">
                                  <newUniqueVisitor :id="productId"></newUniqueVisitor>
                                </a-tab-pane>
                                <a-tab-pane tab="新访问次数" key="5">
                                  <NewVisitTimes :id="productId"></NewVisitTimes>
                                </a-tab-pane>
                                <a-tab-pane tab="实时数据" key="6">
                                  <RealTimeData :id="productId"></RealTimeData>
                                </a-tab-pane>
                              </a-tabs>
                            </a-col>
                          </a-row>
                          <div style="width:auto;height:1px;background:rgba(233,233,233,1);"></div>

                          <!-- <div class="flex title-contet">
                              <div class="title-name">关键指标</div>
                              <a-button style="margin-right: 30px;justify-content: flex-end;margin-left:auto;margin-top:16px;">导出数据</a-button>
                          </div>-->
                        </div>
                      </div>
                    </div>
                  </div>
                </a-tab-pane>
                <!-- forceRender -->
                <a-tab-pane tab="核心链路分析" key="2">
                  <CoreLinkAnalysis :id="productId" :pageTitle="pageTitle"></CoreLinkAnalysis>
                </a-tab-pane>
                <a-tab-pane tab="自定义分析" key="3">
                   <CoustomeAnalysis :id="productId" :pageTitle="pageTitle"></CoustomeAnalysis>
                </a-tab-pane>
              </a-tabs>
            </div>
          </a-col>
        </a-row>
      </div>
    </template>
  </div>
</template>
<script>
import httpService from "../../service/ProductAnalysist/httpService";
import moment from "moment";
import ProductAnalysisAll from "../../components/productAnalysisAll";
import RealTimeData from "../../components/realTimeData";
import AllUniqueVisitor from "../../components/allUniqueVisitor";
import AllVisitTimes from "../../components/allVisitTimes";
import NewVisitTimes from "../../components/newVisitTimes";
import newUniqueVisitor from "../../components/newUniqueVisitor";

import CoreLinkAnalysis from "../../components/coreLinkAnalysis";
import CoustomeAnalysis from "../../components/customeAnalysis"

import { Chart } from "@antv/g2";
export default {
  data() {
    return {
      pageTitle: "",
      defaultKey: "0",
      indexList: [],
      yesterDay: "",
      productId: null,
      searchParams: {
        productId: null,
        date: ""
      },
      activeKey: "1",

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
    const routeName = this.$route.name || "";
    const id = this.$route.query.id;
    this.activeKey = this.$route.query.activeKey || "1";
    this.pageTitle = this.$route.query.pageTitle;
    this.productId = id;
    if (this.activeKey === "2") {
    } else if (this.activeKey === "3") {
    } else {
      this.defaultKey = "1";
      let day1 = new Date();
      day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
      let s1 =
        day1.getFullYear() +
        this.getZeroString(day1.getMonth() + 1) +
        "" +
        this.getZeroString(day1.getDate());
      this.yesterDay =
        day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
      this.searchParams.productId = id;
      this.searchParams.date = s1;
      // this.getStatus();
      // this.getChannel();
      // this.getTableList();

      this.indexListInfo(this.searchParams);
    }
  },
  watch: {},
  components: {
    ProductAnalysisAll,
    RealTimeData,
    NewVisitTimes,
    newUniqueVisitor,
    AllUniqueVisitor,
    AllVisitTimes,
    CoustomeAnalysis,
    CoreLinkAnalysis
  },
  methods: {
    moment,

    getZeroString(num) {
      if (num < 10) {
        return "0" + num;
      } else {
        return "" + num;
      }
    },

    topTabChange(activeKey) {
      this.activeKey = activeKey;

      if (activeKey === "1") {
        console.log("defaultKey====", this.defaultKey);
        if (this.defaultKey === "1") {
        } else {
          this.defaultKey = "1";
          let day1 = new Date();
          day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
          let s1 =
            day1.getFullYear() +
            this.getZeroString(day1.getMonth() + 1) +
            "" +
            this.getZeroString(day1.getDate());
          this.yesterDay =
            day1.getFullYear() +
            "-" +
            (day1.getMonth() + 1) +
            "-" +
            day1.getDate();
          this.searchParams.productId = this.productId;
          this.searchParams.date = s1;
          // this.getStatus();
          // this.getChannel();
          // this.getTableList();

          this.indexListInfo(this.searchParams);
        }
      }
    },

    // 导出，参数上床
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

    indexListInfo(params) {
      const data = this.handparams(params);
      httpService.indexListInfo(data).then(
        response => {
          if (+response.code === 200 && response.data) {
            if (response.data instanceof Array) {
              const array = response.data;
              this.indexList = array;
              let desc = [
                "所选日期前30天内访问的用户",
                "所选日期访问用户",
                "所选日期访问次数",
                "所选日期第一次访问用户数",
                "T-1日内访问并在T日复访的用户占T-1日总体访问用户的比例",
                "T-7日内访问并在T-6至T日复访的用户占T-7日总体访问用户的比例",
                "T-15日内访问并在T-14至T日复访的用户占T-15日总体访问用户的比例",
                "所选日期，用户访问页面的总时长／总人数"
              ];
              for (let index = 0; index < this.indexList.length; index++) {
                let element = this.indexList[index];
                element.desc = desc[index];
                if (
                  element.indexName === "次日留存" ||
                  element.indexName === "7日留存" ||
                  element.indexName === "15日留存"
                ) {
                  element.index = this.toPercent(element.index);
                }
              }
              console.log("indexList====", this.indexList);
            } else {
              this.indexList = [];
            }
          } else {
            this.indexList = [];
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                "服务器未返回数据!"
            );
          }
        },
        response => {
          this.indexList = [];
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

    downLoad(type) {
      if (type === 0) {
        let param = this.searchParams;
        param.url = "indexListInfo";
        this.export(param);
      }
    },

    targetDateChange(date, dateString) {
      console.log(date, dateString);
      this.searchParams.date = dateString.replace(/-/g, "");
      console.log("date====", this.searchParams.date);
      this.indexListInfo(this.searchParams);
    },

    toPercentAbsolute(num) {
      if (num < 0) {
        num = -1 * num;
        return (Math.round(num * 10000) / 100).toFixed(2) + "%";
      } else {
        return (Math.round(num * 10000) / 100).toFixed(2) + "%";
      }
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

.ant-tabs-bar {
  margin: 0 0 0px 0;
  border-bottom: 1px solid #e8e8e8;
  outline: none;
  transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>

