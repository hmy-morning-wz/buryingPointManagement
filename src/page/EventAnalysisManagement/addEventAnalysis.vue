<template>
  <div style="overflow-x:scroll;height:100%;">
    <el-scrollbar style="height:100%;">
      <template>
        <div>
          <el-row class="mr20">
            <el-col :span="24">
              <span class="float-left ml20 mt20 mb20">新建事件分析</span>
            </el-col>
          </el-row>
        </div>
      </template>
      <template>
        <div style=" display:flex; margin-top:10px; ">
          <el-form
            style="margin:auto;"
            ref="tableForm"
            label-width="120px"
            :model="tableForm"
            :rules="rules"
          >
            <el-row>
              <el-col :span="6" class="flex">
                <el-form-item label="事件分析名称" prop="name">
                  <el-input
                    :disabled="disable"
                    placeholder="事件分析名称"
                    v-model="tableForm.name"
                    class="w160"
                  ></el-input>
                </el-form-item>

                <!-- <el-form-item v-if="!disable || !limit">
                  <el-button
                    type="primary"
                    @click="submitForm('tableForm')"
                    style="margin-left:-120px;margin-top:10px;"
                    class="mt20"
                  >提交</el-button>
                  <el-button @click="cancel()">取消</el-button>
                </el-form-item>-->
              </el-col>
              <el-col :span="6">
                <el-form-item label="选择事件" prop="eventId">
                  <el-select
                    v-model="tableForm.eventId"
                    clearable
                    :disabled="disable"
                    @change="eventChange"
                    class="w160"
                  >
                    <el-option-group
                    v-for="group in groupTypeOptions"
                    :key="group.label"
                    :label="group.label">
                      <el-option
                        v-for="item in group.options"
                        :key="item.id"
                        :label="item.eventName"
                        :value="item.id"
                      ></el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="demin_select" :span="6">
                <el-form-item label="选择维度">
                  <el-select
                    v-model="tableForm.selectDemin"
                    :disabled="disable"
                    collapse-tags
                    class="w160"
                    @change="deminSelect()"
                    clearable
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in deminOptions"
                      :key="item.identifyName"
                      :label="item.dimenName"
                      :value="item.identifyName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-radio-group
                    :disabled="false"
                    @change="showTypeChange"
                    v-model="tableForm.showType"
                  >
                    <el-radio-button :disabled="disabledLine" label="line">线形图</el-radio-button>
                    <el-radio-button label="table">图表</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="16">
                <el-form
                  style="margin:auto;"
                  ref="labelForm"
                  label-width="120px"
                  :model="labelForm"
                  :rules="rules"
                >
                  
                  <div class="flex">

                    
                  <el-form-item label="维度枚举" prop="timeType" style="margin-top:10px;">
                    <el-select
                      v-model="condition"
                      clearable
                      :disabled="disable"
                      multiple
                      class="w120"
                    >
                      <el-option
                        v-for="item in conditionTypeOptions"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  </div>
                  
                  <el-button
                    type="primary"
                    @click="checkTable"
                    style="margin-left:420px;margin-top:10px;"
                  >事件分析图</el-button>
                </el-form>
                <div id="myChart" style="width:600px;height:400px"></div>
              </el-col>-->
            </el-row>
            <el-row>
              <!-- <el-col :span="6">
                <el-form-item label="目标用户" prop="resultType" @click="resultTypeClick">
                  <el-select
                    v-model="tableForm.resultType"
                    clearable
                    :disabled="disable"
                    class="w160"
                  >
                    <el-option v-for="item in userOptions" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>-->
              <el-col :span="12">
                <el-form-item label="选择时间" prop="time">
                  <el-date-picker
                    v-model="value2"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyyMMdd"
                    align="left"
                    :disabled="false"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="选择粒度" prop="timeType">
                  <el-select
                    v-model="tableForm.timeType"
                    clearable
                    :disabled="false"
                    class="w160"
                  >
                    <el-option
                      v-for="item in timeTypeOptions"
                      :key="item.id"
                      :label="item.value"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-radio-group
                    v-if="showResultType"
                    @change="resultTypeChange"
                    v-model="tableForm.resultType"
                  >
                    <el-radio-button label="pv">PV</el-radio-button>
                    <el-radio-button label="uv">UV</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <div class="flex ml20">
                <el-image style="width: 20px; height: 20px" :src="choseUrl" @click="filterHandle"></el-image>
                <div>过滤条件（AND）：</div>
                <div  style="width:80%;">
                  <el-tag
                  class="mr10 mb10"
                  v-for="tagFilter in tagsFilterOptions"
                  :key="tagFilter.deminName"
                  :closable="!disable"
                  @close="tagCloseHandle(tagFilter)"
                >{{(tagFilter.deminDesc || tagFilter.deminName) +" "+handleOperator(tagFilter.rule) +" " +(tagFilter.valDesc || tagFilter.val)}}</el-tag>
                </div>
                
                <el-dialog
                  title="全局过滤"
                  :visible.sync="dialogVisible"
                  :close-on-click-modal="false"
                  width="80%"
                >
                  <div style="text-align:center;">
                    <div
                      style="text-align:center;width: fit-content;width: -webkit-fit-content;margin:auto;"
                    >
                      <div
                        style="width: fit-content;width: -webkit-fit-content; margin:auto;margin-bottom:20px;"
                        v-for="(item, index) in filterItems"
                        :key="index"
                      >
                        <div class="flex filter_select" style="width: fit-content;width: -webkit-fit-content;">
                          <el-select
                          style="margin-right:10px;"
                            v-model="item.deminName"
                            @change="filterDeminChange(item,1)"
                            :disabled="disable"
                            placeholder="选择维度"
                          >
                            <el-option
                              v-for="itemDemin in item.deminOptions"
                              :key="itemDemin.identifyName"
                              :label="itemDemin.dimenName"
                              :value="itemDemin.identifyName"
                            ></el-option>
                          </el-select>
                          <el-select
                          style="margin-right:10px;"
                            v-model="item.rule"
                            placeholder="选择操作符"
                            :disabled="disable"
                            @change="operatorChange(item)"
                          >
                            <el-option
                              v-for="itemOperator in item.operatorOptions"
                              :key="itemOperator.value"
                              :label="itemOperator.label"
                              :value="itemOperator.value"
                            ></el-option>
                          </el-select>
                          <el-select
                            class="w280"
                            style="margin-right:10px;"
                            v-if="item.rule != 'in' && item.rule != 'nin'"
                            v-model="item.val"
                            @change="filterValChange(item)"
                            :disabled="disable"
                            filterable
                            allow-create
                            default-first-option
                            placeholder="选择维度值"
                          >
                            <el-option
                              v-for="itemDeminValue in item.deminValueOptions"
                              :key="itemDeminValue.deminKey"
                              :label="itemDeminValue.deminValue"
                              :value="itemDeminValue.deminKey"
                            ></el-option>
                          </el-select>
                          <!-- value-key="deminVal" -->
                          <el-select
                            class="w280"
                            style="margin-right:10px;"
                            v-else
                            v-model="item.valList"
                            @change="valListChange(item)"
                            :disabled="disable"
                            filterable
                            collapse-tags
                            allow-create
                            multiple
                            default-first-option
                            placeholder="选择维度值"
                          >
                            <el-option
                              v-for="itemDeminValue in item.deminValueOptions"
                              :key="itemDeminValue.deminKey"
                              :label="itemDeminValue.deminValue"
                              :value="itemDeminValue.deminKey"
                            ></el-option>
                          </el-select>
                          <el-button
                            type="danger"
                            icon="el-icon-delete"
                            v-if="!disable"
                            @click="delFilter(item,index)"
                            circle
                          ></el-button>
                        </div>
                      </div>
                      <div v-if="!disable" class="flex mt20 mb20" style="width: fit-content;width: -webkit-fit-content;">
                        <div>
                          <el-button type="primary" @click="addFilter">添加过滤条件</el-button>
                        </div>
                      </div>
                    </div>
                    <div style="text-align:center;">
                      <div
                        class="flex"
                        style="width: fit-content;width: -webkit-fit-content; margin:auto;"
                      >
                        <el-button v-if="!disable" type="primary" @click="filterSave">保存</el-button>
                        <el-button type="danger" @click="filterCancel">取消</el-button>
                      </div>
                    </div>
                  </div>
                </el-dialog>
              </div>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-button class="mt20 ml20" @click="checkTableForm('tableForm',0)" type="primary">查询</el-button>
                <el-button class="mt20" @click="checkTableForm('tableForm',1)" type="primary">下载</el-button>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button
                    v-if="!disable"
                    class="mt20"
                    @click="submitForm('tableForm')"
                    type="primary"
                  >保存</el-button>
                  <el-button type="danger" @click="cancel()">取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                v-if="tableForm.showType != 'line'"
                :data="tableData"
                border
                style="width: 100%;"
                class="mt20"
              >
                <el-table-column
                  v-for="(item, index) in tableKeys"
                  :key="index"
                  :prop="item.key"
                  :label="item.title"
                ></el-table-column>
              </el-table>
              <div v-else id="myChart" style="width:100%;height:600px"></div>
            </el-row>
            <div class="foot-page">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="tableForm.pageNum"
                :page-sizes="[20,30, 40, 50, 60, 100]"
                :page-size="tableForm.pageSize"
                layout="total, prev, pager,next,sizes,jumper "
                :total="total"
              ></el-pagination>
            </div>
          </el-form>
        </div>
      </template>
    </el-scrollbar>
  </div>
</template>
    
<script>
import httpService from '../../service/EventAnalysisManagement/httpService.js'
import echarts from 'echarts'
import { Loading } from 'element-ui'
// import apiHost from "@/hostconfig/index";
export default {
  data() {
    return {
      title: '',
      disable: false,
      limit: false,
      routeName: '',
      typeOptions: [],
      groupTypeOptions: [],
      deminOptions: [],
      userOptions: [],
      canCommit: true,
      condition: [],
      choseUrl: require('../../../src/assets/images/chose.png'),
      disabledLine: false,

      loading: false,

      dialogVisible: false,
      filterItems: [],
      // deminValueOptions: [],
      tagsFilterOptions: [],

      total: 0,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },

      value2: '',

      timeTypeOptions: [
        {
          id: 'day',
          value: '天'
        },
        {
          id: 'hour',
          value: '小时'
        }
      ],
      conditionTypeOptions: [],

      //   uploadimgUrl: `${apiHost.netImg}prefer/api/fileUploadOne`,
      imagePath: '',
      buttonStatus: 0,
      redText: '',
      inventoryClass: '',
      isUpdate: false,
      tableForm: {
        resultType: '',
        showType: 'table',
        selectDemin: [],
        demin: '',
        conditionVal: '',
        pageNum: 1,
        pageSize: 20
      },
      showResultType: false,
      tableKeys: [],
      tableData: [],

      rules: {
        // name: [
        //   { required: true, message: "请输入事件分析名称", trigger: "blur" }
        //   // { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        // ],
        eventId: [{ required: true, message: '请选择事件', trigger: 'change' }],
        selectDemin: [
          { required: true, message: '请选择维度', trigger: 'change' }
        ],
        timeType: [
          { required: true, message: '请选择粒度', trigger: 'change' }
        ],
        time: [
          {
            required: true,
            message: '请选择时间',
            validator: (rule, value, callback) => {
              console.log('value====', value)
              if (this.value2 === null || this.value2 === '') {
                callback(new Error('请填写大于0的数字'))
              } else {
                callback()
              }
            }
          }
        ]
        // resultType: [
        //   { required: true, message: "请选择目标用户", trigger: "change" }
        // ]
      }
    }
  },
  async created() {
    console.log('this.$refs===', this.$refs)
    let that = this
    const routeName = this.$route.name || ''
    const id = this.$route.query.id || ''
    console.log('id===', id)

    // this.getType(routeName);
    if (routeName === 'addEventAnalysis') {
      // this.tableForm.goodsId = 5;
      this.getEventType(routeName)
    } else if (
      routeName === 'checkEventAnalysis' ||
      routeName === 'updateEventAnalysis'
    ) {
      this.tableForm.id = id
      this.getEventType(routeName)
    }

    //   setTimeout(function() {
    //       that.getLine();
    //       }, 10000);
  },
  mounted() {
    //   this.$nextTick(()=> { this.getLine(); })
    // this.getLine();
  },

  methods: {
    submitForm(formName) {
      if (this.canCommit) {
        this.canCommit = false
        ;(this.rules.name = [
          { required: true, message: '请输入事件分析名称', trigger: 'blur' }
          // { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ]),
          this.$refs[formName].validate(valid => {
            if (valid) {
              if (
                this.tableForm.timeType === 'hour' &&
                this.value2[0] != this.value2[1]
              ) {
                this.canCommit = true
                this.$message.error(
                  '时间粒度选择小时，开始时间和结束时间只能是同一天！'
                )
              } else {
                this.commitInfo()
              }
            } else {
              //console.log('提交失败!!')
              this.canCommit = true
              return false
            }
          })
      }
    },

    checkTableForm(formName, type) {
      delete this.rules.name
      console.log(this.rules)
      this.$refs[formName].clearValidate('name')
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.tableForm.timeType === 'hour' &&
            this.value2[0] != this.value2[1]
          ) {
            this.$message.error(
              '时间粒度选择小时，开始时间和结束时间只能是同一天！'
            )
          } else {
            if (type === 1) {
              this.downTable()
            } else {
              this.checkTable()
            }
          }
        } else {
          //console.log('提交失败!!'
          return false
        }
      })
    },
    valListChange(item) {
      console.log('item.valList====', item.valList)
      item.val = ''
      item.valDesc = ''
      if (item.valList && item.valList.length != 0) {
        for (let index = 0; index < item.valList.length; index++) {
          const element = item.valList[index]
          for (let obj in item.deminValueOptions) {
            if (element === item.deminValueOptions[obj].deminKey) {
              if (index === 0) {
                item.valDesc = item.deminValueOptions[obj].deminValue
              } else {
                item.valDesc =
                  item.valDesc + ',' + item.deminValueOptions[obj].deminValue
              }
            }
          }
          if (index === 0) {
            item.val = element
          } else {
            item.val = item.val + ',' + element
          }
        }
      }
      console.log('item.val====', item.val)
    },

    addFilter() {
      let filterItem = {
        deminOptions: this.deepCopy(this.deminOptions),
        operatorOptions: [
          {
            value: 'in',
            label: 'in 在…范围内'
          },
          {
            value: 'nin',
            label: 'not in 不在范围内'
          },
          {
            value: 'like',
            label: 'like 包含'
          },
          {
            value: 'eq',
            label: '= 等于'
          },
          {
            value: 'neq',
            label: '!= 不等于'
          }
        ],
        deminValueOptions: []
      }
      // this.$set(filterItem,'deminValueOptions',[]);
      this.filterItems.push(filterItem)
      // this.$set(this.filterItems,this.filterItems.length-1,filterItem);
    },
    delFilter(item, index) {
      this.filterItems.splice(index, 1)
      console.log('del====', this.tagsFilterOptions)
    },

    filterSave() {
      let canSave = true
      for (let index = 0; index < this.filterItems.length; index++) {
        const element = this.filterItems[index]
        if (!element.deminName || !element.rule || !element.val) {
          canSave = false
        }
      }
      if (canSave) {
        this.tagsFilterOptions = []
        for (let index = 0; index < this.filterItems.length; index++) {
          const element = this.filterItems[index]
          let tagsFilterItem = {
            deminName: element.deminName,
            rule: element.rule,
            val: element.val,
            deminDesc: element.deminDesc,
            valDesc: element.valDesc
          }
          console.log('val===', element.val)
          this.tagsFilterOptions.push(tagsFilterItem)
        }
        // this.tagsFilterOptions = this.deepCopy(this.filterItems);
        this.dialogVisible = false
      } else {
        this.$message.error('请填写完整筛选条件，不需要请删除或者取消！')
      }
    },

    deepCopy(obj) {
      // 只拷贝对象
      console.log('deepCopy====')
      if (typeof obj !== 'object') return
      // 根据obj的类型判断是新建一个数组还是一个对象
      var newObj = obj instanceof Array ? [] : {}
      for (var key in obj) {
        // 遍历obj,并且判断是obj的属性才拷贝
        if (obj.hasOwnProperty(key)) {
          // 判断属性值的类型，如果是对象递归调用深拷贝
          newObj[key] =
            typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key]
        }
      }
      console.log('deepCopy====', newObj)
      return newObj
    },

    filterCancel() {
      this.dialogVisible = false
    },

    resultTypeChange() {
      console.log('resultType===', this.tableForm.resultType)
    },

    tagCloseHandle(item) {
      this.tagsFilterOptions.splice(this.tagsFilterOptions.indexOf(item), 1)
    },

    showTypeChange() {
      console.log('showType===', this.tableForm.showType)
      this.checkTableForm('tableForm',0)
    },
    deminSelect() {
      console.log('selectDemin===', this.tableForm.selectDemin)
      if (this.tableForm.selectDemin.length > 1) {
        this.disabledLine = true
        this.$set(this.tableForm, 'showType', 'table')
      } else {
        this.disabledLine = false
        this.$set(this.tableForm, 'showType', 'line')
        // this.tableForm.showType = "table";
      }
      this.$set(this.tableForm, 'selectDemin', this.tableForm.selectDemin)
    },

    handleOperator(str) {
      switch (str) {
        case 'eq':
          return '= 等于'
          break
        case 'in':
          return 'in 在…范围内'
          break
        case 'nin':
          return 'not in 不在范围内'
          break
        case 'like':
          return 'like 包含'
          break
        case 'neq':
          return '!= 不等于'
          break
      }
    },

    operatorChange(item) {
      // if (item.rule != 'in' && item.rule != 'nin') {
      //   this.$set(item,'val',"");
      //   this.$set(item,'valList',[]);
      // }
      this.$set(item, 'rule', item.rule)
      this.$set(item, 'val', '')
      this.$set(item, 'valDesc', '')
      this.$set(item, 'valList', [])
    },

    filterValChange(item) {
      for (let obj in item.deminValueOptions) {
        if (item.val === item.deminValueOptions[obj].deminKey) {
          item.valDesc = item.deminValueOptions[obj].deminValue
        }
      }
      console.log('iiitem', item)
    },

    filterDeminChange(item, type) {
      console.log('item==', type, item)
      console.log(typeof item.deminOptions)
      for (let obj in item.deminOptions) {
        // console.log(item.deminOptions[obj].identifyName) //obj索引
        if (item.deminName === item.deminOptions[obj].identifyName) {
          item.deminDesc = item.deminOptions[obj].dimenName
        }
      }
      if (type != 0) {
        // item.val = "";
        this.$set(item, 'val', '')
        this.$set(item, 'valDesc', '')
        // item.valList = [];
        this.$set(item, 'valList', [])
      }
      console.log('item==', type, item)

      const data = {
        id: this.tableForm.eventId,
        field: item.deminName
      }
      httpService.eventCondtionList(data).then(
        response => {
          //console.debug('response===',response.data)
          if (+response.code === 200 && response.data) {
            if (response.data instanceof Array) {
              // item.deminValueOptions = response.data;
              this.$set(item, 'deminValueOptions', response.data)
            } else {
              // item.deminValueOptions = [];
              this.$set(item, 'deminValueOptions', [])
            }
          } else {
            // alert(response.msg || '新增任务失败')
            this.$set(item, 'deminValueOptions', [])
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                '创建分析事件失败!'
            )
          }
        },
        response => {
          this.$set(item, 'deminValueOptions', [])
          this.$message.error(
            response.message ||
              response.subMsg ||
              response.msg ||
              '请求服务器失败!'
          )
        }
      )
    },
    // 获取data
    getTableFormData() {
      if (this.value2 != '' && this.value2 != null) {
        this.tableForm.startDay = this.value2[0]
        this.tableForm.endDay = this.value2[1]
      }
      this.tableForm.demin = ''

      if (this.tagsFilterOptions && this.tagsFilterOptions.length > 0) {
        this.tableForm.conditionVal = JSON.stringify(this.tagsFilterOptions)
      } else {
        this.tableForm.conditionVal = ''
      }
      if (this.tableForm.showType === 'line') {
        this.tableForm.pageSize = 2000
      } else {
        this.tableForm.pageSize = 20
      }

      if (this.tableForm.selectDemin) {
        for (
          let index = 0;
          index < this.tableForm.selectDemin.length;
          index++
        ) {
          const element = this.tableForm.selectDemin[index]

          this.tableForm.demin = this.tableForm.demin + element + ','
        }
        if (this.tableForm.demin != '') {
          this.tableForm.demin = this.tableForm.demin.substring(
            0,
            this.tableForm.demin.length - 1
          )
        }
      }
    },
    // 下载
    downTable() {
      this.getTableFormData()

      const data = this.handparams(this.tableForm)
      console.debug('data===', data)
      let loadingInstance = Loading.service({ fullscreen: true })
      httpService.downTable(data).then(
        response => {
          //console.debug('response===',response.data)
          console.log('===')
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close()
          })
          if (+response.code === 200 && response.data) {
            this.downLoadExcel(response.data)
          } else {
            // alert(response.msg || '新增任务失败')
            this.$message.error(
              response.message || response.subMsg || response.msg || '下载失败!'
            )
          }
        },
        response => {
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close()
          })
          this.$message.error(
            response.message ||
              response.subMsg ||
              response.msg ||
              '请求服务器失败!'
          )
        }
      )
    },
    // 下载表格
    downLoadExcel(key) {
      httpService.downLoadExcel(key)
    },

    handleSizeChange(val) {
      this.tableForm.pageSize = val
      this.checkTable()
    },
    handleCurrentChange(val) {
      this.tableForm.pageNum = val
      // console.debug('CurrentChange==',val)
      this.checkTable()
    },

    checkTable() {
      this.loading = true
      this.getTableFormData()
      let loadingInstance
      if (this.tableForm.showType === 'line') {
        loadingInstance = Loading.service({ fullscreen: true })
      }
      const data = this.handparams(this.tableForm)
      console.debug('data===', data)
      httpService.eventSearch(data).then(
        response => {
          //console.debug('response===',response.data)
          console.log('===')
          this.loading = false
          if (+response.code === 200 && response.data) {
            if (this.tableForm.showType === 'table') {
              if (response.data.records instanceof Array) {
                this.tableKeys = []
                let keys = []
                if (this.tableForm.demin.indexOf(',') > -1) {
                  keys = this.tableForm.demin.split(',')
                } else {
                  keys.push(this.tableForm.demin)
                }
                if (this.tableForm.timeType === 'day') {
                  keys.push('day')
                } else {
                  keys.push('day')
                  keys.push('hour')
                }
                keys.push('val')

                for (let index = 0; index < keys.length; index++) {
                  const element = keys[index]
                  let title = ''
                  if (element === 'day') {
                    title = '日'
                  }
                  if (element === 'hour') {
                    title = '时'
                  }
                  if (element === 'val') {
                    title = '值'
                  }
                  for (
                    let index = 0;
                    index < this.deminOptions.length;
                    index++
                  ) {
                    const ele = this.deminOptions[index]
                    if (element === ele.identifyName) {
                      title = ele.dimenName
                    }
                    console.log('title===', title)
                  }
                  let item = {
                    key: element,
                    title: title
                  }
                  this.tableKeys.push(item)
                }

                // for (var key in response.data.records[0]) {
                //   console.log('records[0]====',response.data.records[0]);
                //   console.log('key====',key);     //获取key值
                //   // console.log(json[key]); //获取对应的value值
                //   let title = "";
                //   if (key === "day") {
                //     title = "日";
                //   }
                //   if (key === "hour") {
                //     title = "时";
                //   }
                //   if (key === "val") {
                //     title = "值";
                //   }
                //   for (
                //     let index = 0;
                //     index < this.deminOptions.length;
                //     index++
                //   ) {
                //     const element = this.deminOptions[index];
                //     if (key === element.identifyName) {
                //       title = element.dimenName;
                //     }
                //     console.log("title===", title);
                //   }
                //   let item = {
                //     key: key,
                //     title: title
                //   };
                //   this.tableKeys.push(item);
                // }
                this.tableData = response.data.records
                console.log('this.tableKeys====', this.tableKeys)
              } else {
                this.tableKeys = []
                this.tableData = []
              }
              this.total = response.data.total || 0
            } else {
              this.day = []
              this.legend = []
              this.series = []

              this.$nextTick(() => {
                // 以服务的方式调用的 Loading 需要异步关闭
                loadingInstance.close()
              })

              if (response.data.records instanceof Array) {
                console.log('===111')
                if (this.tableForm.timeType === 'day') {
                  for (
                    let index = 0;
                    index < response.data.records.length;
                    index++
                  ) {
                    const element = response.data.records[index]
                    if (this.day.indexOf(element.day) > -1) {
                    } else {
                      this.day.push(element.day)
                    }
                  }
                } else {
                  for (
                    let index = 0;
                    index < response.data.records.length;
                    index++
                  ) {
                    const element = response.data.records[index]
                    if (this.day.indexOf(element.hour) > -1) {
                    } else {
                      this.day.push(element.hour)
                    }
                  }
                }

                for (
                  let index = 0;
                  index < response.data.records.length;
                  index++
                ) {
                  const element = response.data.records[index]

                  if (this.legend.indexOf(element[this.tableForm.demin]) > -1) {
                  } else {
                    this.legend.push(element[this.tableForm.demin])
                  }
                  if (this.legend.length > 9) {
                    break
                  }
                }
                for (let index = 0; index < this.legend.length; index++) {
                  const element = this.legend[index]
                  let content = []
                  for (let j = 0; j < response.data.records.length; j++) {
                    const ele = response.data.records[j]
                    if (ele[this.tableForm.demin] === element) {
                      content.push(ele.val)
                    }
                  }

                  const a = {
                    name: element,
                    type: 'line',
                    stack: '',
                    smooth: true,
                    data: content
                  }
                  this.series.push(a)
                }
              }
              console.log('this.legend====', this.legend)
              console.log('this.day====', this.day)
              console.log('this.series====', this.series)
              this.total = response.data.total || 0
              this.getLine()
            }
          } else {
            // alert(response.msg || '新增任务失败')
            this.tableKeys = []
            this.tableData = []
            this.day = []
            this.legend = []
            this.series = []
            this.total = 0
            if (this.tableForm.showType === 'line') {
              this.$nextTick(() => {
                // 以服务的方式调用的 Loading 需要异步关闭
                loadingInstance.close()
              })
            }
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                '创建分析事件失败!'
            )
          }
        },
        response => {
          this.loading = false
          this.tableKeys = []
          this.tableData = []
          this.day = []
          this.legend = []
          this.series = []
          this.total = 0
          if (this.tableForm.showType === 'line') {
            this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close()
            })
          }
          this.$message.error(
            response.message ||
              response.subMsg ||
              response.msg ||
              '请求服务器失败!'
          )
        }
      )
    },

    filterHandle() {
      this.filterItems = this.deepCopy(this.tagsFilterOptions)
      console.log('filterItems====', this.filterItems)

      if (
        this.filterItems &&
        this.filterItems instanceof Array &&
        this.filterItems.length > 0
      ) {
        for (let index = 0; index < this.filterItems.length; index++) {
          const element = this.filterItems[index]
          this.filterDeminChange(element, 0)
          if (element.rule === 'in' || element.rule === 'nin') {
            if (element.val && element.val.indexOf(',') > -1) {
            // element.valList = element.val.split(",");
              this.$set(element, 'valList', element.val.split(','))
            }else {
               this.$set(element, 'valList', [element.val])
            }
          }
          element.deminOptions = this.deepCopy(this.deminOptions)
          element.operatorOptions = [
            {
              value: 'in',
              label: 'in 在…范围内'
            },
            {
              value: 'nin',
              label: 'not in 不在范围内'
            },
            {
              value: 'like',
              label: 'like 包含'
            },
            {
              value: 'eq',
              label: '= 等于'
            },
            {
              value: 'neq',
              label: '!= 不等于'
            }
          ]
        }
      }

      this.dialogVisible = true
    },

    commitInfo() {
      let loadingInstance = Loading.service({ fullscreen: true })
      this.getTableFormData()
      const data = this.handparams(this.tableForm)
      const routeName = this.$route.name || ''
      if (routeName === 'addEventAnalysis') {
        httpService.logeventdeminconf(data).then(
          response => {
            //console.debug('response===',response.data)
            console.log('===')
            this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close()
            })
            if (+response.code === 200 && response.data) {
              console.log('-1===', response.data)
              this.$router.go(-1)
            } else {
              // alert(response.msg || '新增任务失败')
              this.canCommit = true
              this.$message.error(
                response.message ||
                  response.subMsg ||
                  response.msg ||
                  '创建分析事件失败!'
              )
            }
          },
          response => {
            this.canCommit = true

            this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close()
            })
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

            this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close()
            })
            if (+response.code === 200 && response.data) {
              // this.getTableList();
              this.$router.go(-1)
            } else {
              // alert(response.msg || '新增任务失败')
              this.canCommit = true
              this.$message.error(
                response.message ||
                  response.subMsg ||
                  response.msg ||
                  '编辑事件失败!'
              )
            }
          },
          response => {
            this.canCommit = true

            this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close()
            })
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

    getConditionType() {
      const data = {
        id: this.tableForm.eventId,
        field: this.tableForm.selectDemin
      }
      httpService.eventCondtionList(data).then(
        response => {
          //console.debug('response===',response.data)
          if (+response.code === 200 && response.data) {
            // this.getTableList();
            this.condition = response.data
          } else {
            // alert(response.msg || '新增任务失败')

            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                '获取维度枚举失败!'
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
    },

    resultTypeClick() {
      if (this.tableForm.eventId != null && this.tableForm.eventId != '') {
        this.getUserType()
      } else {
        this.userOptions = []
      }
    },
    eventChange(val) {
      console.log('event======', val)
      if (this.tableForm.eventId != null && this.tableForm.eventId != '') {
        let obj = {}
        console.log('obj0====', obj)
        console.log('typeOptions====', this.typeOptions)
        obj = this.typeOptions.find(item => {
          //这里的userRoleList就是上面遍历的数据源
          return item.id === this.tableForm.eventId //筛选出匹配数据
        })
        console.log('obj====', obj)
        if (obj && obj.type === 3) {
          this.showResultType = true
          this.tableForm.resultType = 'pv'
        } else {
          this.showResultType = false
          this.tableForm.resultType = null
        }
        this.getDimenList()
        // this.getUserType();
      } else {
        this.tableForm.selectDemin = []
        this.tableForm.resultType = ''
        this.deminOptions = []
        this.userOptions = []
      }
    },

    getUserType() {
      const data = this.tableForm.eventId
      httpService.getUserType(data).then(
        response => {
          //console.debug('response===',response.data)
          if (+response.code === 200) {
            if (response.data && response.data instanceof Array) {
              this.userOptions = response.data
            } else {
              this.userOptions = []
            }
          } else {
            this.userOptions = []
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                '请求服务器失败!'
            )
          }
        },
        response => {
          this.userOptions = []
          this.$message.error(
            response.message ||
              response.subMsg ||
              response.msg ||
              '请求服务器失败!'
          )
        }
      )
    },
    cancel() {
      this.$router.go(-1)
    },

    getDimenList() {
      const data = this.tableForm.eventId

      httpService.getDimenList(data).then(
        response => {
          //console.debug('response===',response.data)
          if (+response.code === 200) {
            if (response.data && response.data instanceof Array) {
              this.deminOptions = response.data
            } else {
              this.deminOptions = []
            }
          } else {
            this.deminOptions = []
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                '请求服务器失败!'
            )
          }
        },
        response => {
          this.deminOptions = []
          this.$message.error(
            response.message ||
              response.subMsg ||
              response.msg ||
              '请求服务器失败!'
          )
        }
      )
    },

    getEventType(routeName) {
      httpService.getEventType().then(
        response => {
          //console.debug('response===',response.data)
          if (+response.code === 200) {
            if (response.data && response.data instanceof Array) {
              let self = []
              let yuzhi = []
              let others = []
              response.data.forEach(element => {
                if (element.isSelf) {
                  self.push(element)
                } else if (element.type === 1) {
                  yuzhi.push(element)
                } else {
                  others.push(element)
                }
              })
              this.groupTypeOptions = [
                {
                  label: '我的',
                  options: self
                },
                {
                  label: '预置',
                  options: yuzhi
                },
                {
                  label: '其他',
                  options: others
                }
              ]

              this.typeOptions = response.data

              if (
                routeName === 'updateEventAnalysis' ||
                routeName === 'checkEventAnalysis'
              ) {
                this.getDetails(routeName)
              }
            } else {
              this.typeOptions = []
            }
          } else {
            this.typeOptions = []
            this.$message.error(
              response.message ||
                response.subMsg ||
                response.msg ||
                '请求服务器失败!'
            )
          }
        },
        response => {
          this.typeOptions = []
          this.$message.error(
            response.message ||
              response.subMsg ||
              response.msg ||
              '请求服务器失败!'
          )
        }
      )
    },

    getDetails(routeName) {
      const param = this.tableForm.id
      httpService.getDetails(param).then(
        response => {
          const detail = response.data || ''
          // this.tableForm.categoryPid = id;
          this.tableForm = detail
          //   this.tableForm.selectDeminList = this.tableForm.selectDemin.split(",")
          if (
            this.tableForm.conditionVal &&
            this.tableForm.conditionVal.length > 0
          ) {
            this.tagsFilterOptions =
              JSON.parse(this.tableForm.conditionVal) || []
          } else {
            this.tagsFilterOptions = []
          }
          console.log('tagsFilterOptions===', this.tagsFilterOptions)

          this.value2 = []
          if (this.tableForm.startDay && this.tableForm.endDay) {
            this.value2.push(this.tableForm.startDay)
            this.value2.push(this.tableForm.endDay)
          }

          // this.tableForm.selectDemin = [];
          this.$set(this.tableForm, 'selectDemin', [])
          if (this.tableForm.demin && this.tableForm.demin.indexOf(',') > -1) {
            this.tableForm.selectDemin = this.tableForm.demin.split(',')
          } else if (this.tableForm.demin.indexOf(',') === -1) {
            this.tableForm.selectDemin.push(this.tableForm.demin)
            this.$set(this.tableForm, 'selectDemin', this.tableForm.selectDemin)
          } else {
            this.tableForm.selectDemin = []
          }
          console.log('selectDemin===', this.tableForm.selectDemin)
          this.getDimenList()
          // this.getUserType();
          if (routeName === 'checkEventAnalysis') {
            this.limit = true
            this.disable = true
          }
          this.checkTable()
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

    getLine() {
      let that = this
      // 基于准备好的dom(myEchartPillar)，初始化echarts实例
      console.log('echarts===', JSON.stringify(echarts))
      let myChart = echarts.init(document.getElementById('myChart'))
      myChart.setOption(
        {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
            // axisPointer: {
            //   type: "cross",
            //   label: {
            //     backgroundColor: "#6a7985"
            //   }
            // }
          },
          legend: {
            data: that.legend
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: that.day
              // data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: that.series
        },
        true
      )
      //解决自适应
      setTimeout(function() {
        window.addEventListener('resize', () => {
          myChart.resize()
        })
      }, 500)
    },

    //参数处理
    handparams(param) {
      const self = this
      const params = JSON.parse(JSON.stringify(param))
      // for (const i in params) {
      //   if (params[i] === "") {
      //     delete params[i];
      //   }
      // }
      // console.log("data===" + JSON.stringify(params))
      return params
    }
  }
}
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.foot-page {
  float: right;
  margin-top: 10px;
  margin-bottom: 50px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.red_color .el-input__inner {
  color: rgb(255, 64, 64);
}
.el-select__tags {

    vertical-align: baseline;

}
.el-input__inner {

    vertical-align: baseline;

}
.filter_select .el-select__tags-text {
      display: inline-block;
      width: fit-content;
      max-width: 140px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap; 
}
.demin_select .el-select__tags-text {
      display: inline-block;
      width: fit-content;
      max-width: 40px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap; 
}
.el-select .el-tag__close.el-icon-close {
    background-color: #C0C4CC;
    right: -7px;
    top: -7px;
    color: #FFF;
}
</style>

