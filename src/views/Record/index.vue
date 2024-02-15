<template>
  <div class="record-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <div class="query-box">
      <div class="username">
        <div class="desc">用户名：</div>
        <el-input v-model="username" placeholder="请输入用户名"></el-input>
      </div>
      <div class="bookName">
        <div class="desc">图书名：</div>
        <el-input v-model="bookName" placeholder="请输入图书名"></el-input>
      </div>
      <div class="isSend">
        <div class="desc">是否归还：</div>
        <el-select v-model="isSend" placeholder="请选择是否归还">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" class="distance" @click="queryComment"
        >查询</el-button
      >
      <el-button @click="clearContent">重置</el-button>
    </div>

    <el-table
      :data="recordList"
      border
      height="450"
      style="width: 100%; margin: 20px auto"
    >
      <el-table-column label="借阅用户" width="100">
        <template slot-scope="scope">
          <p>{{ scope.row.username }}</p>
        </template>
      </el-table-column>
      <el-table-column label="借阅图书" width="100">
        <template slot-scope="scope">
          <p>{{ scope.row.bookName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="图书作者" width="100">
        <template slot-scope="scope">
          <p>{{ scope.row.bookAuthor }}</p>
        </template>
      </el-table-column>
      <el-table-column label="是否归还" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isSend === 0 ? 'danger' : ''">{{ scope.row.isSend === 0 ? '未归还' : '已归还' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="借阅日期">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.leadTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应还日期">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ ddlTime(scope.row.leadTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归还日期">
        <template slot-scope="scope">
          <i class="el-icon-time" v-if="scope.row.sendTime"></i>
          <span style="margin-left: 10px">{{ scope.row.sendTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="userInfo.role === '管理员' && scope.row.isSend === 0" size="mini" type="primary" @click="handleRemind(scope.row)"
            >提醒</el-button
          >
          <el-button v-if="userInfo.role === '用户' && scope.row.isSend === 0" size="mini" type="primary" @click="handleLead(scope.row)"
            >续借</el-button
          >
          <el-button v-if="userInfo.role === '用户' && scope.row.isSend === 0" size="mini" type="primary" @click="handleSend(scope.row)"
            >归还</el-button
          >
          <el-button v-if="userInfo.role === '用户'" size="mini" type="danger" @click="handleDelete(scope.row)"
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
  recordListAPI,
  recordByUserAPI,
  recordByOtherAPI,
  deleteRecordAPI,
  continueRecordAPI,
  sendRecordAPI,
} from "@/api/record";
import {
  bookByNameAPI,
  editBookNumAPI,
} from "@/api/book";
import { mapState } from "vuex";
import filters from "@/utils/time";

export default {
  name: "Record",
  components: {
    BreadCrumb,
  },
  computed: {
    ...mapState("User", ["userInfo"]),
  },
  data() {
    return {
      currentBreadName: "借阅归还",
      recordList: [],
      bookList: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      username: "",
      bookName: "",
      isSend: 2,
      options: [
        {
          value: 2,
          label: "全部",
        },
        {
          value: 0,
          label: "未归还",
        },
        {
          value: 1,
          label: "已归还",
        }
      ],
    };
  },
  methods: {
    ddlTime(time) {
      let timestamp = new Date(time).getTime() + 24 * 60 * 60 * 1000 * 7;
      return filters.toTime(timestamp);
    },
    async getRecordList() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await recordListAPI(req);
      this.recordList = res.data.list;
      this.total = res.data.total;
    },
    async getMyRecordList() {
      const req = {
        userId: this.userInfo.id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await recordByUserAPI(req);
      this.recordList = res.data.list;
      this.total = res.data.total;
    },
    handleDelete(row) {
      if (row.isSend === 0) {
        this.$message.warning("该书尚无归还，无法删除此条借阅记录");
        return;
      }
      this.$confirm("此操作将永久删除该借阅记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            recordId: row.id,
          };
          const res = await deleteRecordAPI(req);
          if (res.code === 200) {
            this.$message.success("删除借阅成功");
            this.userInfo.role === '管理员' ? this.getRecordList() : this.getMyRecordList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleRemind(row) {
      this.$message.success(`已提醒用户：${row.username}及时归还图书`);
    },
    async handleLead(row) {
      let timestamp = new Date(row.leadTime).getTime() + 24 * 60 * 60 * 1000 * 3;
      const req = {
        id: row.id,
        isSend: 0,
        leadTime: filters.toTime(timestamp),
      };
      const res = await continueRecordAPI(req);
      if (res.code === 200) {
        this.$message.success("续借成功");
        this.userInfo.role === '管理员' ? this.getRecordList() : this.getMyRecordList();
      } else {
        this.$message.error(res.msg);
      }
    },
    async queryBook(row) {
      const req = {
        name: row.bookName,
        author: row.bookAuthor,
        type: "",
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await bookByNameAPI(req);
      this.bookList = res.data.list;
    },
    async changeNum() {
      const req = {
        id: this.bookList[0].id,
        num: this.bookList[0].num + 1,
      };
      await editBookNumAPI(req);
    },
    async handleSend(row) {
      await this.queryBook(row);
      const req = {
        id: row.id,
        isSend: 1,
        sendTime: filters.toTime(new Date()),
      };
      const res = await sendRecordAPI(req);
      if (res.code === 200) {
        this.changeNum();
        this.$message.success("归还成功");
        this.userInfo.role === '管理员' ? this.getRecordList() : this.getMyRecordList();
      } else {
        this.$message.error(res.msg);
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.userInfo.role === '管理员' ? this.getRecordList() : this.getMyRecordList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.userInfo.role === '管理员' ? this.getRecordList() : this.getMyRecordList();
    },
    async queryComment() {
      if (!this.username && !this.bookName && this.isSend === 2) {
        this.userInfo.role === '管理员' ? this.getRecordList() : this.getMyRecordList();
        return;
      }
      if (this.username && this.bookName && this.isSend === 2) {
        this.recordList = this.recordList.filter(item => item.username.includes(this.username) && item.bookName.includes(this.bookName));
        this.total = this.recordList.length;
        return;
      }
      if (this.username && !this.bookName && this.isSend === 2) {
        this.recordList = this.recordList.filter(item => item.username.includes(this.username));
        this.total = this.recordList.length;
        return;
      }
      if (!this.username && this.bookName && this.isSend === 2) {
        this.recordList = this.recordList.filter(item => item.bookName.includes(this.bookName));
        this.total = this.recordList.length;
        return;
      }
      const req = {
        username: this.username,
        bookName: this.bookName,
        isSend: this.isSend,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await recordByOtherAPI(req);
      this.recordList = this.isSend === 1 ? res.data.list : res.data.list.filter(item => item.isSend === 0);
      this.total = this.recordList.length;
    },
    clearContent() {
      this.username = "";
      this.bookName = "";
      this.isSend = 2;
    },
  },
  created() {
    this.userInfo.role === '管理员' ? this.getRecordList() : this.getMyRecordList();
  },
};
</script>

<style lang="less" scoped>
.record-container {
  .query-box {
    display: flex;
    align-items: center;
    .username {
      display: flex;
      align-items: center;
      .desc {
        width: 90px;
      }
    }
    .bookName {
      margin-left: 25px;
      display: flex;
      align-items: center;
      .desc {
        width: 90px;
      }
    }
    .isSend {
      margin-left: 25px;
      display: flex;
      align-items: center;
      .desc {
        width: 85px;
      }
    }
    .distance {
      margin-left: 25px;
    }
  }
}
</style>
