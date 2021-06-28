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
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="广告来源:" prop="adBelong">
            <el-input
              v-model="saveForm.adBelong"
              :disabled="!showAction"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="广告标题:" prop="adTitle">
            <el-input
              v-model="saveForm.adTitle"
              :disabled="!showAction"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="广告类型:" prop="adType">
            <el-select
              v-model="saveForm.adType"
              :disabled="!showAction"
              placeholder="请选择"
            >
              <el-option
                v-for="item in adTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="广告内容:" prop="adContent">
            <el-input
              type="textarea"
              :rows="2"
              v-model="saveForm.adContent"
              :disabled="!showAction"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="生效开始时间:" prop="startTime">
            <el-date-picker
              v-model="saveForm.startTime"
              type="datetime"
              placeholder="选择开始时间"
              :disabled="!showAction"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生效结束时间:" prop="endTime">
            <el-date-picker
              v-model="saveForm.endTime"
              type="datetime"
              placeholder="选择结束时间"
              :disabled="!showAction"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-form-item label="广告宣传图:" prop="filePath">
          <el-col :span="12">
            <el-upload
              action="/upload/uploadFile"
              list-type="picture-card"
              :headers="myHeader"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :limit="1"
              :disabled="!showAction"
              :file-list="fileList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="saveForm.filePath" alt="" />
            </el-dialog>
          </el-col>
        </el-form-item>
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
import store from "@/store"; // progress bar style
import { deleteFile, findById, updateById } from "@/api/message/ads";
export default {
  props: {
    adTypeOptions: {
      type: Array,
    },
  },
  data() {
    return {
      modalTitle: "", //标题
      showUpdateModal: false,
      type: "", //打开当前为detail，还是update
      showAction: false, //底部选项和disabled
      id: "",
      saveForm: {},
      dialogVisible: false, //预览
      myHeader: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      fileList: [],
      rules: {
        adBelong: [
          { required: true, message: "请输入广告来源", trigger: "blur" },
        ],
        adTitle: [
          { required: true, message: "请输入广告标题", trigger: "blur" },
        ],
        adType: [
          { required: true, message: "请输入广告类型", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请选择生效开始时间", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请选择生效结束时间", trigger: "blur" },
        ],
        filePath: [
          { required: true, message: "请选择上传广告宣传图", trigger: "blur" },
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
    getDetail() {
      this.fileList = [];
      findById(this.id).then((response) => {
        this.saveForm = response.data.data;
        let obj = {
          name: this.saveForm.groupPath,
          url: this.saveForm.filePath,
        };
        this.fileList.push(obj);
      });
    },
    //上传之前
    beforeAvatarUpload(file) {
      const isImg = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImg) {
        this.$message.error("上传头像图片只能是 JPG、png、 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isImg && isLt2M;
    },
    //上传成功
    handleAvatarSuccess(res, file) {
      this.saveForm.filePath = res.data.filePath;
      this.saveForm.groupPath = res.data.groupPath;
    },
    //删除
    handleRemove(file, fileList) {
      if (this.saveForm.groupPath && this.saveForm.filePath) {
        let obj = {
          filePath: this.saveForm.groupPath,
        };
        deleteFile(obj).then((response) => {
          this.$notify.success("删除成功");
        });
      }
    },
    //缩略图预览
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
    },
    //保存修改
    saveUpdateModal(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveForm.startTime = this.$moment(
            this.saveForm.startTime
          ).format("YYYY-MM-DD HH:mm:ss");
          this.saveForm.endTime = this.$moment(this.saveForm.endTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          updateById(this.saveForm)
            .then(() => {
              this.$notify.success("修改成功");
              this.$emit("getData");
              this.showUpdateModal = false;
            })
            .catch(() => {
              this.$notify.error("修改失败");
            });
        }
      });
    },
  },
};
</script>
<style scoped>
</style>