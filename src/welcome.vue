<template>
  <div class="bg">
    <!-- <transition name="el-zoom-in-top"> -->
    <template v-if="isLogin">
      <el-card class="panel">
        <div class="info">
          <hello></hello>
          <!-- <div class="title">MicroChat</div> -->
          <div class="count">
            <div class="col" style="margin-right:20px;">
              <div class="dot dot1"></div>
              <span>{{ online + ' 在线' }}</span>
            </div>
            <div class="col">
              <div class="dot dot2"></div>
              <span>{{ member + ' 成员' }}</span>
            </div>
          </div>
        </div>

        <div class="login">
          <el-form :model="userInfo" ref="userForm">
            <el-form-item class="item">
              <i
                class="iconfont icon-user"
                style="position:absolute;top:-1px;left:10px; z-index:10;font-size:20px;color:#ccc"
              ></i>
              <el-tooltip content="之后也可以修改哦" placement="right" popper-class="tips">
                <el-input class="input1" placeholder="希望大家怎么称呼你" v-model="username" clearable></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item class="item">
              <i
                class="iconfont icon-lock"
                style="position:absolute;top:-1px;left:10px; z-index:10;font-size:20px;color:#ccc"
              ></i>
              <el-tooltip content="可不能告诉别人哈" placement="right" popper-class="tips">
                <el-input
                  class="input2"
                  placeholder="在这里输入你的暗号"
                  v-model="password"
                  clearable
                  type="password"
                ></el-input>
              </el-tooltip>
            </el-form-item>

            <el-button type="primary" class="button" @click="enterRoom">加 入</el-button>
          </el-form>
          <div class="createRoom" @click="createOwnRoom">
            <span>创建自己的房间?</span>
          </div>
        </div>
      </el-card>
    </template>
    <!-- </transition> -->
    <!-- 创建房间 -->
    <!-- <transition> -->
    <template v-else>
      <el-card class="panel">
        <div class="info">
          <div
            class="title"
            style="color:#5e98fc;font-size: 60px;font-family: fantasy !important;margin-bottom:40px"
          >MicroChat</div>
          <div class="title" style="margin-bottom: 68px;">Join Us !</div>
        </div>

        <div class="login">
          <el-form :model="userInfo" ref="userForm">
            <el-form-item class="item">
              <i
                class="iconfont icon-homepage"
                style="position:absolute;top:0px;left:10px; z-index:10;font-size:22px;color:#ccc"
              ></i>
              <el-input class="input1" placeholder="为你的房间起个名字" v-model="username" clearable></el-input>
            </el-form-item>

            <el-form-item class="item">
              <i
                class="iconfont icon-user"
                style="position:absolute;top:-1px;left:10px; z-index:10;font-size:20px;color:#ccc"
              ></i>
              <el-input class="input1" placeholder="希望大家怎么称呼你" v-model="username" clearable></el-input>
            </el-form-item>

            <!-- <el-form-item class="item">
              <i
                class="iconfont icon-lock"
                style="position:absolute;top:-1px;left:10px; z-index:10;font-size:20px;color:#ccc"
              ></i>
              <el-tooltip content="可不能告诉别人哈" placement="right" popper-class="tips">
                <el-input
                  class="input2"
                  placeholder="在这里输入你的房号"
                  v-model="password"
                  clearable
                  type="password"
                ></el-input>
              </el-tooltip>
            </el-form-item>-->
            <el-button type="primary" class="button" @click="enterRoom">创 建</el-button>
          </el-form>
          <div class="createRoom" @click="createOwnRoom">
            <span>加入已有的房间?</span>
          </div>
        </div>
      </el-card>
    </template>
    <!-- </transition> -->
  </div>
</template>

<script>
import Hello from "./hello";

export default {
  components: { Hello },
  data() {
    return {
      isLogin: false,
      member: 10000,
      online: 2300,
      username: '',
      password: '',
      userInfo: {
        username: '',
        password: ''
      },
    }
  },
  mounted() {
    this.isShow = !this.isShow;
  },
  methods: {
    enterRoom() {
      this.isShow = !this.isShow;
      setTimeout(() => {
        this.$router.push({ path: 'chatroom' })
      }, 350);
    },
    createOwnRoom() {
      this.isLogin = !this.isLogin;
    },
  }
}
</script>

<style>
.bg {
  padding-top: 120px;
  width: 100%;
  height: 100%;
  background: url(./assets/snow.jpg) no-repeat fixed;
  background-position: 0% 40%;
  background-size: cover;
  box-sizing: border-box;
  z-index: 1;
  /* display: flex;
  justify-content: center; */
}
.bg:after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: inherit;
  /* filter: blur(1px); */
  z-index: 2;
}

.panel {
  z-index: 99;
  position: relative;
  color: #eee;
  display: flex;
  align-items: center;
  align-content: center;
  /* justify-content: center; */
  width: 480px;
  height: 548px;
  background-color: #36393f;
  border-radius: 17px;
  border-color: #333;
}
.title {
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 400;
  color: #ccc;
}
.count {
  width: 100%;
  display: inline-flex;
  justify-content: center;
  margin-bottom: 40px;
}
.col {
  display: inline-block;
  width: 124px;
  height: 30px;
  border-radius: 50px;
  background-color: #303339;
  text-align: center;
  line-height: 30px;
  box-shadow: inset 0.5px 1px 1px #111;
}
.col .dot {
  width: 12px;
  height: 12px;
  margin-right: 5px;
  border-radius: 50%;
  display: inline-block;
}
.dot1 {
  background-color: #49b482;
}
.dot2 {
  background-color: #72767d;
}
.button {
  margin-top: 15px;
  width: 440px;
  background-color: #5e98fc;
  border-color: #5e98fc;
}
.el-form-item {
  margin-bottom: 20px !important;
}
.input1,
.input2 {
  width: 440px;
}
.createRoom {
  text-align: center;
  margin-top: 25px;
  font-size: 13px;
  color: #888;
}
.createRoom span {
  cursor: pointer;
}
.createRoom span:active {
  color: rgba(255, 245, 244, 0.1);
}
/* 改写element中的tooltip样式 */
.el-tooltip__popper[x-placement^="right"] .popper__arrow {
  border-right-color: hsla(218, 54%, 50%, 0.753);
}
.el-tooltip__popper[x-placement^="right"] .popper__arrow:after {
  border-right-color: #5e98fc;
}
.tips {
  background: #5c95f7f6 !important;
}
.el-input__inner {
  background: #303339;
  border-color: #111;
  color: white;
  border-radius: 20px;
  padding-left: 35px;
}
</style>
