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
          <el-col :span="8">
            <el-form-item label="广告来源:">
              <el-input v-model="searchForm.adBelong"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="广告标题:">
              <el-input v-model="searchForm.adTitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="广告类型:">
              <el-select v-model="searchForm.adType" placeholder="请选择">
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
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="生效开始时间:">
              <el-date-picker
                v-model="searchForm.searchStarttime"
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
          <el-col :span="8">
            <el-form-item label="生效结束时间:">
              <el-date-picker
                v-model="searchForm.searchEndtime"
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
          <el-col :span="8" style="text-align: center">
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
        <el-button type="primary" @click.native="changeAddModal(true)"
          >新增</el-button
        >
        <el-table :data="tableData" border class="manage-table">
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="adBelong" label="广告来源" width="180">
          </el-table-column>
          <el-table-column prop="adTitle" label="广告标题" width="180">
          </el-table-column>
          <el-table-column prop="adType" label="广告类型" width="200">
          </el-table-column>
          <el-table-column prop="startTime" label="生效开始时间" width="200">
          </el-table-column>
          <el-table-column prop="endTime" label="生效结束时间" width="200">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-view"
                @click="changeUpdateMOdal(scope.row, true, 'detail')"
                >查看</el-button
              >
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="changeUpdateMOdal(scope.row, true, 'update')"
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
      </el-form>
      <com-page :pager="searchForm.page" @query="getData"></com-page>
    </el-card>
    <add-modal
      ref="addModal"
      :adTypeOptions="adTypeOptions"
      @getData="getData"
    ></add-modal>
    <update-modal
      ref="updateModal"
      :adTypeOptions="adTypeOptions"
      @getData="getData"
    ></update-modal>
  </div>
</template>

<script>
import Page from "@/components/page/page.vue";
import { findByCondition, deleteById } from "@/api/message/ads";
import addModal from "./modal/add";
import updateModal from "./modal/update";
export default {
  components: {
    "com-page": Page,
    addModal,
    updateModal,
  },
  data() {
    return {
      searchForm: {
        adBelong: "",
        adTitle: "",
        adType: "",
        searchStarttime: [],
        searchEndtime: [],
        page: {
          current: 1,
          size: 10,
          total: 0,
        },
      },
      adTypeOptions: [
        {
          value: "business",
          label: "商业广告",
        },
        {
          value: "culture",
          label: "文化广告",
        },
        {
          value: "society",
          label: "社会广告",
        },
        {
          value: "government",
          label: "政府公告",
        },
      ],
      tableData: [],
    };
  },
  methods: {
    changeAddModal(status) {
      this.$refs.addModal.showAddModal = status;
    },
    //搜索提交
    onSearchSubmit() {
      if (this.searchForm.searchStarttime.length > 1) {
        this.searchForm.searchStarttime[1] = this.$moment(
          this.searchForm.searchStarttime[1]
        ).format("YYYY-MM-DD 23:59:59");
      }
      if (this.searchForm.searchEndtime.length > 1) {
        this.searchForm.searchEndtime[1] = this.$moment(
          this.searchForm.searchEndtime[1]
        ).format("YYYY-MM-DD 23:59:59");
      }
      this.getData();
    },
    //清空点击
    onClearSubmit() {
      this.searchForm.adBelong = "";
      this.searchForm.adTitle = "";
      this.searchForm.adType = "";
      this.searchForm.searchStarttime = [];
      this.searchForm.searchEndtime = [];
      this.getData();
    },
    getData() {
      findByCondition(this.searchForm).then((response) => {
        let result = response.data.data;
        this.searchForm.page.current = result.current;
        this.searchForm.page.size = result.size;
        this.searchForm.page.total = result.total;
        this.tableData = result.records;
      });
    },
    changeUpdateMOdal(data, status, type) {
      this.$refs.updateModal.showUpdateModal = status;
      this.$refs.updateModal.type = type;
      this.$refs.updateModal.id = data.id;
    },
    deleteData(data) {
      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let id = data.id;
          deleteById(id)
            .then(() => {
              this.$notify.success("删除成功");
              this.getData();
            })
            .catch(() => {
              this.$notify.error("删除失败");
            });
        })
        .catch(() => {});
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
  width: 230px;
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