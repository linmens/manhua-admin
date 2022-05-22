import {
	createRouter,
	createWebHistory
} from "vue-router";
import Home from "@/views/Home.vue";
import Audit from "@/views/process/Audit.vue";
import Extract from "@/views/process/Extract.vue";
import User from "@/views/system/User.vue";
import Role from "@/views/system/Role.vue";
import Menu from "@/views/system/Menu.vue";
import Login from "@/views/Login.vue";
const routes = [{
		path: "/",
		name: "首页",
		component: Home,
		children: [{
				path: "/process/audit",
				name: "审核原图",
				component: Audit,
			},
			{
				path: "/process/extract",
				name: "提炼日文",
				component: Extract,
			},
			{
				path: "/system/user",
				name: "用户管理",
				component: User,
			},
			{
				path: "/system/role",
				name: "角色管理",
				component: Role,
			}, {
				path: "/system/menu",
				name: "页面权限管理",
				component: Menu,
			},
		],
	},
	{
		path: "/login",
		name: "Login",
		component: Login,
	},
];

const router = createRouter({
	routes,
	history: createWebHistory(process.env.BASE_URL),
	scrollBehavior() {
		return {
			top: 0
		};
	},
});
router.beforeEach(async (to, from) => {
	const user = JSON.parse(localStorage.getItem('user'));
	// const usertest = JSON.parse(localStorage.getItem('usertest'));
	console.log(user);
	console.log(to, 'router')
	if (
		// 检查用户是否已登录
		user === null &&
		// ❗️ 避免无限重定向
		to.name !== 'Login'
	) {
		// 将用户重定向到登录页面
		return {
			name: 'Login'
		}
	}
})
export default router;
