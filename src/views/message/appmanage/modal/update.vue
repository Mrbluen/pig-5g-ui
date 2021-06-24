<!--  -->
<template>
  <el-dialog
    :title="modalTitle"
    @close="closeUpdateModal"
    @open="whenUpdateModalOpen"
    :visible.sync="showUpdateModal"
    width="60%"
    class="add-modal"
  >
    <el-form ref="formRef" :model="saveForm" :rules="rules" label-width="120px">
      <el-divider content-position="left">应用信息设置</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="系统名称:" prop="appName">
            <el-input
              v-model="saveForm.appName"
              :disabled="!showAction"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统CODE:" prop="appCode">
            <el-input
              v-model="saveForm.appCode"
              :disabled="!showAction"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="生效开始时间:" prop="appStarttime">
            <el-date-picker
              v-model="saveForm.appStarttime"
              type="datetime"
              placeholder="选择开始时间"
              :disabled="!showAction"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生效结束时间:" prop="appEndtime">
            <el-date-picker
              v-model="saveForm.appEndtime"
              type="datetime"
              placeholder="选择结束时间"
              :disabled="!showAction"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">返回接口设置</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="接口返回地址:" prop="resInterface.resUri">
            <el-input
              v-model="saveForm.resInterface.resUri"
              :disabled="!showAction"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="返回方式:" prop="resMethod">
            <el-input
              v-model="saveForm.resInterface.resMethod"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="返回参数:" prop="resPara">
            <el-input
              v-model="saveForm.resInterface.resPara"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <template v-if="showAction">
        <el-button @click="closeUpdateModal">取 消</el-button>
        <el-button @click="saveUpdateModal('formRef')" type="primary"
          >保 存</el-button
        >
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { findById,updateById } from "@/api/message/appmanage";
export default {
  data() {
    return {
      modalTitle: "", //标题
      showUpdateModal: false,
      type: "", //打开当前为detail，还是update
      showAction: false, //底部选项和disabled
      id: "",
      saveForm: {
        appName: "",
        appCode: "",
        appStarttime: "",
        appEndtime: "",
        resInterface: {
          resUri: "",
          resMethod: "post",
          resPara: "待定",
        },
      },
      rules: {
        appName: [
          { required: true, message: "请输入系统名称", trigger: "blur" },
        ],
        appCode: [
          { required: true, message: "请输入系统code", trigger: "blur" },
        ],
        appStarttime: [
          { required: true, message: "请选择生效开始时间", trigger: "blur" },
        ],
        appEndtime: [
          { required: true, message: "请选择生效结束时间", trigger: "blur" },
        ],
        "resInterface.resUri": [
          { required: true, message: "请输入返回接口地址", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    closeUpdateModal() {
      this.showUpdateModal = false;
    },
    whenUpdateModalOpen() {
      this.getDetail();
      if (this.type === "detail") {
        this.modalTitle = "详情";
        this.showAction = false;
      }
      if (this.type === "update") {
        this.modalTitle = "修改";
        this.showAction = true;
      }
    },
    //获取详情
    getDetail() {
      findById(this.id)
        .then((response) => {
          this.saveForm = response.data.data;
        })
        .catch(() => {
          this.$notify.error("获取详情失败");
        });
    },
    saveUpdateModal(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
            this.saveForm.appStarttime = this.$moment(this.saveForm.appStarttime).format("YYYY-MM-DD HH:mm:ss")
            this.saveForm.appEndtime = this.$moment(this.saveForm.appEndtime).format("YYYY-MM-DD HH:mm:ss")
            console.log(this.saveForm);
            updateById(this.saveForm).then(() => {
              this.$notify.success("修改成功");
              this.$emit("getData")
              this.showUpdateModal = false;
            }).catch(() => {
              this.$notify.error("修改失败");
            })
        } else {
          return false;
        }
      });
    },
  },
  created() {},
};
</script>
<style lang='less' scoped>
</style>