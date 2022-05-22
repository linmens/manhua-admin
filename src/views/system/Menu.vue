<template>
	<Auth :authority="['ROLE_ADMIN']" :access="userAccess">
		<Row gutter="20">
			<Col span="10">
			<Card>

				<Tree :data="menuData" @on-select-change="treeSelect" show-checkbox v-model="menuVal"></Tree>
			</Card>
			</Col>
			<Col span="14">
			<Card>
				<template #title>
					<Avatar size="small" style="color: rgb(24, 144, 255); background-color: rgb(230, 247, 255);">
						<Icon type="ios-apps"></Icon>
					</Avatar>

					{{menuEditData.title}}
				</template>
				<Form label-width="70">
					<FormItem label="页面标题">
						<Input v-model="menuEditData.title"></Input>
					</FormItem>
					<FormItem label="路径">
						<Input v-model="menuEditData.value"></Input>
					</FormItem>
					<FormItem label="菜单权限">
						<Input v-model="menuEditData.roleSet"></Input>
					</FormItem>
				</Form>
			</Card>
			</Col>

		</Row>
		<template #noMatch>
			<Alert type="error">权限不足</Alert>
		</template>

	</Auth>

</template>

<script>
	export default {
		data() {
			return {
				menuVal: '',
				menuEditData: '',
				userAccess: '',
				menuData: [{
					title: '首页',
					expand: true,
					value: '/',
					selected: false,
					checked: false,
					children: [{
						title: '系统管理',
						expand: true,
						value: '/system',
						selected: false,
						checked: false,
						children: [{
								title: '用户管理',
								expand: true,
								value: '/system/user',
								selected: false,
								checked: false,
							},
							{
								title: '页面权限管理',
								expand: true,
								value: '/system/menu',
								selected: false,
								checked: false,
							},
							{
								title: '角色管理',
								expand: true,
								value: '/system/role',
								selected: false,
								checked: false,
							}
						]
					}, ]
				}]
			}
		},
		mounted() {
			this.userAccess = JSON.parse(localStorage.getItem('user')).sys.user.access;
		},
		methods: {
			treeSelect(data) {
				console.log(data)
				this.menuEditData = data[0]
			}
		}
	}
</script>

<style>
</style>
