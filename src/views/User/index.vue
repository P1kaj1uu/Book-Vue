<template>
  <div class="user-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <el-card class="box-card" v-if="isViewInfo">
      <div class="title">当前{{ this.userInfo.role }}信息</div>
      <div class="username">用户名：{{ this.userInfo.username }}</div>
      <div class="name">名称：{{ this.userInfo.name }}</div>
      <div class="phone">电话：{{ this.userInfo.phone }}</div>
      <div class="email">邮箱：{{ this.userInfo.email }}</div>
      <div class="address">地址：{{ this.userInfo.address }}</div>
      <div class="role">角色：{{ this.userInfo.role }}</div>
      <el-button class="edit" type="primary" @click="edit">修改个人信息</el-button>
    </el-card>
    <el-card class="box-card" v-else>
      <div class="title">编辑{{ this.userInfo.role }}信息</div>
      <div class="username">用户名：{{ this.userInfo.username }}</div>
      <div class="name wrap">
        <div>名称：</div>
        <el-input v-model="name" placeholder="请输入名称"></el-input>
      </div>
      <div class="phone wrap">
        <div>电话：</div>
        <el-input v-model="phone" placeholder="请输入电话"></el-input>
      </div>
      <div class="email wrap">
        <div>邮箱：</div>
        <el-input v-model="email" placeholder="请输入邮箱"></el-input>
      </div>
      <div class="address wrap">
        <div>地址：</div>
        <el-input v-model="address" placeholder="请输入地址"></el-input>
      </div>
      <div class="role">角色：{{ this.userInfo.role }}</div>
      <div class="edit">
        <el-button type="primary" @click="changeInfo">确认修改</el-button>
        <el-button @click="() => this.isViewInfo = true">取消修改</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb.vue";
import { editUserInfoAPI } from "@/api/index";
import { mapState, mapMutations } from "vuex";

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
      currentBreadName: "个人",
      isViewInfo: true,
      name: "",
      phone: "",
      email: "",
      address: ""
    };
  },
  methods: {
    ...mapMutations('User', ['setUserInfo']),
    edit() {
      this.isViewInfo = false;
      this.name = this.userInfo.name;
      this.phone = this.userInfo.phone;
      this.email = this.userInfo.email;
      this.address = this.userInfo.address;
    },
    async changeInfo() {
      const phoneRegx = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      const emailRegx = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (this.phone && !phoneRegx.test(this.phone)) {
        this.$message.warning('手机号格式不正确');
        return;
      }
      if (this.email && !emailRegx.test(this.email)) {
        this.$message.warning('邮箱格式不正确');
        return;
      }
      let flag = (this.userInfo.name !== this.name) || (this.userInfo.phone !== this.phone) || (this.userInfo.email !== this.email) || (this.userInfo.address !== this.address);
      if (flag) {
        const req = {
          id: this.userInfo.id,
          name: this.name,
          phone: this.phone,
          email: this.email,
          address: this.address
        }
        const info = {
          id: this.userInfo.id,
          username: this.userInfo.username,
          password: this.userInfo.password,
          name: this.name || this.userInfo.name,
          phone: this.phone || this.userInfo.phone,
          email: this.email || this.userInfo.email,
          address: this.address || this.userInfo.address,
          role: this.userInfo.role,
          token: this.userInfo.token
        }
        const res = await editUserInfoAPI(req);
        if (res.code === 200) {
          this.setUserInfo(info);
          this.$message.success('编辑用户信息成功');
        } else {
          this.$message.error('编辑用户信息失败，请稍后重试');
        }
      }
      this.isViewInfo = true;
    }
  },
};
</script>

<style lang="less" scoped>
.user-container {
  .box-card {
    padding: 30px 100px;
    .title {
      margin-bottom: 20px;
      font-weight: 600;
      font-size: 22px;
      text-align: center;
    }
    .username {
      margin-bottom: 20px;
    }
    .name {
      margin-bottom: 20px;
    }
    .phone {
      margin-bottom: 20px;
    }
    .email {
      margin-bottom: 20px;
    }
    .address {
      margin-bottom: 20px;
    }
    .role {
      margin-bottom: 20px;
    }
    .edit {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: auto;
    }
    .wrap {
      display: flex;
      align-items: center;
      .el-input {
        flex: 1;
      }
    }
  }
}
</style>
