<template>
  <div class="type-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <div class="query-box">
      <div class="left">
        <div class="name">
          <div class="desc">图书类别：</div>
          <el-input v-model="name" placeholder="请输入图书类别名称"></el-input>
        </div>
        <el-button type="primary" class="distance" @click="queryByName"
          >查询</el-button
        >
        <el-button @click="clearName">重置</el-button>
      </div>
      <div class="right" v-if="this.userInfo.role === '管理员'">
        <el-button type="primary" @click="addType">新增图书类别</el-button>
      </div>
    </div>

    <el-table
      :data="typeList"
      border
      height="450"
      style="width: 100%; margin: 20px auto"
    >
      <el-table-column label="类别名称">
        <template slot-scope="scope">
          <p>{{ scope.row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="this.userInfo.role === '管理员'">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next"
      :total="total"
    >
    </el-pagination>

    <el-dialog :title="dialogTitle" :visible.sync="dialogTypeVisible" :show-close="false">
      <el-form :model="typeForm" ref="typeFormRef">
        <el-form-item label="图书类别" label-width="120">
          <el-input
            v-model="typeForm.name"
            placeholder="请输入图书类别名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeTypeDialog">取 消</el-button>
        <el-button type="primary" @click="changeType"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb.vue";
import {
  typeListAPI,
  typeByNameAPI,
  editTypeAPI,
  addTypeAPI,
  deleteTypeAPI,
} from "@/api/type";
import { mapState } from "vuex";
import filters from "@/utils/time";

export default {
  name: "Message",
  components: {
    BreadCrumb,
  },
  computed: {
    ...mapState("User", ["userInfo"]),
  },
  data() {
    return {
      dialogTypeVisible: false,
      dialogTitle: "",
      typeForm: {
        name: "",
      },
      typeId: 0,
      currentBreadName: "类别",
      typeList: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      name: "",
    };
  },
  methods: {
    async getTypeList() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await typeListAPI(req);
      this.typeList = res.data.list;
      this.total = res.data.total;
    },
    async queryByName() {
      if (!this.name) {
        this.getTypeList();
        return;
      }
      const req = {
        name: this.name,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await typeByNameAPI(req);
      this.typeList = res.data.list;
      this.total = res.data.total;
    },
    clearName() {
      this.name = "";
    },
    addType() {
      this.dialogTitle = "新增图书类别";
      this.dialogTypeVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = "编辑图书类别";
      this.dialogTypeVisible = true;
      this.typeForm.name = row.name;
      this.typeId = row.id;
    },
    async changeType() {
      if (!this.typeForm.name.trim()) {
        this.$message.warning('请输入图书类别名称');
        return;
      }
      if (this.dialogTitle === "新增图书类别") {
        const req = {
          id: Math.round(Math.random() * 9999) + 1,
          name: this.typeForm.name,
        };
        const res = await addTypeAPI(req);
        this.dialogTypeVisible = false;
        if (res.code === 200) {
          this.$message.success("新增图书类别成功");
          this.getTypeList();
        } else {
          this.$message.error(res.msg);
        }
      } else {
        const req = {
          id: this.typeId,
          name: this.typeForm.name,
        };
        const res = await editTypeAPI(req);
        this.dialogTypeVisible = false;
        if (res.code === 200) {
          this.$message.success("编辑图书类别成功");
          this.getTypeList();
        } else {
          this.$message.error(res.msg);
        }
      }
    },
    closeTypeDialog() {
      this.typeForm.name = "";
      this.dialogTypeVisible = false;
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该图书类别, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            typeId: row.id,
          };
          const res = await deleteTypeAPI(req);
          if (res.code === 200) {
            this.$message.success("删除图书类别成功");
            this.getTypeList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTypeList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getTypeList();
    },
  },
  created() {
    this.getTypeList();
  },
};
</script>

<style lang="less" scoped>
.type-container {
  .query-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      .name {
        display: flex;
        align-items: center;
        .desc {
          width: 120px;
        }
      }
      .distance {
        margin-left: 25px;
      }
    }
  }
}
</style>
