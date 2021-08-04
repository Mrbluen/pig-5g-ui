<!--  -->
<template>
  <div class="basic-container calendar-list-container">
    <el-card class="box-card">
      <el-form
        ref="searchForm"
        :inline="true"
        :model="searchForm"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="查询应用:">
              <el-select v-model="searchForm.sendAppKey" placeholder="请选择">
                <el-option
                  v-for="item in appManageList"
                  :key="item.id"
                  :label="item.appName"
                  :value="item.appKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接收手机号:">
              <el-input v-model="searchForm.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发送时间:">
              <el-date-picker
                v-model="searchForm.searchSendStarttime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="search-time"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
              >清空</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="tableData" border class="manage-table">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="sendAppKey" label="发送方" width="180">
        </el-table-column>
        <el-table-column prop="code" label="消息验证码" width="180">
        </el-table-column>
        <el-table-column prop="isSendSuccess" label="是否发送成功" width="180">
        </el-table-column>
        <el-table-column prop="insertTime" label="插入时间" width="180">
        </el-table-column>
        <el-table-column prop="sendTime" label="发送时间" width="180">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="180">
        </el-table-column>
      </el-table>
      <com-page :pager="searchForm.page" @query="getData"></com-page>
    </el-card>
  </div>
</template>

<script>
import { findByCondition } from "@/api/message/appmanage";
import { findRecordByCondition } from "@/api/message/sendRecord";
import Page from "@/components/page/page.vue";
export default {
  components: {
    "com-page": Page,
  },
  data() {
    return {
      searchForm: {
        sendAppKey: "",
        phone: "",
        searchSendStarttime: [],
        page: {
          current: 1,
          size: 10,
          total: 0,
        },
      },
      appManageList: [],
      tableData: [],
    };
  },
  methods: {
    onSearchSubmit() {
      if (this.searchForm.searchSendStarttime.length > 1) {
        this.searchForm.searchSendStarttime[1] = this.$moment(this.searchForm.searchSendStarttime[1]).format(
          "YYYY-MM-DD 23:59:59"
        );
      }
      this.searchForm.page.current = 1
      this.searchForm.page.size = 10
      this.getData()
    },
    onClearSubmit() {
      this.searchForm.searchSendStarttime = []
      this.searchForm.sendAppKey = ""
      this.searchForm.phone = ""
      this.searchForm.page.current = 1
      this.searchForm.page.size = 10
      this.getData()
    },
    getAppManageList() {
      findByCondition({}).then((response) => {
        this.appManageList = response.data.data;
        this.getData();
      });
    },
    getData() {
      findRecordByCondition(this.searchForm).then((response) => {
        console.log(response);
        this.tableData = response.data.data.records;
        this.searchForm.page.current = response.data.data.current;
        this.searchForm.page.size = response.data.data.size;
        this.searchForm.page.total = response.data.data.total;
        for (let i in this.tableData) {
          if(this.tableData[i].isSendSuccess == 0){
            this.tableData[i].isSendSuccess = "发送成功"
          }else{
            this.tableData[i].isSendSuccess = "发送失败"
          }
          for (let j in this.appManageList) {
            if (this.tableData[i].sendAppKey == this.appManageList[j].appKey) {
              this.tableData[i].sendAppKey = this.appManageList[j].appName;
              break;
            }
          }
        }
      });
    },
  },
  created() {
    this.getAppManageList();
   
  },
};
</script>
<style scoped>
.manage-table >>> .cell {
  text-align: center;
}
</style>