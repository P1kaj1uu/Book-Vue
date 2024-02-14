<template>
  <el-container class="home-container">
    <el-header>
      <h2 class="welcome">
        {{
          this.userInfo.role === "用户"
            ? `欢迎用户${
                this.userInfo.name || this.userInfo.username
              }，访问图书借阅平台~`
            : `欢迎管理员${
                this.userInfo.name || this.userInfo.username
              }访问图书管理平台~`
        }}
      </h2>
      <div class="time">{{ currentTime }}</div>
      <div class="my">
        <div class="avatar" @click="toggleShowMyList">
          {{
            this.userInfo.name
              ? this.userInfo.name.substring(0, 1)
              : this.userInfo.username.substring(0, 1)
          }}
        </div>
        <div class="name" @click="toggleShowMyList">
          {{ this.userInfo.name || this.userInfo.username }}
        </div>
        <div class="my-list" v-if="isShowMyList">
          <div
            class="my-item"
            v-for="item in myList"
            :key="item.id"
            @click="chooseMyItem(item.name)"
          >
            {{ $i18n.locale === "zh" ? item.name : item.other }}
          </div>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="250px">
        <el-menu
          @select="selectMenu"
          :default-active="currentMenu"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          router
        >
          <el-menu-item :index="'/layout/dashboard'">
            <i class="el-icon-s-home"></i>
            <span slot="title">{{ $t("home") }}</span>
          </el-menu-item>
          <el-menu-item :index="'/layout/book'">
            <i class="el-icon-reading"></i>
            <span slot="title" v-if="this.userInfo.role === '用户'"
              >图书大厅</span
            >
            <span slot="title" v-else>图书管理</span>
          </el-menu-item>
          <el-menu-item :index="'/layout/record'">
            <i class="el-icon-document"></i>
            <span slot="title" v-if="this.userInfo.role === '用户'"
              >借阅归还</span
            >
            <span slot="title" v-else>借阅管理</span>
          </el-menu-item>
          <el-menu-item
            :index="'/layout/user'"
            v-if="this.userInfo.role === '管理员'"
          >
            <i class="el-icon-s-custom"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item
            :index="'/layout/comment'"
            v-if="this.userInfo.role === '管理员'"
          >
            <i class="el-icon-message"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
          <el-menu-item :index="'/layout/message'">
            <i class="el-icon-s-promotion"></i>
            <span slot="title" v-if="this.userInfo.role === '用户'"
              >公告公示</span
            >
            <span slot="title" v-else>公告管理</span>
          </el-menu-item>
          <el-menu-item :index="'/layout/me'">
            <i class="el-icon-user"></i>
            <span slot="title">个人中心</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>

    <el-dialog title="修改密码" :visible.sync="passwordDialog" :show-close="false">
      <el-form :model="form" :rules="rules" ref="passwordRef">
        <el-form-item
          label="旧密码"
          :label-width="formLabelWidth"
          prop="oldPassword"
        >
          <el-input
            v-model="form.oldPassword"
            type="password"
            placeholder="请输入旧密码"
            autocomplete="off"
            clearable
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          :label-width="formLabelWidth"
          prop="newPassword"
        >
          <el-input
            v-model="form.newPassword"
            type="password"
            placeholder="请输入新密码"
            autocomplete="off"
            clearable
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          :label-width="formLabelWidth"
          prop="againPassword"
        >
          <el-input
            v-model="form.againPassword"
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
  </el-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { removeToken } from "@/utils/token";
import { userPasswordAPI } from "@/api/user";

export default {
  name: "Dashboard",
  data() {
    return {
      currentTime: "",
      timer: null,
      isShowMyList: false,
      myList: [
        {
          id: 1,
          name: "切换语言",
          other: "Language",
        },
        {
          id: 2,
          name: "修改密码",
          other: "Password",
        },
        {
          id: 3,
          name: "退出登录",
          other: "LogOut",
        },
      ],
      formLabelWidth: "80px",
      passwordDialog: false,
      form: {
        oldPassword: "",
        newPassword: "",
        againPassword: "",
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: "请输入旧密码",
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
  computed: {
    ...mapState("User", ["userInfo"]),
    ...mapState("Slide", ["currentMenu"]),
  },
  methods: {
    ...mapMutations("User", ["setUserInfo"]),
    ...mapMutations("Slide", ["setCurrentMenu"]),
    selectMenu(index) {
      this.setCurrentMenu(index);
    },
    chooseMyItem(name) {
      switch (name) {
        case "切换语言":
          this.$confirm(`此操作将会中英文显示切换, 是否继续?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$i18n.locale = this.$i18n.locale === "zh" ? "en" : "zh";
              this.$message.success("切换语言成功");
            })
            .catch(() => {});
          break;
        case "修改密码":
          this.passwordDialog = true;
          this.isShowMyList = false;
          break;
        case "退出登录":
          removeToken();
          this.setUserInfo(null);
          this.$router.push("/login");
          break;
        default:
          break;
      }
    },
    toggleShowMyList() {
      this.isShowMyList = !this.isShowMyList;
    },
    cancelPassword() {
      this.$refs.passwordRef.resetFields();
      this.passwordDialog = false;
    },
    async confirmPassword() {
      this.$refs.passwordRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning('请先输入必填项内容');
          return;
        }
        if (this.form.oldPassword !== this.userInfo.password) {
          this.$message.warning('旧密码不正确');
          return;
        }
        if (this.form.oldPassword === this.form.newPassword) {
          this.$message.warning('新旧密码不能相同');
          return;
        }
        if (this.form.newPassword !== this.form.againPassword) {
          this.$message.warning('请检查两次输入的密码是否一致');
          return;
        }
        const req = {
          id: this.userInfo.id,
          password: this.form.againPassword
        };
        const res = await userPasswordAPI(req);
        if (res.code === 200) {
          this.$message.success("修改密码成功");
          this.cancelPassword();
          removeToken();
          this.setUserInfo(null);
          this.$router.push("/login");
        } else {
          this.$message.error("修改密码失败，请稍后重试");
        }
      })
    },
  },
  created() {
    let that = this;
    /* this.timer = setInterval(() => {
      that.currentTime = new Date().toLocaleString();
    }, 1000); */
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;

  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #333744;
    height: 80px !important;

    .welcome {
      color: #fff;
    }

    .time {
      color: #fff;
    }

    .my {
      position: relative;
      display: flex;
      align-items: center;

      .avatar {
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        background-color: blue;
        color: #fff;
        border-radius: 50%;
      }

      .name {
        color: #fff;
      }

      .my-list {
        position: absolute;
        top: 60px;
        display: flex;
        flex-direction: column;
        width: 102px;
        background-color: #333744;

        .my-item {
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 14px;
          color: #fff;
        }

        .my-item:hover {
          background-color: #fff;
          color: #333;
        }
      }
    }
  }

  .el-aside {
    height: 100%;

    .el-menu {
      height: 100%;
    }
  }
}
</style>
