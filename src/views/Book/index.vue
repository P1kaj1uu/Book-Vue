<template>
  <div class="book-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <div class="query-box">
      <div class="name">
        <div class="desc">图书名：</div>
        <el-input v-model="name" placeholder="请输入图书名"></el-input>
      </div>
      <div class="author">
        <div class="desc">图书作者：</div>
        <el-input v-model="author" placeholder="请输入图书作者"></el-input>
      </div>
      <div class="type">
        <div class="desc">图书类别：</div>
        <el-select v-model="type" placeholder="请选择图书类别">
          <el-option
            v-for="item in typeList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" class="distance" @click="queryBook"
        >查询</el-button
      >
      <el-button @click="clearContent">重置</el-button>
      <el-button type="primary" @click="addBook">新增图书</el-button>
    </div>

    <el-table
      :data="bookList"
      border
      height="450"
      style="width: 100%; margin: 20px auto"
    >
      <el-table-column label="出版日期">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.publishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图书封面" width="90">
        <template slot-scope="scope">
          <p>{{ scope.row.coverUrl }}</p>
        </template>
      </el-table-column>
      <el-table-column label="图书名">
        <template slot-scope="scope">
          <p>{{ scope.row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="图书作者">
        <template slot-scope="scope">
          <p>{{ scope.row.author }}</p>
        </template>
      </el-table-column>
      <el-table-column label="图书简介">
        <template slot-scope="scope">
          <p>{{ scope.row.description }}</p>
        </template>
      </el-table-column>
      <el-table-column label="图书类别" width="90">
        <template slot-scope="scope">
          <p>{{ scope.row.type }}</p>
        </template>
      </el-table-column>
      <el-table-column label="图书剩余数量" width="120">
        <template slot-scope="scope">
          <p>{{ scope.row.num }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleDelete(scope.row)"
            >借阅</el-button
          >
          <el-button size="mini" type="primary" @click="handleDelete(scope.row)"
            >编辑</el-button
          >
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
  bookListAPI,
  bookByNameAPI,
  addBookAPI,
  editBookAPI,
  editBookNumAPI,
  bookImgAPI,
  deleteBookAPI,
} from "@/api/book";
import {
  typeListAPI,
} from "@/api/type";
import { mapState } from "vuex";

export default {
  name: "Book",
  components: {
    BreadCrumb,
  },
  computed: {
    ...mapState("User", ["userInfo"]),
  },
  data() {
    return {
      currentBreadName: "图书",
      bookList: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      name: "",
      author: "",
      type: "",
      typeList: [],
    };
  },
  methods: {
    async getTypeList() {
      const req = {
        pageNum: this.pageNum,
        pageSize: 100,
      };
      const res = await typeListAPI(req);
      this.typeList = res.data.list;
    },
    async getBookList() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await bookListAPI(req);
      this.bookList = res.data.list;
      this.total = res.data.total;
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该图书, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            bookId: row.id,
          };
          const res = await deleteBookAPI(req);
          if (res.code === 200) {
            this.$message.success("删除图书成功");
            this.getBookList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getBookList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getBookList();
    },
    async queryBook() {
      if (!this.name && !this.author && !this.type) {
        this.getBookList();
        return;
      }
      const req = {
        name: this.name,
        author: this.author,
        type: this.type,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await bookByNameAPI(req);
      this.bookList = res.data.list;
      this.total = res.data.total;
    },
    clearContent() {
      this.name = "";
      this.author = "";
      this.type = "";
    },
  },
  created() {
    this.getTypeList();
    this.getBookList();
  },
};
</script>

<style lang="less" scoped>
.book-container {
  .query-box {
    display: flex;
    align-items: center;
    .name {
      display: flex;
      align-items: center;
      .desc {
        width: 90px;
      }
    }
    .author {
      margin-left: 25px;
      display: flex;
      align-items: center;
      .desc {
        width: 110px;
      }
    }
    .type {
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
