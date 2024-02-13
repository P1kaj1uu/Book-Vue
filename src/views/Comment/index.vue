<template>
  <div class="comment-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <div class="query-box">
      <div class="username">
        <div class="desc">发布用户：</div>
        <el-input v-model="username" placeholder="请输入用户"></el-input>
      </div>
      <div class="content">
        <div class="desc">发布内容：</div>
        <el-input v-model="content" placeholder="请输入内容"></el-input>
      </div>
      <el-button type="primary" class="distance" @click="queryComment"
        >查询</el-button
      >
      <el-button @click="clearContent">重置</el-button>
    </div>

    <el-table
      :data="commentList"
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
          <p>{{ scope.row.username }}</p>
        </template>
      </el-table-column>
      <el-table-column label="发布内容">
        <template slot-scope="scope">
          <p>{{ scope.row.content }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="this.userInfo.role === '管理员'">
        <template slot-scope="scope">
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
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb.vue";
import {
  commentListAPI,
  commentByNameAPI,
  deleteCommentAPI,
} from "@/api/comment";
import { mapState } from "vuex";

export default {
  name: "Comment",
  components: {
    BreadCrumb,
  },
  computed: {
    ...mapState("User", ["userInfo"]),
  },
  data() {
    return {
      currentBreadName: "评论",
      commentList: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      username: "",
      content: "",
    };
  },
  methods: {
    async getCommentList() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await commentListAPI(req);
      this.commentList = res.data.list;
      this.total = res.data.total;
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            bookId: row.bookId,
          };
          const res = await deleteCommentAPI(req);
          if (res.code === 200) {
            this.$message.success("删除评论成功");
            this.getCommentList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCommentList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getCommentList();
    },
    async queryComment() {
      if (!this.username && !this.content) {
        this.getCommentList();
        return;
      }
      const req = {
        username: this.username,
        content: this.content,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await commentByNameAPI(req);
      this.commentList = res.data.list;
      this.total = res.data.total;
    },
    clearContent() {
      this.username = "";
      this.content = "";
    },
  },
  created() {
    this.getCommentList();
  },
};
</script>

<style lang="less" scoped>
.comment-container {
  .query-box {
    display: flex;
    align-items: center;
    .username {
      display: flex;
      align-items: center;
      .desc {
        width: 120px;
      }
    }
    .content {
      margin-left: 25px;
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
</style>
