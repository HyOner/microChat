import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import VueSocketio from "vue-socket.io";
import App from './App'
import chatroom from './chatroom'
import welcome from './welcome'

Vue.use(new VueSocketio({
  debug: true,
  connection: 'http://localhost:10000/'}));
Vue.use(ElementUI);
Vue.use(VueRouter);

const router = new VueRouter({
  mode:'history',
  routes: [
    { path: '/', redirect: '/chatroom' },
    { path: '/chatroom', component: chatroom },
    { path: '/welcome', component: welcome }
  ]
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
