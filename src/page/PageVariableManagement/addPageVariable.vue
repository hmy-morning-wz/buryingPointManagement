<template>
  <div style="overflow-x:scroll;height:100%;">
    <el-scrollbar style="height:100%;">
      <template>
        <div>
          <el-row class="mr20">
            <el-col :span="24">
              <span class="float-left ml20 mt20">{{title}}</span>
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
            <el-form-item label="变量名称：" prop="variName">
              <el-input
                :disabled="disable"
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
            <el-form-item label="类型" prop="variType">
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
            <el-form-item label="活动描述：" prop="descr">
              <el-input
                :disabled="disable"
                placeholder="活动描述"
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
<script>
import httpService from "../../service/EventVariableManagement/httpService.js";
// import apiHost from "@/hostconfig/index";
export default {
  data() {
    return {
      

      title: "",
      disable: false,
      limit: false,
      typeOptions: [
          {
              id:1,
              label:"字符串"
          },
          {
              id:2,
              label:"整数"
          },
          {
              id:3,
              label:"小数"
          },
      ],
      tableForm: {
        
      },
      rules: {
        variName: [
          { required: true, message: "请输入变量名称", trigger: "blur" }
          // { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],

        identifyName: [
          { required: true, message: "请输入标识符", trigger: "blur" }
          // { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        descr: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ],
        variType: [
            { required: true, message: "请选择类型", trigger: "change" }
        ],
      },
    };
  },
  created() {
    const routeName = this.$route.name || "";
    const id = this.$route.query.id || "";
    console.log("id===", id);
    
    // this.getType(routeName);
    if (routeName === "addPageVariable") {
      // this.tableForm.goodsId = 5;
      //   this.getDetails(routeName);
      this.title = "变量详情";
    } else if (routeName === "checkPageVariable") {
        this.tableForm.id = id;
      this.title = "变量详情";
      this.getDetails(routeName);
    } else if (routeName === "updatePageVariable") {
        this.tableForm.id = id;
      this.title = "变量详情";
      this.getDetails(routeName);
    }
  },
  methods: {

  
    submitForm(formName) {

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.commitInfo();
        } else {
          //console.log('提交失败!!')
          return false;
        }
      });
    },
    cancel() {
      this.$router.go(-1);
    },
 
    getType(routeName){
        const data = 'webtrack_type';
        httpService.getType(data).then(
          response => {
            //console.debug('response===',response.data)
            this.typeOptions = response;
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
    },
    // 新增任务、编辑任务
    commitInfo() {
      
      const data = this.handparams(this.tableForm);
      //   console.log("data===",data)
      const routeName = this.$route.name || "";

      if (routeName === "addPageVariable") {
        httpService.logappconf(data).then(
          response => {
            //console.debug('response===',response.data)
            if (+response.code === 200 && response.data) {
              //   this.$router.push({ path: "/merchandiseManagement" });
              this.$router.go(-1);
            } else {
              // alert(response.msg || '新增任务失败')
              this.$message.error(
                response.message ||
                  response.subMsg ||
                  response.msg ||
                  "创建应用失败!"
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
      } else {
        httpService.updateEventVariable(data).then(
          response => {
            //console.debug('response===',response.data)
            if (+response.code === 200 && response.data) {
              this.$router.go(-1);
            } else {
              // alert(response.msg || '新增任务失败')
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
    getDetails(routeName) {
      const param = this.tableForm.id;
      httpService.getDetails(param).then(
        response => {
          const detail = response.data || "";
          // this.tableForm.categoryPid = id;
          this.tableForm = detail;
          if (routeName === "checkPageVariable") {
            this.limit = true;
            this.disable = true;
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
    //参数处理
    handparams(param) {
      const self = this;
      const params = JSON.parse(JSON.stringify(param));
      // for (const i in params) {
      //   if (params[i] === "") {
      //     delete params[i];
      //   }
      // }
      // console.log("data===" + JSON.stringify(params))
      return params;
    }
  }
};
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
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
.red_color .el-input__inner  {
  color: rgb(255, 64, 64);
}
</style>

