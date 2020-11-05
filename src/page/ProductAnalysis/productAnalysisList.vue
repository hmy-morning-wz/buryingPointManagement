<template>
  <div class="contain_bg">
    <template>
      <div style="background:rgba(255,255,255,1);">
        <a-row class="mr20">
          <a-col :span="24">
            <span class="title">产品分析</span>
            <a-button
              style="margin-right: 30px;float:right;margin-top:16px;"
              type="primary"
              @click="newAdd()"
            >新增</a-button>
          </a-col>
        </a-row>
      </div>
      <div class="content">
        <div style="margin-top:20px;padding:24px;">
          <a-table
            :columns="columns"
            :dataSource="labelDataTable"
            :pagination="pagination"
            @change="handleTableChange"
          >
            <!-- @selection-change="handleSelectionChange"
            @sort-change="handleSortChang"-->
            <!-- <a prop="categoryCode" label="分类编码" min-width="80" align="center"></a> -->
            <span slot="productName" slot-scope="productName,record">
              <!-- <a-button type="link">{{productName}}</a-button> -->
              <span class="textSpan"  @click="labelCheck(record)">{{productName}}</span>
             
            </span>
            <span slot="apps" slot-scope="apps">
              <a-tooltip placement="topLeft">
                <!--弹出框的 -->
                <template slot="title">
                  <span
                    v-for="(app ,index) in apps"
                    :key="index"
                  >{{ apps.length-1 === index ? app.appName :app.appName +'/' }}</span>
                </template>
                <span
                  v-for="(app ,index) in apps"
                  :key="index"
                >{{ apps.length-1 === index ? app.appName :app.appName +'/' }}</span>
              </a-tooltip>
            </span>
            <span slot="channels" slot-scope="channels">
              <a-tooltip placement="topLeft">
                <!--弹出框的 -->
                <template slot="title">
                  <span
                    v-for="(channel ,index) in channels"
                    :key="index"
                  >{{ channels.length-1 === index ? channel.channelLabel :channel.channelLabel +'/' }}</span>
                </template>
                <span
                  v-for="(channel ,index) in channels"
                  :key="index"
                >{{ channels.length-1 === index ? channel.channelLabel :channel.channelLabel +'/' }}</span>
              </a-tooltip>
            </span>
            <span slot="action" slot-scope="action">
              <a @click="delClick(action)">删除</a>
              <a-divider type="vertical" />
              <a @click="labelCheck(action)">查看</a>
              <a-divider type="vertical" />
              <a @click="labelUpdate(action)">编辑</a>
            </span>
          </a-table>

          <a-modal
            title="删除"
            :visible="delVisible"
            @ok="handleDelOk"
            :confirmLoading="confirmLoading"
            @cancel="delCancel"
          >
            <p>{{ delText }}</p>
          </a-modal>

          <a-modal
            :title="dialogTitle"
            v-model="dialogVisible"
            @ok="submitForm"
            @cancel="cancel"
            okText="确认"
            cancelText="取消"
          >
            <template>
              <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                <a-form-item label="选择应用（可多选）：">
                  <a-select
                    mode="multiple"
                    :disabled="disabled"
                    v-decorator="[
          'apps',
          {     
              rules: [{ required: true, message: '请选择应用！',type: 'array' }] },
        ]"
                    placeholder="请选择应用"
                    @change="handleSelectChange"
                    showArrow
                    optionFilterProp="children"
                  >
                    <a-select-option
                      v-for="(app ,index) in appsOptions"
                      :key="index"
                      :value="app.id"
                    >{{app.appName}}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="产品名称：">
                  <a-input
                   :disabled="disabled"
                    v-decorator="['productName', { rules: [{ required: true, message: '请输入产品名称!' }] }]"
                    :maxLength= 20
                    placeholder="请输入产品名称"
                  />
                </a-form-item>
                <a-form-item label="渠道标签：">
                  <a-select
                    mode="multiple"
                    v-decorator="['channels',{ rules: [{ required: false, message: '请选择渠道标签！' }] }]"
                    placeholder="请选择渠道标签"
                    optionFilterProp="children"
                    showArrow
                    @change="handleChannelChange"
                    :maxTagCount= 1
                  >
                    <a-select-option
                      v-for="(channel ,index) in channelsOptions"
                      :key="index"
                      :value="channel.id"
                    >{{channel.channelLabel}}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="描述：">
                  <a-textarea
                    autoSize
                    v-decorator="['productDesc', { rules: [{ required: false, message: '请输入描述!' }] }]"
                    placeholder="请输入描述"
                  />
                </a-form-item>
              </a-form>
            </template>
          </a-modal>
          <!-- <el-drawer
            title="变量详情"
            :visible.sync="drawer"
            :direction="direction"
            size="70%"
            @closed="closed()"
            :wrapperClosable="true"
          >
            <template>
              <div style="overflow-x:scroll;height:100%;">
                <el-scrollbar style="height:100%;">
                  <template>
                    <div style=" display:flex; margin-top:10px; ">
                      <el-form
                        style="margin:auto;"
                        ref="tableForm"
                        label-width="120px"
                        :model="tableForm"
                        :rules="rules"
                      >
                        <el-form-item label="变量名称：" prop="variName">
                          <el-input
                            :disabled="limit"
                            placeholder="变量名称"
                            v-model="tableForm.variName"
                            class="w240 mr20"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="标识符：" prop="identifyName">
                          <el-input
                            :disabled="disable"
                            placeholder="标识符"
                            v-model="tableForm.identifyName"
                            class="w240 mr20"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="类型：" prop="variType">
                          <el-select
                            v-model="tableForm.variType"
                            clearable
                            :disabled="disable"
                            class="w240"
                          >
                            <el-option
                              v-for="item in typeOptions"
                              :key="item.id"
                              :label="item.label"
                              :value="item.id"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="描述：" prop="descr">
                          <el-input
                            :disabled="limit"
                            placeholder="描述"
                            type="textarea"
                            v-model="tableForm.descr"
                            class="w500 mr20"
                          ></el-input>
                        </el-form-item>

                        <el-form-item v-if="!disable || !limit">
                          <el-button type="primary" @click="submitForm('tableForm')" class="mt20">提交</el-button>
                          <el-button @click="cancel()">取消</el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                  </template>
                </el-scrollbar>
              </div>
            </template>
          </el-drawer>-->
        </div>
        <!-- <div class="foot-page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchParams.page"
            :page-sizes="[10,20, 30, 50, 100]"
            :page-size="searchParams.limit"
            layout="total, prev, pager,next,sizes,jumper "
            :total="total"
          ></el-pagination>
        </div>-->
      </div>
    </template>
  </div>
</template>
<script>
import httpService from "../../service/ProductAnalysisList/httpService";

export default {
  data() {
    return {
      direction: "rtl",
      drawer: false,
      title: "",
      disable: false,
      limit: false,
      routeName: "",
      canCommit: true,
      pagination: {},
      dialogTitle: "新增产品分析",
      dialogVisible: false,
      delVisible: false,
      detail:{},
      appsOptions: [],
      confirmLoading: false,
      delText: "是否确认需要删除",
      defaultChannelValues:[],
      channelsOptions: [],
      columns: [
        {
          title: "序号",
          dataIndex: "num",
          ellipsis: true,
          key: "num",
          scopedSlots: { customRender: "num" }
        },
        {
          title: "产品名称",
          dataIndex: "productName",
          ellipsis: true,
          key: "productName",
          scopedSlots: { customRender: "productName" }
        },
        {
          title: "相关应用",
          dataIndex: "apps",
          ellipsis: true,
          key: "apps",
          scopedSlots: { customRender: "apps" }
        },
        {
          title: "渠道标签",
          dataIndex: "channels",
          ellipsis: true,
          key: "channels",
          scopedSlots: { customRender: "channels" }
        },
        {
          title: "描述",
          dataIndex: "productDesc",
          ellipsis: true,
          key: "productDesc",
          scopedSlots: { customRender: "productDesc" }
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      typeOptions: [
        {
          id: 1,
          label: "字符串"
        },
        {
          id: 2,
          label: "整数"
        },
        {
          id: 3,
          label: "小数"
        }
      ],
      formLayout: "horizontal",
      form: this.$form.createForm(this, {}),
      tableForm: {},
      showSort: false,
      cityList: [],
      multipleSelection: [],
      selectedIDs: [],

      noList: [],

      searchParams: {
        // event_name: '',
        // operator: '',
        // orderByField: '',
        // status: '',
        // gmtCreate: '',
        // isAsc: '',
        page: 1,
        limit: 10
        // type: 'page'
      },
      statusChangeParams: {
        categoryId: 0,
        categoryStatus: 0
      },
      labelDataTable: [],
      total: 0,
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
    // this.getStatus();
    // this.getChannel();
    this.getTableList();
  },
  watch: {
    // searchParams(val, oldVal) {
    //   //普通的watch监听
    //   console.log("a: " + val, oldVal);
    // }
  },
  components:{
     
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.searchParams.page = pagination.current;
      this.getTableList();
    },
    // 应用选择
    handleSelectChange(value) {
      console.log(value);
    },
    handleChannelChange(value) {},
    newAdd() {
      (this.form = this.$form.createForm(this, {})),
        (this.dialogVisible = true);
      //   this.limit = false;
      //   this.disable = false;
      this.routeName = "addProductAnalysis";
      this.getAppList();
      this.getChannelsList();
    },

    // 获取渠道列表
    getChannelsList() {
      // this.channelsOptions = [];
      this.defaultChannelValues = []
      return httpService.getChannelsList().then(
        response => {
          if (+response.code === 200 && response.data) {
            if (response.data instanceof Array) {
              const array = response.data;
              this.channelsOptions = array;
              // for (let index = 0; index < array.length; index++) {
              //   const element = array[index];
              //   this.defaultChannelValues.push(element.id)
              // }
                
            this.form.setFieldsValue({"channels":this.defaultChannelValues});
              console.log("defaultChannelValues",this.defaultChannelValues);
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

    // 获取应用列表
    getAppList() {
      // this.appsOptions = [];
      return httpService.getAppList().then(
        response => {
          if (+response.code === 200 && response.data) {
            if (response.data instanceof Array) {
              const array = response.data;
              this.appsOptions = array;
              console.log("getAppList");
            } else {
              this.appsOptions = [];
            }
          } else {
            this.appsOptions = [];
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                "服务器未返回数据!"
            );
          }
        },
        response => {
          this.appsOptions = [];
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              "请求服务器失败!"
          );
        }
      );
    },

    closed() {
      console.log("closed======");
      this.canCommit = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log("multipleSelection", this.multipleSelection);
      let ids = [];
      let orderNos = [];
      this.multipleSelection.map(item => {
        ids.push(item);
        orderNos.push(item.id);
      });
      this.selectedIDs = ids;
      this.noList = orderNos;
      console.log("多选", this.selectedIDs);
    },

    handleSortChang({ column, prop, order }) {
      console.log(
        "column====",
        column + "prop===" + prop + "order====" + order
      );
      if (prop) {
        this.searchParams.orderByField = this.toLine(prop);
      } else {
        this.searchParams.orderByField = "";
      }

      if (order && order === "ascending") {
        this.searchParams.isAsc = true;
      } else if (order && order === "descending") {
        this.searchParams.isAsc = false;
      } else {
        this.searchParams.isAsc = "";
      }
      this.getTableList();
    },

    handleDelOk() {
      this.delData(this.detail.id);
    },

    delClick(value) {
      // debugger
      // this.detail.id = value.id;
      this.delVisible = true;
      this.detail.id = value.id;
    },
    delCancel() {
      this.delVisible = false;
    },

    // 删除
    delData(value) {
      httpService.deleteEventVariable(value).then(
        response => {
          if (response.code) {
            if (+response.code === 200) {
              if (this.labelDataTable.length === 1) {
                this.searchParams.page = this.searchParams.page - 1;
              }
              this.delVisible = false;
              this.getTableList();
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

    //点击搜索
    searchClick() {
      // console.debug('搜索点击')
      this.searchParams.page = 1;
      this.getTableList();
    },

    // 编辑
    labelUpdate(value) {
       (this.form = this.$form.createForm(this, {})),
        (this.dialogVisible = true);
      //   this.limit = false;
      //   this.disable = false;
      this.routeName = "updateProductAnalysis";
      this.dialogTitle = "编辑产品分析"
      this.disabled  = true
      this.getAppList();
      this.getChannelsList();
      this.getDetails(value.id);
    },

    // 查看
    labelCheck(value) {
      // console.debug('id===',row.id)
      (this.form = this.$form.createForm(this, {})),
        console.log("id=====", value);
      this.detail.id = value.id;
      // this.dialogVisible = true;
      this.routeName = "checkProductAnalysis";

      this.$router.push({ path: "/productAnalysis",query:{id:value.id +"",pageTitle:value.productName}});
      // this.getChannelsList();
      // this.getAppList();
      // console.log("await==");
      // this.getDetails(value.id);
    },

    submitForm(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form ====: ", values);
          this.commitInfo(values);
        }
      });

      //   if (this.canCommit) {
      //     this.canCommit = false;
      //     this.$refs[formName].validate(valid => {
      //       if (valid) {
      //         this.commitInfo();
      //       } else {
      //         //console.log('提交失败!!')
      //         this.canCommit = true;
      //         return false;
      //       }
      //     });
      //   }
    },

    cancel() {
      this.dialogVisible = false;
        this.disabled = false;
    },

    commitInfo(values) {
      let apps = [];

      let channels = [];
      console.log("values======", values);
      for (let index = 0; index < values.apps.length; index++) {
        const element = values.apps[index];
        let app = this.appsOptions.find(function(obj) {
          return obj.id === element;
        });
        apps.push(app);
      }
      for (let index = 0; index < values.channels.length; index++) {
        const element = values.channels[index];
        let obj = this.channelsOptions.find(function(obj) {
          return obj.id === element;
        });
        channels.push(obj);
      }
      console.log("channels======", channels);
      console.log("getFieldsValue======", this.form.getFieldsValue());
      values.channels = channels;
      values.apps = apps;

      //   this.form.setFieldsValue({
      //     channels: channels,
      //     apps: apps
      //   });

      console.log("data===", this.form);
      //   data.type = "page";
      if (this.routeName === "addProductAnalysis") {
        const data = this.handparams(values);
        httpService.logproductconf(data).then(
          response => {
            //console.debug('response===',response.data)
            if (+response.code === 200 && response.data) {
              //   this.$router.push({ path: "/merchandiseManagement" });
              this.dialogVisible = false;
              this.getTableList();
            } else {
              //   this.canCommit = true;
              this.$message.error(
                response.message ||
                  response.subMsg ||
                  response.msg ||
                  "创建应用失败!"
              );
            }
          },
          response => {
            // this.canCommit = true;
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                "请求服务器失败!"
            );
          }
        );
      } else {
        values.id = this.detail.id;
        const data = this.handparams(values);
        httpService.updateLogproductconf(data).then(
          response => {
            //console.debug('response===',response.data)
            if (+response.code === 200 && response.data) {
              this.dialogVisible = false;
              this.disabled = false;
              this.getTableList();
            } else {
              //   this.canCommit = true;
              this.$message.error(
                response.message ||
                  response.subMsg ||
                  response.msg ||
                  "编辑应用失败!"
              );
            }
          },
          response => {
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                "请求服务器失败!"
            );
          }
        );
      }
    },

    //获取详情
    getDetails(id) {
      const param = id;
      httpService.getDetails(param).then(
        response => {
          let detail = response.data || "";
          // this.tableForm.categoryPid = id;
          let apps = [];
          let channels = [];
          for (let index = 0; index < detail.apps.length; index++) {
            const element = detail.apps[index];
            apps.push(element.id);
          }
          for (let index = 0; index < detail.channels.length; index++) {
            const element = detail.channels[index];
            channels.push(element.id);
          }
          detail.apps = apps;
          detail.channels = channels;
          this.detail = detail;
          this.detail.id = param;
          console.log("detail===", detail);

          this.form.setFieldsValue(detail);
          console.log("form===", this.form.getFieldsValue());
          //   this.form = detail;
          if (this.routeName === "checkProductAnalysis") {
            // this.limit = true;
            this.dialogVisible = true;
          } else {
            // this.limit = false;
            // this.disable = true;
          }
        },
        response => {
          this.$message.error(
            response.subMsg ||
              response.message ||
              response.msg ||
              "请求服务器连接失败!"
          );
        }
      );
    },

    handleSizeChange(val) {
      this.searchParams.limit = val;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.searchParams.page = val;
      // console.debug('CurrentChange==',val)
      this.getTableList();
    },
    getStatus() {
      httpService.getStatus().then(
        response => {
          if (response.code === "20000") {
            if (response.data instanceof Array) {
              const array = response.data;
              this.orderStatusOptions = array;
            } else {
              this.orderStatusOptions = [];
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
    },
    getChannel() {
      httpService.getChannel().then(
        response => {
          if (response.code === "20000") {
            if (response.data instanceof Array) {
              const array = response.data;
              this.channelOptions = array;
            } else {
              this.channelOptions = [];
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
    },
    // 获取列表
    getTableList() {
      const data = this.handparams(this.searchParams);
      httpService.getTableList(data).then(
        response => {
          if (+response.code === 200 && response.data) {
            if (response.data.records instanceof Array) {
              const array = response.data.records;
              this.labelDataTable = array;
            } else {
              this.labelDataTable = [];
            }
            let num = 0
            if (response.data.total % response.data.size === 0) {
               num = response.data.size * (response.data.pages -response.data.current) +response.data.total % response.data.size + response.data.size
            }else {
              num = response.data.size * (response.data.pages -response.data.current) +response.data.total % response.data.size
            }
           
            console.log("num====",num)
            for (let index = 0; index < this.labelDataTable.length; index++) {
              let element = this.labelDataTable[index];
              element.num = num - index
            }
            // this.total = response.data.total || 0;
            const pagination = { ...this.pagination };
            // Read total count from server
            // pagination.total = data.totalCount;
            pagination.total = response.data.total || 0;
            pagination.pageSize = response.data.size || 10;
            console.log("total===", pagination.total);
            this.pagination = pagination;
            // this.pagination;
            console.log("pagination===", this.pagination);
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
  margin: 24px;
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
.textSpan:hover{
font-family:PingFangSC-Regular,PingFang SC;
font-weight:400;
color:rgba(24,144,255,1);
cursor:pointer;
text-decoration: underline;}
</style>

