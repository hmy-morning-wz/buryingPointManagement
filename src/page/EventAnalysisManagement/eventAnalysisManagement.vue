<template>
  <div>
    <template>
      <div>
        <el-row class="mr20">
          <el-col :span="24">
            <span class="float-left ml20 mt20">事件分析</span>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="24">
            <div class="float-left">
            <el-input class="ml20 mt20" v-model="searchParams.name" placeholder="事件分析名称"></el-input>
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
            <el-button class="mt20" type="primary" @click="newAdd">创建事件分析</el-button>
          </div>

          <div class="float-left ml20">
            <el-button class="mt20" type="primary" @click="delData">删除事件分析</el-button>
          </div>
          <el-radio-group class="float-left ml20" @change="radioChange" v-model="tabPosition" >
            <el-radio-button class="mt20" label="我的"></el-radio-button>
            <el-radio-button class="mt20" label="全部"></el-radio-button>
           
          </el-radio-group>
        </el-col>
      </el-row>
      <div style="margin-top:20px">
        <el-table :data="labelDataTable" @selection-change="handleSelectionChange" @sort-change="handleSortChang">
          <!-- <el-table-column prop="categoryCode" label="分类编码" min-width="80" align="center"></el-table-column> -->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="事件分析名称" min-width="80" align="center"></el-table-column>
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
         
          <el-table-column prop="operation" label="操作" min-width="80" align="center">
            <template slot-scope="scope" style="text-align:center">
              <div style="display:flex;justify-content: center">
                
                <el-button type="text" @click="labelCheck(scope.$index,scope.row)">查看</el-button>
                <el-button type="text" @click="labelUpdate(scope.$index,scope.row)">编辑</el-button>
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
          :page-size="searchParams.limit"
          layout="total, prev, pager,next,sizes,jumper "
          :total="total"
        ></el-pagination>
      </div>
    </template>
  </div>
</template>
<script>
import httpService from '../../service/EventAnalysisManagement/httpService.js'

export default {
  data() {
    return {
      direction: 'rtl',
      drawer: false,
      title: '',
      disable: false,
      limit: false,
      routeName: '',
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
      tabPosition: '我的',
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
        self: '1',
        page: 1,
        limit: 10
      },
      statusChangeParams: {
        categoryId: 0,
        categoryStatus: 0
      },
      labelDataTable: [],
      total: 0,
      rules: {
        name: [
          { required: true, message: '请输入变量名称', trigger: 'blur' }
          // { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],

        identifyName: [
          { required: true, message: '请输入标识符', trigger: 'blur' }
          // { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        descr: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        variType: [{ required: true, message: '请选择类型', trigger: 'change' }]
      }
    }
  },
  created() {
    // this.getStatus();
    // this.getChannel();
    this.getTableList()
  },
  methods: {
    newAdd() {
      this.$router.push({
        name: 'addEventAnalysis'
      })
    },

    radioChange(val) {
      console.log('val====', val)
      if (val === '我的') {
        this.searchParams.self = 1
      } else {
        this.searchParams.self = ''
      }
      this.getTableList()
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
        httpService.deleteBuriedIncident(data).then(
          response => {
            if (response.code) {
              if (+response.code === 200) {
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
      //  this.tableForm = {};
      // this.tableForm.id = row.id;
      // this.drawer = true;
      // this.routeName = "checkEventAnalysis";
      // this.getDetails();

      this.$router.push({
        name: 'checkEventAnalysis',
        query: { index: index, id: row.id }
      })
    },
    labelUpdate(index, row) {
      // console.debug('id===',row.id)
      // this.tableForm = {};
      // this.tableForm.id = row.id;
      // this.drawer = true;
      // this.routeName = "updateEventAnalysis";
      // this.getDetails();

      this.$router.push({
        name: 'updateEventAnalysis',
        query: { index: index, id: row.id }
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.commitInfo()
        } else {
          //console.log('提交失败!!')
          return false
        }
      })
    },

    cancel() {
      this.drawer = false
    },

    commitInfo() {
      const data = this.handparams(this.tableForm)
      //   console.log("data===",data)

      if (this.routeName === 'addEventAnalysis') {
        httpService.logappconf(data).then(
          response => {
            //console.debug('response===',response.data)
            if (+response.code === 200 && response.data) {
              //   this.$router.push({ path: "/merchandiseManagement" });
              this.drawer = false
              this.getTableList()
            } else {
              // alert(response.msg || '新增任务失败')
              this.$message.error(
                response.message ||
                  response.subMsg ||
                  response.msg ||
                  '创建应用失败!'
              )
            }
          },
          response => {
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                '请求服务器失败!'
            )
          }
        )
      } else {
        httpService.updateEventAnalysis(data).then(
          response => {
            //console.debug('response===',response.data)
            if (+response.code === 200 && response.data) {
              this.drawer = false
              this.getTableList()
            } else {
              // alert(response.msg || '新增任务失败')
              this.$message.error(
                response.message ||
                  response.subMsg ||
                  response.msg ||
                  '编辑应用失败!'
              )
            }
          },
          response => {
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
          if (this.routeName === 'checkEventAnalysis') {
            this.limit = true
            this.disable = true
          } else {
            this.limit = false
            this.disable = false
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

