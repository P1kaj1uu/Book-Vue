<template>
  <div class="user-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <div class="query-box">
      <div class="username">
        <div class="desc">用户名：</div>
        <el-input v-model="username" placeholder="请输入用户名"></el-input>
      </div>
      <div class="name">
        <div class="desc">名称：</div>
        <el-input v-model="name" placeholder="请输入名称"></el-input>
      </div>
      <div class="role">
        <div class="desc">角色：</div>
        <el-select v-model="role" placeholder="请选择角色">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" class="distance" @click="queryUser"
        >查询</el-button
      >
      <el-button @click="clearContent">重置</el-button>
      <el-button type="primary" class="distance" @click="addUser" v-if="this.userInfo.role === '管理员'"
        >新增用户/管理员</el-button
      >
    </div>

    <el-table
      :data="userList"
      border
      height="450"
      style="width: 100%; margin: 20px auto"
    >
      <el-table-column label="用户名">
        <template slot-scope="scope">
          <p>{{ scope.row.username }}</p>
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <p>{{ scope.row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="130">
        <template slot-scope="scope">
          <p>{{ scope.row.phone }}</p>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="170">
        <template slot-scope="scope">
          <p>{{ scope.row.email }}</p>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          <p>{{ scope.row.address }}</p>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="80">
        <template slot-scope="scope">
          <p>{{ scope.row.role }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="this.userInfo.role === '管理员'">
        <template slot-scope="scope">
          <el-button size="mini" @click="handlePassword(scope.row)"
            >修改密码</el-button
          >
          <el-button
            size="mini"
            type="danger"
            v-if="userInfo.username !== scope.row.username"
            @click="handleDelete(scope.row)"
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

    <el-dialog title="修改密码" :visible.sync="passwordDialog" :show-close="false">
      <el-form :model="passwordForm" :rules="passwordFormRules" ref="passwordFormRef">
        <el-form-item
          label="新密码"
          label-width="80"
          prop="newPassword"
        >
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            autocomplete="off"
            clearable
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          label-width="80"
          prop="againPassword"
        >
          <el-input
            v-model="passwordForm.againPassword"
            type="password"
            placeholder="请输入确认密码"
            autocomplete="off"
            clearable
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelPassword">取 消</el-button>
        <el-button type="primary" @click="confirmPassword"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="新增用户/管理员" :visible.sync="userDialog" :show-close="false">
      <el-form :model="userForm" :rules="userFormRules" ref="userFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="新密码"
          label-width="80"
          prop="newPassword"
        >
          <el-input
            v-model="userForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            autocomplete="off"
            clearable
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          label-width="80"
          prop="againPassword"
        >
          <el-input
            v-model="userForm.againPassword"
            type="password"
            placeholder="请输入确认密码"
            autocomplete="off"
            clearable
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="confirmAdd"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb.vue";
import {
  userListAPI,
  userByConditionAPI,
  deleteUserAPI,
  userPasswordAPI,
  userRegisterAPI,
} from "@/api/user";
import { mapState, mapMutations } from "vuex";
import { removeToken } from "@/utils/token";

export default {
  name: "User",
  components: {
    BreadCrumb,
  },
  computed: {
    ...mapState("User", ["userInfo"]),
  },
  data() {
    return {
      currentBreadName: "用户",
      userList: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      username: "",
      name: "",
      role: "",
      options: [
        {
          value: "用户",
          label: "用户",
        },
        {
          value: "管理员",
          label: "管理员",
        },
      ],
      userId: 0,
      passwordDialog: false,
      passwordForm: {
        newPassword: "",
        againPassword: "",
      },
      passwordFormRules: {
        newPassword: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur",
          },
        ],
        againPassword: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: "blur",
          },
        ],
      },
      userDialog: false,
      userForm: {
        username: "",
        role: "",
        newPassword: "",
        againPassword: "",
      },
      userFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        role: [
          {
            required: true,
            message: "请选择角色",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur",
          },
        ],
        againPassword: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    ...mapMutations("User", ["setUserInfo"]),
    async getUserList() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await userListAPI(req);
      this.userList = res.data.list;
      this.total = res.data.total;
    },
    addUser() {
      this.userDialog = true;
    },
    cancelAdd() {
      this.$refs.userFormRef.resetFields();
      this.userDialog = false;
    },
    confirmAdd() {
      this.$refs.userFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning('请先输入必填项内容');
          return;
        }
        if (this.userForm.newPassword !== this.userForm.againPassword) {
          this.$message.warning('请检查两次输入的密码是否一致');
          return;
        }
        const req = {
          id: Math.round(Math.random() * 9999) + 1,
          username: this.userForm.username,
          password: this.userForm.password,
          name: null,
          phone: null,
          email: null,
          address: null,
          role: this.userForm.role,
        };
        const res = await userRegisterAPI(req);
        if (res.code === 200) {
          this.$message.success(`新增${this.userForm.role}成功`);
          this.cancelAdd();
          this.getUserList();
        } else {
          this.$message.error(`新增${this.userForm.role}失败，请稍后重试`);
        }
      })
    },
    handlePassword(row) {
      this.userId = row.id;
      this.passwordDialog = true;
    },
    cancelPassword() {
      this.$refs.passwordFormRef.resetFields();
      this.passwordDialog = false;
    },
    async confirmPassword() {
      this.$refs.passwordFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning('请先输入必填项内容');
          return;
        }
        if (this.passwordForm.newPassword !== this.passwordForm.againPassword) {
          this.$message.warning('请检查两次输入的密码是否一致');
          return;
        }
        const req = {
          id: this.userId,
          password: this.passwordForm.againPassword,
        };
        const res = await userPasswordAPI(req);
        if (res.code === 200) {
          this.$message.success("修改密码成功");
          this.cancelPassword();
          if (this.userId === this.userInfo.id) {
            removeToken();
            this.setUserInfo(null);
            this.$router.push("/login");
          }
        } else {
          this.$message.error("修改密码失败，请稍后重试");
        }
      })
    },
    handleDelete(row) {
      this.$confirm(`此操作将永久删除该${row.role}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            userId: row.id,
          };
          const res = await deleteUserAPI(req);
          if (res.code === 200) {
            this.$message.success(`删除${row.role}成功`);
            this.getUserList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getUserList();
    },
    async queryUser() {
      if (!this.username && !this.name && !this.role) {
        this.getUserList();
        return;
      }
      const req = {
        username: this.username,
        name: this.name,
        role: this.role,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await userByConditionAPI(req);
      this.userList = res.data.list;
      this.total = res.data.total;
    },
    clearContent() {
      this.username = "";
      this.name = "";
      this.role = "";
    },
  },
  created() {
    this.getUserList();
  },
};
</script>

<style lang="less" scoped>
.user-container {
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
    .name {
      margin-left: 25px;
      display: flex;
      align-items: center;
      .desc {
        width: 70px;
      }
    }
    .role {
      margin-left: 25px;
      display: flex;
      align-items: center;
      .desc {
        width: 60px;
      }
    }
    .distance {
      margin-left: 25px;
    }
  }
}
</style>
