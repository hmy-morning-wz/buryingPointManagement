<template>
    <div class="activity-list">
        <div class="pl30 pt20">
            <div class="content">
                <el-row class="lh40 mt10">
                    <el-col :span="24">
                        <div class="float-left">
                            <el-date-picker
                                v-model="searchParams.startTime"
                                type="datetime"
                                placeholder="开始日期时间"
                                :picker-options="beginPickerOptions"
                                :editable="false"
                                class="w200"
                            ></el-date-picker>
                        </div>
                        <div class="float-left ml10">
                            <el-date-picker
                                v-model="searchParams.endTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                :picker-options="endPickerOptions"
                                :editable="false"
                            ></el-date-picker>
                        </div>
                        <div class="float-left ml10">活动类型</div>
                        <div class="float-left ml10">
                            <el-select v-model="searchParams.type" clearable placeholder="请选择">
                                <el-option
                                    v-for="(item,index) in activityList"
                                    :key="index"
                                    :label="item.activityTypeName"
                                    :value="item.activityTypeId"
                                ></el-option>
                            </el-select>
                        </div>
                        <div class="float-left ml10">
                            <el-button type="primary" @click="handleConfirm">搜索</el-button>
                        </div>
                          <div class="float-left ml20" style="margin-right: 30px">
                            <el-button type="primary" @click="handleAdd">新建</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="table">
                <div class="tableList">
                    <el-table :data="tableData">
                        <el-table-column prop="id" label="活动id" min-width="50" align="center"></el-table-column>
                        <el-table-column prop="typeStr" label="活动类型" min-width="50" align="center"></el-table-column>
                        <el-table-column
                            label="活动时间"
                            min-width="120"
                            show-overflow-tooltip
                            align="center"
                        >
                            <template slot-scope="scope" class="detail-content">
                                <span class="">{{scope.row.startTime}}</span>-
                                <span class="">{{scope.row.endTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="活动名称" min-width="50" align="center">
                            <template slot-scope="scope" class="detail-content">
                                <div class="detail-content">{{scope.row.name}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            label="活动状态"
                            min-width="50"
                            :formatter="formatReleaseStatus"
                            align="center"
                        ></el-table-column>
                        <el-table-column label="操作" min-width="80">
                            <template slot-scope="scope" style="text-align:center">
                                <div style="display:flex">
                                    <el-button type="text" @click="handleDetail(scope.row.id)">查看</el-button>
                                    <el-button
                                        type="text"
                                        @click="handleAudit"
                                        v-show="scope.row.needReview === 1"
                                    >审核</el-button>
                                    <el-button type="text" @click="handleEditor(scope.row.id)" v-show="scope.row.status === 1">修改</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="foot-page">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="searchParams.page"
                        :page-sizes="[10,20, 30, 50, 100]"
                        :page-size="searchParams.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalSize"
                    ></el-pagination>
                </div>
            </div>
        </div>
        <app-loading :loadingShow="loadingShow"></app-loading>
    </div>
</template>
<script>
import activityService from "../../../service/OperationManagement/activity";
import moment from "@/utils/moment";
import AppLoading from "../../OperationManagement/comm/loading.vue";

export default {
  data() {
    return {
      loadingShow: false,
      activityList: [
        {
          activityTypeId: "",
          activityTypeName: ""
        }
      ],
      tableData: [],
      searchParams: {
        status: "",
        startTime: "",
        endTime: "",
        page: 1,
        type: '',
        pageSize: 10
      },
      totalSize: 0
    };
  },
  created() {
    this.getTableList();
  },
  components: {
    AppLoading,
  },
  methods: {
    getTableList() {
      const data = this.handparams();
      activityService.getActivityList(data).then(
        response => {
          if (response.data instanceof Array) {
            this.tableData = response.data;
          } else {
            this.tableData = [];
          }
          this.totalSize = response.totalSize;
          console.log(response);
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
    // 确认
    handleConfirm() {
      this.searchParams.page = 1;
      this.getTableList();
    },
    // 跳转到详情
    handleDetail(id) {
      const router = `./viewDetail?id=${id}`;
      this.$router.push(router);
    },
    // 新建活动
    handleAdd() {
      const router = `./addActivity`;
      this.$router.push(router);
    },
    //跳转到审核
    handleAudit() {
      const router = `./auditList`;
      this.$router.push(router);
    },
    //需求修改
    handleEditor(id) {
      const router = `./editor?id=${id}`;
      this.$router.push(router);
    },
    formatReleaseStatus(row, column) {
      if (row.status == 1) {
        return "已创建";
      }
      if (row.status == 2) {
        return "进行中";
      }
      if (row.status == 3) {
        return "已结束";
      }
    },
    handleSizeChange(val) {
      this.searchParams.pageSize = val;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.searchParams.page = val;
      this.getTableList();
    },
    handparams() {
      const self = this;
      const params = JSON.parse(JSON.stringify(self.searchParams));
      for (const i in params) {
        if (params[i] === "") {
          delete params[i];
        }
      }
      if (params.startTime) {
        params.startTime = moment(params.startTime).formats();
      }
      if (params.endTime) {
        params.endTime = moment(params.endTime).formats();
      }
      return params;
    }
  },
  computed: {
    beginPickerOptions() {
      let self = this;
      return {
        disabledDate(time) {
          if (self.searchParams.endTime) {
            return time.getTime() > self.searchParams.endTime;
          }
        }
      };
    },
    endPickerOptions() {
      let self = this;
      return {
        disabledDate(time) {
          return time.getTime() < self.searchParams.startTime;
        }
      };
    }
  },
  watch: {
    loadingShow(val) {
      return val;
    }
  }
};
</script>

<style lang="scss" scoped>
.w200{
    width: 200px !important;
}
.bgcolor {
  color: #999 !important;
}
.activity-list {
  .table {
    margin: 20px 30px 10px 0;
    .foot-page {
      float: right;
      margin-top: 10px;
      margin-bottom: 30px;
    }
  }
  .detail-content {
    cursor: pointer;
    color: #20a0ff;
  }
}
</style>
