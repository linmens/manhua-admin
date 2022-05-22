import {
	createApp
} from "vue";
import ViewUIPlus from "view-ui-plus";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./styles/index.less";
// import './mock'
// import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

// Vue.use(VueAxios, axios);
const app = createApp(App);


app.use(VueAxios, axios);
app.use(store).use(router).use(ViewUIPlus).mount("#app");
console.log(app)
