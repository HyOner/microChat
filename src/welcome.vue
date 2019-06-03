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
                <el-input
                  ref="nickname"
                  class="input1"
                  placeholder="希望大家怎么称呼你"
                  v-model="username"
                  clearable
                ></el-input>
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

            <el-button type="primary" class="button" @click="joinOtherRoom">加 入</el-button>
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
              <el-tooltip content="取个达意的房名哟" placement="right" popper-class="tips">
                <el-input
                  ref="roomName"
                  class="input1"
                  placeholder="为你的房间起个名字"
                  v-model="roomName"
                  clearable
                ></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item class="item">
              <i
                class="iconfont icon-user"
                style="position:absolute;top:-1px;left:10px; z-index:10;font-size:20px;color:#ccc"
              ></i>
              <el-tooltip content="独特的昵称醒目哦" placement="right" popper-class="tips">
                <el-input
                  ref="nickname2"
                  class="input1"
                  placeholder="希望大家怎么称呼你"
                  v-model="username"
                  clearable
                ></el-input>
              </el-tooltip>
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
      member: 100,
      online: 23,
      username: '',
      roomName: '',
      password: '',
      userInfo: {
        username: '',
        password: ''
      },
      onlineRoom: [],
      onlineRoomPass: [],
    }
  },
  mounted() {
    this.isShow = !this.isShow;
    setTimeout(() => {
      this.$axios({
        method: 'ge',
        url: 'http://47.101.137.155:10000/api/onlineRoom'
      }).then(res => {
        this.onlineRoom = res.data.length ? res.data : [{
          roomName: '当前没有房间在线',
          password: '欢迎创建新房间'
        }];
        this.renderRoomNotify();
      })
    }, 1000);
    setTimeout(() => {
      this.$axios({
        method: 'get',
        url: 'http://47.101.137.155:10000/api/onlineRoomPass'
      }).then(res => {
        this.onlineRoomPass = res.data.length ? res.data : [];
      })
    }, 1200);

  },
  methods: {
    enterRoom() {
      let nickname = (this.$refs.nickname2.value && this.$refs.nickname2.value.trim()) || '';
      let roomName = (this.$refs.roomName.value && this.$refs.roomName.value.trim()) || '';
      if (nickname && roomName) {
        this.$socket.emit('create', { roomName, nickname });
        this.isShow = !this.isShow;
        this.$notify.close();
        setTimeout(() => {
          this.$router.push({
            path: 'chatroom',
          })
        }, 350);
      } else {
        this.$message.error('请把Room信息补充完整补充');
      }
    },
    createOwnRoom() {
      this.isLogin = !this.isLogin;
    },
    joinOtherRoom() {
      let password = this.password;
      let nickname = (this.$refs.nickname.value && this.$refs.nickname.value.trim()) || '';
      if (nickname && password) {
        if (this.onlineRoomPass.includes(password)) {
          this.$socket.emit('join', nickname);
          this.$notify.close();

          this.isShow = !this.isShow;
          setTimeout(() => {
            this.$router.push({
              path: 'chatroom',
            })
          }, 350);
        } else {
          this.$message.error('房间口令错误');
        }
      } else {
        this.$message.error('请把Room信息补充完整补充');
      }
    },
    renderRoomNotify() {
      const onlineRoom = this.onlineRoom;
      if (onlineRoom.length > 0) {
        onlineRoom.forEach(item => {
          setTimeout(() => {
            this.$notify({
              title: item.roomName,
              message: '口令: ' + item.password,
              duration: 30000
            })
          });
        }, 100);
      }
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
