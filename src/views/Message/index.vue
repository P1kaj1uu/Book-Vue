<template>
  <div class="message-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <div class="query-box">
      <div class="left">
        <el-date-picker
          v-model="currentTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
        <el-button type="primary" class="distance" @click="queryByTime"
          >查询</el-button
        >
        <el-button @click="clearTime">重置</el-button>
      </div>
      <div class="right" v-if="this.userInfo.role === '管理员'">
        <el-button type="primary" @click="addMessage">新增公告</el-button>
      </div>
    </div>

    <el-table
      :data="messageList"
      border
      height="450"
      style="width: 100%; margin: 20px auto"
    >
      <el-table-column label="发布日期">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布用户">
        <template slot-scope="scope">
          <p>{{ scope.row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="发布内容">
        <template slot-scope="scope">
          <p>{{ scope.row.content }}</p>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogMessageVisible" :show-close="false">
      <el-form :model="messageForm" ref="messageFormRef">
        <el-form-item label="公告内容" label-width="120">
          <el-input
            v-model="messageForm.content"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeMessageDialog">取 消</el-button>
        <el-button type="primary" @click="changeMessage"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb.vue";
import {
  messageListAPI,
  messageByTimeAPI,
  addMessageAPI,
  editMessageAPI,
  deleteMessageAPI,
} from "@/api/message";
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
      dialogMessageVisible: false,
      dialogTitle: "",
      messageForm: {
        content: "",
      },
      messageId: 0,
      currentBreadName: "公告",
      messageList: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      currentTime: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  methods: {
    async getMessageList() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await messageListAPI(req);
      this.messageList = res.data.list;
      this.total = res.data.total;
    },
    async queryByTime() {
      if (!this.currentTime) {
        this.getMessageList();
        return;
      }
      let time = filters.toTime(this.currentTime);
      const req = {
        createTime: time,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await messageByTimeAPI(req);
      this.messageList = res.data.list;
      this.total = res.data.total;
    },
    clearTime() {
      this.currentTime = "";
    },
    addMessage() {
      this.dialogTitle = "新增公告";
      this.dialogMessageVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = "编辑公告";
      this.dialogMessageVisible = true;
      this.messageForm.content = row.content;
      this.messageId = row.id;
    },
    async changeMessage() {
      if (!this.messageForm.content.trim()) {
        this.$message.warning('请输入公告内容');
        return;
      }
      if (this.dialogTitle === "新增公告") {
        const req = {
          id: Math.round(Math.random() * 9999) + 1,
          name: this.userInfo.name || this.userInfo.username,
          content: this.messageForm.content,
          createTime: filters.toTime(new Date()),
        };
        const res = await addMessageAPI(req);
        this.dialogMessageVisible = false;
        if (res.code === 200) {
          this.$message.success("新增公告成功");
          this.getMessageList();
        } else {
          this.$message.error(res.msg);
        }
      } else {
        const req = {
          id: this.messageId,
          content: this.messageForm.content,
        };
        const res = await editMessageAPI(req);
        this.dialogMessageVisible = false;
        if (res.code === 200) {
          this.$message.success("编辑公告成功");
          this.getMessageList();
        } else {
          this.$message.error(res.msg);
        }
      }
    },
    closeMessageDialog() {
      this.messageForm.content = "";
      this.dialogMessageVisible = false;
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该公告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            messageId: row.id,
          };
          const res = await deleteMessageAPI(req);
          if (res.code === 200) {
            this.$message.success("删除公告成功");
            this.getMessageList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getMessageList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getMessageList();
    },
  },
  created() {
    this.getMessageList();
  },
};
</script>

<style lang="less" scoped>
.message-container {
  .query-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      .distance {
        margin-left: 25px;
      }
    }
  }
}
</style>
