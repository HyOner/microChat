<template>
  <div class="bg">
    <transition name="el-zoom-in-top">
      <el-container class="chatRoom" v-show="isShow">
        <el-container class="chatZone">
          <!-- 聊天室顶部 -->
          <el-header class="header">
            <span class="roomName">{{ roomName }}</span>
            <span class="people">({{ roomCount }})</span>
            <i
              class="el-icon-more-outline"
              @click="switchAsidePanel"
              style="line-height: 46px;float: right;font-size: 18px;cursor: pointer"
            ></i>
            <!-- <i
              v-else
              class="el-icon-more"
              @click="switchAsidePanel"
              style="line-height: 46px;float: right;font-size: 18px;cursor: pointer"
            ></i>-->
          </el-header>
          <!-- 聊天室消息显示区 -->
          <el-main class="body">
            <ul class="list">
              <li v-for="item in messageList">
                <div class="list-item">
                  <avatar class="avatar" :username="item.user" backgroundColor="#5286e0" inline/>
                  <div class="infoAndMessage">
                    <div class="info">
                      <span
                        class="name"
                        :style="{color:item.color}"
                        @click="privateChat"
                      >{{ item.user }}</span>
                      <span class="time">{{ item.createAt }}</span>
                    </div>
                    <div class="chat">{{ item.content }}</div>
                  </div>
                </div>
              </li>
              <!-- <div v-if="isTyping" class="typing" style="color:white">{{someone}}正在输入</div> -->
            </ul>
          </el-main>
          <!-- 聊天室消息输入区 -->
          <el-footer class="footer">
            <div class="option">
              <i class="iconfont icon-biaoqing_xiao"></i>
              <i class="iconfont icon-tupian"></i>
              <i class="iconfont icon-wenjianjia"></i>
            </div>
            <div class="edit">
              <textarea ref="message" id="input" placeholder="写点什么..." @keyup.enter="sendMessage"></textarea>
            </div>
            <div class="send">
              <button class="btn" id="send" @click="sendMessage">Send</button>
              <span class="tip">shift+enter 换行</span>
            </div>
          </el-footer>
        </el-container>
        <!-- 聊天室右边成员区 -->
        <transition name="slide">
          <el-aside v-show="isShowRoomPeople" class="chatPeople">
            <i class="el-icon-circle-close" @click="switchAsidePanel"></i>
          </el-aside>
        </transition>
      </el-container>
    </transition>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';

export default {
  name: 'app',
  components: {
    Avatar
  },
  data() {
    return {
      isShow: false,
      isShowRoomPeople: false,
      roomName: 'hello microChat',
      roomCount: 102,
      user: 'microChat',
      ownName: '',
      isTyping: false,
      messageList: []
    }
  },
  mounted() {
    setTimeout(() => {
      this.isShow = !this.isShow;
    }, 250);
    // socket.on('message', msg => {
    //   console.log(msg);
    //   this.messageList.push(msg);
    // this.user = msg.user;
    // });
    // socket.on('typing', msg => {
    //   this.isTyping = msg.someoneTyping;
    //   this.someone = msg.user;
    // })
  },
  sockets: {
    connect() {
      //与socket.io连接后回调
      console.log("socket connected");
    },
    //服务端向客户端发送message事件
    message(msg) {
      this.messageList.push(msg);
      this.user = msg.user;
    },
    getOwnName(msg) {
      this.ownName = msg
    }
  },
  methods: {
    sendMessage() {
      if (!this.$refs.message.value.trim()) {
        return
      }
      let message = this.$refs.message.value.trim();

      // 向服务器发送消息
      this.$socket.emit('message', message);
      // socket.emit('typing', { user: this.user, someoneTyping: false });

      // 清空输入框内容
      this.$refs.message.value = '';

      // 将消息列表滚动到最下层
      // let ele = document.querySelector(".list");
      // console.log(ele.scrollHeight);
      // ele.scrollTop = ele.scrollHeight + 82.5;
    },
    privateChat(e) {
      let user = e.target.innerHTML;
      this.$refs.message.value += `@${user} `;
    },
    showTyping() {
      console.log('typing');
      this.$socket.emit('typing', { user: this.user, someoneTyping: true });
    },
    switchAsidePanel() {
      this.isShowRoomPeople = !this.isShowRoomPeople;
    },
    getCreateTime(time) {
      return `${time.getHours() >= 10 ? time.getHours() : '0' + time.getHours()}:${time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes()}:${time.getSeconds() >= 10 ? time.getSeconds() : '0' + time.getSeconds()}`
    },

  }
}
</script>

<style scoped>
.bg {
  width: 100%;
  height: 100%;
  background: url(./assets/spring.jpg) no-repeat fixed;
  background-position: center center;
  background-size: cover;
  box-sizing: border-box;
  z-index: 1;
}
.bg:after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: inherit;
  z-index: 2;
}

.chatRoom {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 55%;
  min-width: 800px;
  height: calc(86% - 46px);
  background-color: #ededed;
  text-align: center;
  z-index: 11;
}

/* .funcZone {
  background-color: #fbfbfb;
  width: 30%;
  height: 100%;
  float: left;
}

.funcZone header {
  height: 46px;
  line-height: 46px;
  color: #333;
  font-weight: 600;
} */

/* .content {
  overflow: hidden;
  height: calc(100% - 23px);
  background-color: green;
} */

.chatZone {
  /* margin-right: 30%; */
  background-color: #36393f;
  height: 100%;
}

.chatPeople {
  position: absolute;
  z-index: 10;
  height: 100%;
  right: 0%;
  width: 30% !important;
  min-width: 180px;
  background-color: #dddddd;
}

.header {
  height: 46px !important;
  line-height: 46px;
  background-color: #fff;
  text-align: left;
  padding-left: 30px;
  color: #666;
}

.body {
  overflow: auto;
  /* height: 79%; */
}

ul {
  padding: 0;
  margin: 0;
  list-style: none;
  height: 100%;
  /* overflow-x: auto;
  overflow-y: scroll; */
}

ul::-webkit-scrollbar {
  display: none;
}

ul li {
  /* height: 80px; */
  padding: 0;
  margin: 0;
  list-style: none;
}

/* message */
.list-item {
  display: flex;
  box-sizing: border-box;
  height: 100%;
  padding: 12px;
  padding-left: 18px;
  text-align: start;
  /* border-bottom: solid 0.5px #fff; */
}

.infoAndMessage {
  width: 85%;
}

.info {
  padding-top: 4px;
}

.info .name {
  margin-left: 15px;
  color: #ddd;
  cursor: pointer;
}

.info .time {
  margin-left: 10px;
  font-size: 14px;
  color: #999999;
}

.chat {
  padding: 0px 10px;
  margin-top: 8px;
  margin-left: 5px;
  /* border: solid 1px #ddd; */
  /* border-radius: 8px; */
  /* background-color: #53565f; */
  color: #bbb;
  font-size: 15px;
  word-break: break-word;
}

/* meaasge */
.footer {
  background-color: #fff;
  height: 23% !important;
  padding: 0;
}

.option {
  height: 30px;
}

.option i {
  line-height: 30px;
  font-size: 28px;
  float: left;
  margin-left: 30px;
  color: #a5a5a5;
}

.option i:hover {
  color: #5e98fc;
}

.edit {
  height: calc(100% - 72px);
}

.edit textarea {
  box-sizing: border-box;
  margin: 0px 10px 0px 20px;
  line-height: 1.2;
  display: block;
  width: calc(100% - 30px);
  height: 100%;
  outline: none;
  border: none;
  resize: none;
  box-shadow: none;
  color: #333;
}

.send {
  height: 42px;
  box-sizing: border-box;
}

.tip {
  float: right;
  line-height: 39px;
  font-size: 13px;
  color: #bbb;
  margin-right: 20px;
}

.btn {
  float: right;
  height: 25px;
  width: 80px;
  margin-top: 7px;
  margin-right: 30px;
  border: none;
  outline: none;
  background-color: #5e98fc;
  color: #fff;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
}

.btn:active {
  color: #ededed;
  background-color: #5286e0;
}

/* slide过渡动画 */
.slide-enter-active {
  transition: all 0.3s ease-out;
}
.slide-leave-active {
  transition: all 0.3s ease-out;
}
.slide-enter,
.slide-leave-to {
  width: 0% !important;
  min-width: 0% !important;
  /* opacity: 0; */
}
</style>
