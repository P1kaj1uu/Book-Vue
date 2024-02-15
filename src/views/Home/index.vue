<template>
  <div class="home-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <div class="explore-box">
      <div class="explore-item">
        <div class="title">用户数量</div>
        <div class="number">{{ userNumber }}</div>
        <span class="desc">实时</span>
      </div>
      <div class="explore-item">
        <div class="title">图书数量</div>
        <div class="number">{{ bookNumber }}</div>
        <span class="desc">实时</span>
      </div>
      <div class="explore-item">
        <div class="title">类别数量</div>
        <div class="number">{{ typeNumber }}</div>
        <span class="desc">实时</span>
      </div>
      <div class="explore-item">
        <div class="title">未归还数量</div>
        <div class="number">{{ leadNumber }}</div>
        <span class="desc">实时</span>
      </div>
    </div>

    <div id="myChart" :style="{ margin: '0 auto', width: '800px', height: '500px' }"></div>

    <div class="time-box">
      <el-calendar v-model="timeValue"></el-calendar>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb.vue";
import { mapState } from "vuex";
import {
  userByConditionAPI,
} from "@/api/user";
import {
  bookListAPI,
} from "@/api/book";
import {
  typeListAPI,
} from "@/api/type";
import {
  recordListAPI,
  recordByUserAPI,
} from "@/api/record";

export default {
  name: "Home",
  components: {
    BreadCrumb,
  },
  computed: {
    ...mapState("User", ["userInfo"]),
  },
  data() {
    return {
      currentBreadName: "欢迎",
      userNumber: 0,
      bookNumber: 0,
      typeNumber: 0,
      leadNumber: 0,
      pageNum: 1,
      pageSize: 500,
      timeValue: new Date(),
    };
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.querySelector(".home-container #myChart"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "热门借阅图书类别前三统计饼图",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          top: "10%",
          left: "center",
        },
        color: ['#6eb158', '#cdcdcd', '#3f8cff'],
        series: [
          {
            name: "图书类别",
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "文学" },
              { value: 735, name: "言情" },
              { value: 580, name: "计算机" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}:}{c}  {per|{d}%}  ",
              backgroundColor: "",
              borderColor: "",
              borderWidth: 1,
              borderRadius: 4,
              rich: {},
            },
          },
        ],
      });
    },
    async queryUser() {
      const req = {
        username: "",
        name: "",
        role: "用户",
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await userByConditionAPI(req);
      this.userNumber = res.data.total;
    },
    async queryBook() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await bookListAPI(req);
      this.bookNumber = res.data.total;
    },
    async queryType() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await typeListAPI(req);
      this.typeNumber = res.data.total;
    },
    async queryLead() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await recordListAPI(req);
      this.leadNumber = res.data.list.map(item => item.isSend === 0).filter(item => item).length;
    },
    async queryMyLead() {
      const req = {
        userId: this.userInfo.id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await recordByUserAPI(req);
      this.leadNumber = res.data.list.map(item => item.isSend === 0).filter(item => item).length;
    },
  },
  created() {
    this.queryUser();
    this.queryBook();
    this.queryType();
    this.userInfo.role === '管理员' ? this.queryLead() : this.queryMyLead();
  },
  mounted() {
    this.drawLine();
  },
}
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  display: none;
}
.home-container {
  height: 75%;
  overflow: auto;
  .explore-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    .explore-item {
      position: relative;
      padding: 25px;
      box-sizing: border-box;
      width: 200px;
      height: 100px;
      background-color: #ccc;
      .title {
        font-size: 20px;
        font-weight: 600;
      }
      .number {
        font-size: 18px;
        text-align: right;
      }
      .desc {
        position: absolute;
        top: 0;
        left: 170px;
        border: 1px solid black;
        font-size: 14px;
      }
    }
  }
  .time-box {
    height: 100px;
  }
}
</style>