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
          <el-col :span="10">
            <el-form-item label="系统名称:">
              <el-input v-model="searchForm.appName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="系统CODE:">
              <el-input v-model="searchForm.appCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="生效开始时间:">
              <el-date-picker
                v-model="searchForm.searchAppStarttime"
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
          <el-col :span="10">
            <el-form-item label="生效结束时间:">
              <el-date-picker
                v-model="searchForm.searchAppEndtime"
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
              >清空</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <el-button type="primary" @click.native="changeAddModal(true)">新增</el-button>
      <el-table :data="tableData" border class="manage-table">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="appName" label="系统名称" width="180">
        </el-table-column>
        <el-table-column prop="appCode" label="系统code" width="180">
        </el-table-column>
        <el-table-column prop="appKey" label="密钥" width="200">
        </el-table-column>
        <el-table-column prop="appStarttime" label="生效开始时间" width="200">
        </el-table-column>
        <el-table-column prop="appEndtime" label="生效结束时间" width="200">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-view" @click="changeUpdateMOdal(scope.row,true,'detail')"
              >查看</el-button
            >
            <el-button type="text" size="small" icon="el-icon-edit"  @click="changeUpdateMOdal(scope.row,true,'update')"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              @click.native="deleteData(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <com-page :pager="searchForm.page" @query="getData"></com-page>
    </el-card>
    <add ref="addModal" @getData="getData"></add>
    <update ref="updateModal"  @getData="getData"></update>
  </div>
</template>

<script>
import Page from "@/components/page/page.vue";
import { findByCondition, deleteById } from "@/api/message/appmanage";
import add from "./modal/add"
import update from "./modal/update"
export default {
  components: {
    "com-page": Page,
    add,
    update
  },
  data() {
    return {
      searchForm: {
        searchAppStarttime: [],
        searchAppEndtime: [],
        page: {
          current: 1,
          size: 10,
          total: 0,
        },
        appName: "",
        appCode: "",
      },
      tableData: [],
    };
  },
  methods: {
    changeAddModal(status){
      this.$refs.addModal.showAddModal = status;
    },
    changeUpdateMOdal(data,status,type){
      this.$refs.updateModal.showUpdateModal = status;
      this.$refs.updateModal.type = type;
      this.$refs.updateModal.id = data.id;
    },
    //搜索提交
    onSearchSubmit() {
      if (this.searchForm.searchAppStarttime.length > 1) {
        this.searchForm.searchAppStarttime[1] = this.$moment(this.searchForm.searchAppStarttime[1]).format(
          "YYYY-MM-DD 23:59:59"
        );
      }
      if (this.searchForm.searchAppEndtime.length > 1) {
        this.searchForm.searchAppEndtime[1] = this.$moment(this.searchForm.searchAppStarttime[1]).format(
          "YYYY-MM-DD 23:59:59"
        );
      }
      this.getData();
    },
    //清空点击
    onClearSubmit() {
      this.searchForm.appName = "";
      this.searchForm.appCode = "";
      this.searchForm.searchAppStarttime = [];
      this.searchForm.searchAppEndtime = [];
      this.getData()
    },
    //获取数据
    getData() {
      findByCondition(this.searchForm).then((response) => {
        let result = response.data.data;
        this.searchForm.page.current = result.current;
        this.searchForm.page.size = result.size;
        this.searchForm.page.total = result.total;
        this.tableData = result.records;
      });
    },
    deleteData(data) {
      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          let id = data.id;
          deleteById(id).then(() => {
              this.$notify.success("删除成功");
              this.getData();
            }).catch(() => {
              this.$notify.error("删除失败");
            });
        }).catch(() => {
        });
    },
  },
  created() {
    this.getData();
  },
};
</script>
<style scoped>
.box-card {
  width: 100%;
}
.search-time {
  width: 255px;
}
.search-time >>> .el-range-separator {
  width: 14%;
}
.manage-table {
  margin-top: 10px;
  width: 100%;
}
.manage-table >>> .cell {
  text-align: center;
}
</style>