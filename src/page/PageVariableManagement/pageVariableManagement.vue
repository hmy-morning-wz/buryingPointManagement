<template>
  <div>
    <template>
      <div>
        <el-row class="mr20">
          <el-col :span="24">
            <span class="float-left ml20 mt20">页面级变量</span>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="24">
          <div class="float-left">
            <el-input class="ml20 mt20" v-model="searchParams.vari_name" placeholder="变量名称"></el-input>
          </div>
          <div class="float-left">
            <el-input class="ml40 mt20" v-model="searchParams.operator" placeholder="创建人名称"></el-input>
          </div>
          <div class="float-left ml20 w120">
            <el-button type="primary" class="mt20 ml40" @click="searchClick">搜索</el-button>
          </div>
        </el-col>
        <el-col>
          <div class="float-left ml20">
            <el-button class="mt20" type="primary" @click="newAdd">创建页面级变量</el-button>
          </div>
          <div class="float-left ml20">
            <el-button class="mt20" type="primary" @click="delData">删除页面级变量</el-button>
          </div>
        </el-col>
      </el-row>
      <div style="margin-top:20px">
        <el-table :data="labelDataTable" @selection-change="handleSelectionChange" @sort-change="handleSortChang">
          <!-- <el-table-column prop="categoryCode" label="分类编码" min-width="80" align="center"></el-table-column> -->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="variName" label="名称" min-width="80" align="center"></el-table-column>
          <el-table-column prop="identifyName" label="标识符" min-width="80" align="center"></el-table-column>
          <el-table-column prop="variType" label="类型" min-width="80" align="center">
            <template slot-scope="scope" style="text-align:center">
              <div style="display:flex;justify-content: center">
                <el-main v-if="scope.row.variType === 1" v-model="scope.row.variType">字符串</el-main>
                <el-main v-else-if="scope.row.variType === 2" v-model="scope.row.variType">整数</el-main>
                <el-main v-else v-model="scope.row.variType">小数</el-main>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="创建人" min-width="80" align="center"></el-table-column>
          <el-table-column
            prop="gmtCreate"
            sortable="custom"
            label="创建时间"
            min-width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="gmtModify"
            sortable="custom"
            label="最后更新时间"
            min-width="100"
            align="center"
          ></el-table-column>
          <!-- <el-table-column prop="status" label="状态" min-width="80" align="center">
              <template slot-scope="scope" style="text-align:center">
              <div style="display:flex;justify-content: center">
                <el-button
                  v-if="scope.row.status === 1"
                  type="text"
                  v-model="scope.row.status"
                >正常</el-button>
                <el-button
                  v-else
                  type="text"
                  v-model="scope.row.categoryStatusDesc"
                  @click="statusChange(scope.$index,scope.row)"
                >未检测到数据</el-button>
              </div>
            </template>
          </el-table-column>-->
          <el-table-column prop="operation" label="操作" min-width="80" align="center">
            <template slot-scope="scope" style="text-align:center">
              <div style="display:flex;justify-content: center">
                <el-button type="text" @click="labelCheck(scope.$index,scope.row)">查看</el-button>
                <el-button type="text" @click="labelUpdate(scope.$index,scope.row)">编辑</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-drawer
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
        </el-drawer>
      </div>
      <div class="foot-page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchParams.page"
          :page-sizes="[10,20, 30, 50, 100]"
          :page-size="searchParams.limit"
          layout="total, prev, pager,next,sizes,jumper "
          :total="total"
        ></el-pagination>
      </div>
    </template>
  </div>
</template>
<script>
import httpService from '../../service/EventVariableManagement/httpService.js'

export default {
  data() {
    return {
      direction: 'rtl',
      drawer: false,
      title: '',
      disable: false,
      limit: false,
      routeName: '',
      canCommit: true,
      typeOptions: [
        {
          id: 1,
          label: '字符串'
        },
        {
          id: 2,
          label: '整数'
        },
        {
          id: 3,
          label: '小数'
        }
      ],
      tableForm: {},
      showSort: false,
      cityList: [],
      multipleSelection: [],
      selectedIDs: [],

      noList: [],

      searchParams: {
        event_name: '',
        operator: '',
        orderByField: '',
        status: '',
        gmtCreate: '',
        isAsc: '',
        page: 1,
        limit: 10,
        type: 'page'
      },
      statusChangeParams: {
        categoryId: 0,
        categoryStatus: 0
      },
      labelDataTable: [],
      total: 0,
      rules: {
        variName: [
          { required: true, message: '请输入变量名称', trigger: 'blur' }
          // { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],

        identifyName: [
          { required: true, message: '请输入标识符', trigger: 'blur' }
          // { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        // descr: [{ required: true, message: "请输入描述", trigger: "blur" }],
        variType: [{ required: true, message: '请选择类型', trigger: 'change' }]
      }
    }
  },
  created() {
    // this.getStatus();
    // this.getChannel();
    this.getTableList()
  },
  watch: {
    searchParams(val, oldVal) {
      //普通的watch监听
      console.log('a: ' + val, oldVal)
    }
  },
  methods: {
    newAdd() {
      this.tableForm = {}
      this.drawer = true
      this.limit = false
      this.disable = false
      this.routeName = 'addPageVariable'
    },
    closed() {
      console.log('closed======')
      this.canCommit = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('multipleSelection', this.multipleSelection)
      let ids = []
      let orderNos = []
      this.multipleSelection.map(item => {
        ids.push(item)
        orderNos.push(item.id)
      })
      this.selectedIDs = ids
      this.noList = orderNos
      console.log('多选', this.selectedIDs)
    },

    handleSortChang({ column, prop, order }) {
      console.log('column====', column + 'prop===' + prop + 'order====' + order)
      if (prop) {
        this.searchParams.orderByField = this.toLine(prop)
      } else {
        this.searchParams.orderByField = ''
      }

      if (order && order === 'ascending') {
        this.searchParams.isAsc = true
      } else if (order && order === 'descending') {
        this.searchParams.isAsc = false
      } else {
        this.searchParams.isAsc = ''
      }
      this.getTableList()
    },

    delData() {
      let data = ''
      for (let index = 0; index < this.noList.length; index++) {
        const element = this.noList[index]
        if (index === 0) {
          data = element
        } else {
          data = data + ',' + element
        }
      }
      if (this.noList.length != 0) {
        httpService.deleteEventVariable(data).then(
          response => {
            if (response.code) {
              if (+response.code === 200) {
                if (this.labelDataTable.length === this.noList.length) {
                  this.searchParams.page = this.searchParams.page - 1
                }
                this.getTableList()
              } else {
                this.$message.error(
                  response.message ||
                    response.sub_msg ||
                    response.msg ||
                    '服务器未返回数据!'
                )
              }
            } else {
              this.$message.error(
                response.message ||
                  response.sub_msg ||
                  response.msg ||
                  '服务器未返回数据!'
              )
            }
          },
          response => {
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                '请求服务器失败!'
            )
          }
        )
      } else {
        this.$message.error('请先选择条目!')
      }
    },

    //点击搜索
    searchClick() {
      // console.debug('搜索点击')
      this.searchParams.page = 1
      this.getTableList()
    },

    // 查看
    labelCheck(index, row) {
      // console.debug('id===',row.id)
      this.tableForm = {}
      this.tableForm.id = row.id
      this.drawer = true
      this.routeName = 'checkPageVariable'
      this.getDetails()
    },
    labelUpdate(index, row) {
      // console.debug('id===',row.id)
      this.tableForm = {}
      this.tableForm.id = row.id
      this.drawer = true
      this.routeName = 'updatePageVariable'
      this.getDetails()
    },

    submitForm(formName) {
      if (this.canCommit) {
        this.canCommit = false
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.commitInfo()
          } else {
            //console.log('提交失败!!')
            this.canCommit = true
            return false
          }
        })
      }
    },

    cancel() {
      this.drawer = false
    },

    commitInfo() {
      const data = this.handparams(this.tableForm)
      //   console.log("data===",data)
      data.type = 'page'
      if (this.routeName === 'addPageVariable') {
        httpService.logappconf(data).then(
          response => {
            //console.debug('response===',response.data)
            if (+response.code === 200 && response.data) {
              //   this.$router.push({ path: "/merchandiseManagement" });
              this.drawer = false
              this.getTableList()
            } else {
              // alert(response.msg || '新增任务失败')
              this.canCommit = true
              this.$message.error(
                response.message ||
                  response.subMsg ||
                  response.msg ||
                  '创建应用失败!'
              )
            }
          },
          response => {
            this.canCommit = true
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                '请求服务器失败!'
            )
          }
        )
      } else {
        httpService.updateEventVariable(data).then(
          response => {
            //console.debug('response===',response.data)
            if (+response.code === 200 && response.data) {
              this.drawer = false
              this.getTableList()
            } else {
              // alert(response.msg || '新增任务失败')
              this.canCommit = true
              this.$message.error(
                response.message ||
                  response.subMsg ||
                  response.msg ||
                  '编辑应用失败!'
              )
            }
          },
          response => {
            this.canCommit = true
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                '请求服务器失败!'
            )
          }
        )
      }
    },

    //获取详情
    getDetails() {
      const param = this.tableForm.id
      httpService.getDetails(param).then(
        response => {
          const detail = response.data || ''
          // this.tableForm.categoryPid = id;
          this.tableForm = detail
          if (this.routeName === 'checkPageVariable') {
            this.limit = true
            this.disable = true
          } else {
            this.limit = false
            this.disable = true
          }
        },
        response => {
          this.$message.error(
            response.subMsg ||
              response.message ||
              response.msg ||
              '请求服务器连接失败!'
          )
        }
      )
    },

    handleSizeChange(val) {
      this.searchParams.limit = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.searchParams.page = val
      // console.debug('CurrentChange==',val)
      this.getTableList()
    },
    getStatus() {
      httpService.getStatus().then(
        response => {
          if (response.code === '20000') {
            if (response.data instanceof Array) {
              const array = response.data
              this.orderStatusOptions = array
            } else {
              this.orderStatusOptions = []
            }
          } else {
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                '服务器未返回数据!'
            )
          }
        },
        response => {
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              '请求服务器失败!'
          )
        }
      )
    },
    getChannel() {
      httpService.getChannel().then(
        response => {
          if (response.code === '20000') {
            if (response.data instanceof Array) {
              const array = response.data
              this.channelOptions = array
            } else {
              this.channelOptions = []
            }
          } else {
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                '服务器未返回数据!'
            )
          }
        },
        response => {
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              '请求服务器失败!'
          )
        }
      )
    },
    // 获取列表
    getTableList() {
      const data = this.handparams(this.searchParams)
      httpService.getTableList(data).then(
        response => {
          if (+response.code === 200) {
            if (response.data && response.data.records instanceof Array) {
              const array = response.data.records
              this.labelDataTable = array
            } else {
              this.labelDataTable = []
            }
            this.total = response.data.total || 0
          } else {
            this.$message.error(
              response.message ||
                response.sub_msg ||
                response.msg ||
                '服务器未返回数据!'
            )
          }
        },
        response => {
          this.$message.error(
            response.message ||
              response.sub_msg ||
              response.msg ||
              '请求服务器失败!'
          )
        }
      )
    },
    //参数处理
    handparams(param) {
      const params = JSON.parse(JSON.stringify(param))
      for (const i in params) {
        if (params[i] === '') {
          delete params[i]
        }
      }
      // console.log("data===" + JSON.stringify(params))
      return params
    },
    // 下划线转换驼峰
    toHump(name) {
      return name.replace(/\_(\w)/g, function(all, letter) {
        return letter.toUpperCase()
      })
    },
    // 驼峰转换下划线
    toLine(name) {
      return name.replace(/([A-Z])/g, '_$1').toLowerCase()
    }
  }
}
</script>
<style lang="scss" scoped>
.foot-page {
  float: right;
  margin-top: 10px;
  margin-bottom: 50px;
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
</style>

