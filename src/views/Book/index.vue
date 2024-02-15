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
      <el-button v-if="this.userInfo.role === '管理员'" type="primary" @click="addBook">新增图书</el-button>
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
          <div v-if="!scope.row.coverUrl">{{ 暂无封面 }}</div>
          <el-image
            v-else
            style="width: 60px;"
            :src="require('../../assets/image' + scope.row.coverUrl)" 
            :preview-src-list="[require('../../assets/image' + scope.row.coverUrl)]">
          </el-image>
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
          <el-button v-if="userInfo.role === '用户'" size="mini" type="primary" @click="handleView(scope.row)"
            >查看</el-button
          >
          <el-button v-if="userInfo.role === '用户'" size="mini" type="primary" @click="handleLead(scope.row)"
            >借阅</el-button
          >
          <el-button v-if="userInfo.role === '管理员'" size="mini" type="primary" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button v-if="userInfo.role === '管理员'" size="mini" type="danger" @click="handleDelete(scope.row)"
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogBookVisible" :show-close="false">
      <el-form :model="bookForm" ref="bookFormRef" :rules="bookRules">
        <el-form-item label="图书封面" label-width="120" prop="coverUrl" v-if="dialogTitle === '新增图书'">
          <input v-if="dialogBookVisible" type="file" ref="uploadRef" accept=".jpg, .jpeg .png" @change="upFile($event)" />
          <span style="font-size: 12px;">只能上传jpg/jpeg/png图片</span>
        </el-form-item>
        <el-form-item label="图书名" label-width="120" prop="name">
          <el-input
            v-model="bookForm.name"
            placeholder="请输入图书名"
          ></el-input>
        </el-form-item>
        <el-form-item label="图书作者" label-width="120" prop="author">
          <el-input
            v-model="bookForm.author"
            placeholder="请输入图书作者"
          ></el-input>
        </el-form-item>
        <el-form-item label="图书简介" label-width="120" prop="desc">
          <el-input
            v-model="bookForm.desc"
            placeholder="请输入图书简介"
          ></el-input>
        </el-form-item>
        <el-form-item label="出版时间" label-width="120" prop="publishTime">
          <el-date-picker
            v-model="bookForm.publishTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择出版时间"
            align="right"
          >
        </el-date-picker>
        </el-form-item>
        <el-form-item label="图书类别" label-width="120" prop="type">
          <el-select v-model="bookForm.type" placeholder="请选择图书类别">
            <el-option
              v-for="item in typeList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图书数量" label-width="120" prop="num">
          <el-input
            v-model="bookForm.num"
            type="number"
            placeholder="请输入图书数量"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeBookDialog">取 消</el-button>
        <el-button type="primary" @click="changeBook"
          >确 定</el-button
        >
      </div>
    </el-dialog>
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
import {
  addRecordAPI,
  recordByUserAPI,
} from "@/api/record";
import { mapState } from "vuex";
import filters from "@/utils/time";
import axios from "axios";

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
      recordList: [],
      fileObj: null,
      dialogTitle: "",
      dialogBookVisible: false,
      bookForm: {
        coverUrl: "",
        name: "",
        author: "",
        desc: "",
        publishTime: "",
        type: "",
        num: "",
      },
      bookRules: {
        coverUrl: [
          {
            required: true,
            message: '请添加图书封面',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入图书名',
            trigger: 'blur'
          }
        ],
        author: [
          {
            required: true,
            message: '请输入图书作者',
            trigger: 'blur'
          }
        ],
        desc: [
          {
            required: true,
            message: '请输入图书简介',
            trigger: 'blur'
          }
        ],
        publishTime: [
          {
            required: true,
            message: '请选择出版时间',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请输入图书类别',
            trigger: 'blur'
          }
        ],
        num: [
          {
            required: true,
            message: '请输入图书数量',
            trigger: 'blur'
          }
        ],
      },
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
    closeBookDialog() {
      this.fileObj = null;
      this.$refs.bookFormRef.resetFields();
      this.dialogBookVisible = false;
    },
    upFile(e) {
      const file = e.target.files[0] || e.dataTransfer.files[0];
      this.fileObj = file;
      this.bookForm.coverUrl = file.name;
    },
    changeBook() {
      this.$refs.bookFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning('请先输入必填项内容')
          return
        }
        let formData = new FormData();
        formData.append("picture", this.fileObj);
        formData.append("coverUrl", this.bookForm.coverUrl);
        const req = {
          id: Math.round(Math.random() * 9999) + 1,
          name: this.bookForm.name,
          description: this.bookForm.desc,
          author: this.bookForm.author,
          publishTime: filters.toTime(this.bookForm.publishTime),
          coverUrl: null,
          type: this.bookForm.type,
          typeId: this.typeList.filter(item => item.name === this.bookForm.type)[0].id,
          num: Number(this.bookForm.num),
        };
        const res = await addBookAPI(req);
        if (res.code === 200) {
          /* axios({
            url: `/api/book/uploadImg?bookId=${res.data.id}`,
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-Token': this.userInfo.token,
            },
            data: formData,
          }).then((result) => {
            console.log('result', result)
          }) */
          await bookImgAPI(res.data.id, formData);
          this.$message.success("新增图书成功");
        } else {
          this.$message.error(res.msg);
        }
        console.log('req',req)
      })
    },
    addBook() {
      this.dialogTitle = "新增图书";
      this.dialogBookVisible = true;
    },
    handleView(row) {},
    async changeNum(row) {
      const req = {
        id: row.id,
        num: row.num - 1,
      };
      await editBookNumAPI(req);
    },
    async getMyRecordList() {
      const req = {
        userId: this.userInfo.id,
        pageNum: this.pageNum,
        pageSize: 100,
      };
      const res = await recordByUserAPI(req);
      this.recordList = res.data.list;
    },
    async handleLead(row) {
      await this.getMyRecordList();
      if (row.num <= 0) {
        this.$message.warning("图书剩余数量不足，暂无法借阅");
        return;
      }
      let nameList = this.recordList.map(item => item.bookName);
      let authorList = this.recordList.map(item => item.bookAuthor);
      let sendList = this.recordList.map(item => item.isSend);
      let authorIndex = authorList.indexOf(row.author);
      let nameIndex = nameList.indexOf(row.name);
      if (authorIndex !== -1 && nameIndex !== -1 && authorIndex === nameIndex && sendList[authorIndex] === 0) {
        this.$message.warning("您已经借阅了该图书，暂无法继续借阅");
        return;
      }
      const req = {
        id: Math.round(Math.random() * 9999) + 1,
        username: this.userInfo.name || this.userInfo.username,
        bookName: row.name,
        isSend: 0,
        bookAuthor: row.author,
        userId: this.userInfo.id,
        leadTime: filters.toTime(new Date()),
        sendTime: null,
      };
      const res = await addRecordAPI(req);
      if (res.code === 200) {
        this.changeNum(row);
        this.$message.success("图书借阅成功");
        this.getBookList();
      } else {
        this.$message.error(res.msg);
      }
    },
    handleEdit(row) {
      this.bookForm.coverUrl = row.coverUrl;
      this.bookForm.name = row.name;
      this.bookForm.author = row.author;
      this.bookForm.desc = row.description;
      this.bookForm.publishTime = row.publishTime;
      this.bookForm.type = row.type;
      this.bookForm.num = row.num;
      this.dialogTitle = "编辑图书";
      this.dialogBookVisible = true;
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
