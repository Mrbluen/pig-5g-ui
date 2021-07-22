<!--  -->
<template>
  <div class="basic-container calendar-list-container">
    <el-card class="box-card">
      <el-form ref="searchform" :model="searchform" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="接入应用:">
              <el-select
                v-model="searchform.appKey"
                placeholder="请选择接入应用"
              >
                <el-option
                  v-for="item in appManageList"
                  :key="item.id"
                  :label="item.appName"
                  :value="item.appKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="消息状态:">
              <el-select
                v-model="searchform.isSendSuccess"
                placeholder="请选择应用状态"
              >
                <el-option label="发送成功" value="0"></el-option>
                <el-option label="发送失败" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="onSearchSubmit"
              >查询</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-delete"
              @click="onClearSubmit"
              >重置</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="dataList" style="width: 100%">
          <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="appName" label="应用名称" width="180">
        </el-table-column>
        <el-table-column prop="deleted" label="应用状态" width="180">
        </el-table-column>
        <el-table-column prop="sendCount" label="发送统计" width="180"> 
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { findByCondition, countByCondition } from "@/api/message/appmanage";
export default {
  data() {
    return {
      searchform: {
        appKey: "",
        isSendSuccess: "0",
      },
      appManageList: [],
      dataList: [],
    };
  },
  methods: {
    onSearchSubmit() {
      countByCondition(this.searchform).then((response) => {
        this.dataList = response.data.data
        for(let i in this.dataList){
            if(this.dataList[i].deleted == 0){
                this.dataList[i].deleted = "正常"
            }
            if(this.dataList[i].deleted == 1){
                this.dataList[i].deleted = "停用"
            }
        }
      });
    },
    onClearSubmit() {
      this.searchform.appKey = "";
      this.searchform.isSendSuccess = "0";
      this.onSearchSubmit()
    },
    getAppManage() {
      let obj = {
        deleted: 0,
      };
      findByCondition(obj).then((response) => {
        this.appManageList = response.data.data;
      });
    },
  },
  created() {
    this.getAppManage();
    this.onSearchSubmit()
  },
};
</script>
<style  scoped>
</style>