<template>
  <el-dialog
    title="新增"
    @close="closeAddModal"
    :visible.sync="showAddModal"
    width="60%"
    class="add-modal"
  >
    <el-form ref="formRef" :model="saveForm" :rules="rules" label-width="120px">
      <el-divider content-position="left">应用信息设置</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="系统名称:" prop="appName">
            <el-input v-model="saveForm.appName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统CODE:" prop="appCode">
            <el-input v-model="saveForm.appCode"></el-input>
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
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">返回接口设置</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="接口返回地址:" prop="resInterface.resUri">
            <el-input v-model="saveForm.resInterface.resUri"></el-input>
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
      <el-button @click="closeAddModal">取 消</el-button>
      <el-button type="primary" @click="saveAddModal('formRef')">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save } from "@/api/message/appmanage";
export default {
  data() {
    return {
      showAddModal: false,
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
        'resInterface.resUri': [
          { required: true, message: "请输入返回接口地址", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    closeAddModal() {
      this.showAddModal = false;
    },
    saveAddModal(formName) {
       this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveForm.appStarttime = this.$moment(this.saveForm.appStarttime).format("YYYY-MM-DD HH:mm:ss")
            this.saveForm.appEndtime = this.$moment(this.saveForm.appEndtime).format("YYYY-MM-DD HH:mm:ss")
            save(this.saveForm).then(() => {
              this.$notify.success("保存成功");
              this.$emit("getData")
              this.showAddModal = false;
            }).catch(() => {
              this.$notify.error("保存失败");
            });
          } else {
            return false;
          }
        });
    },
  },
};
</script>

<style scoped>
.add-modal {
  border-radius: 5px;
}
.add-modal >>> .el-divider__text.is-left {
  color: #b8b3b3;
  font-size: 13px;
}
</style>>
