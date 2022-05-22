<template>
	<Auth :authority="['ROLE_ADMIN','ROLE_EXTRACT']" :access="userAccess">
		<Card>
			<Table :loading="loading" :columns="columns" :data="data">
				<template #name="{ row, index }">
					<Avatar icon="ios-person" :src="row.avatar" class="ivu-mr-8" />
					<strong>{{ row.name }}</strong>
				</template>
				<template #image="{ row, index }">
					<div class="audit-image-box">
						<img id="auditImage" @click="toPickView(row)" class="audit-image" :src="row.image" />
					</div>
				</template>
				<template #action="{ row, index }">
					<Button @click="toPickView(row)" shape="circle" size="small" type="success"
						class="ivu-mr-8">提取日文</Button>
				</template>
			</Table>
			<div class="extract-image-box" v-if="pickViewModal">
				<img :src="imageViewSrc" style="width: 100%" />
			</div>
			<Drawer title="提取日文" :closable="true" v-model="pickViewModal" width="450">
				<Form ref="formDynamic" :model="formDynamic" :label-width="60">
					<template v-for="(item, index) in formDynamic.items">
						<FormItem style="width: 100%" v-if="item.index" :key="index" :label="'序号' + item.index"
							:prop="'items.' + index + '.value'">
							<Input type="textarea" v-model="item.value" placeholder="..."></Input>
						</FormItem>
					</template>
				</Form>
				<div style="display: flex; justify-content: flex-end">
					<Button type="primary" @click="handleSubmit('formDynamic')">保存</Button>
					<Button @click="handleReset('formDynamic')" style="margin-left: 8px">重置</Button>
				</div>
			</Drawer>
			<Modal class-name="draw" title="提取日文" :width="imageViewModalLayout.width" footer-hide okText="保存">
			</Modal>
		</Card>
		<template #noMatch>
			<Alert type="error">权限不足</Alert>
		</template>

	</Auth>
</template>

<script>
	export default {
		data() {
			return {
				pickViewModal: false,
				userAccess: '',
				imageViewModalLayout: {
					width: "",
					height: "",
				},
				formDynamic: {
					items: [{
						value: "",
						index: 1,
						status: 1,
					}, ],
				},
				columns: [{
						title: "用户名",
						slot: "name",
					},
					{
						title: "上传时间",
						key: "time",
					},
					{
						title: "序图",
						slot: "image",
					},
					{
						title: "标题",
						key: "title",
					},
					{
						title: "操作",
						slot: "action",
					},
				],
				data: [{
						name: "John Brown",
						time: "2022-5-18",
						image: "https://img2.baidu.com/it/u=2468362699,2612376962&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
						title: "New York No. 1 Lake Park",
						status: "审核通过",
					},
					{
						name: "Jim Green",
						time: 24,
						image: "https://img2.baidu.com/it/u=2468362699,2612376962&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
						address: "London No. 1 Lake Park",
						date: "2016-10-01",
						allOrderNum: 10,
					},
					{
						name: "Joe Black",
						age: 30,
						address: "Sydney No. 1 Lake Park",
						date: "2016-10-02",
					},
					{
						name: "Jon Snow",
						age: 26,
						address: "Ottawa No. 2 Lake Park",
						date: "2016-10-04",
					},
				],
			};
		},
		mounted() {
			const authData = JSON.parse(localStorage.getItem('user')).sys;
			this.userAccess = authData.user.access
			const page = authData.page
			let flag = false
			for (var i = 0; i < page.length; i++) {
				if (this.$route.name === [i].name) {
					if (page[i].meta.auth) {
						flag = page[i].meta.auth
					}
				}
			}
			console.log(flag, 'flag')
			if (flag) {
				this.axios
					.get("http://fanyi.bhmanhua.top/server/api/manage/getExtractData.php")
					.then((response) => {
						console.log(response);
						this.data = response.data;
					});
			}


		},
		methods: {
			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						this.$Message.success("Success!");
					} else {
						this.$Message.error("Fail!");
					}
				});
			},
			handleReset(name) {
				this.$refs[name].resetFields();
			},
			handleAdd() {
				this.index++;
				this.formDynamic.items.push({
					value: "",
					index: this.index,
					status: 1,
				});
			},
			handleRemove(index) {
				this.formDynamic.items[index].status = 0;
			},
			toPickView(row) {
				console.log(row.allOrderNum, "row");
				this.pickViewModal = !this.pickViewModal;
				this.imageViewSrc = row.image;
				const auditImage = document.getElementById("auditImage");
				this.imageViewModalLayout.width = auditImage.naturalWidth + 40;
				this.imageViewModalLayout.height = auditImage.naturalHeight;
				if (row.allOrderNum === undefined) return;
				const newArr = [];
				for (var i = 0; i < row.allOrderNum; i++) {
					newArr.push({
						value: "",
						status: "",
						index: i + 1,
					});
				}
				this.formDynamic.items = newArr;
			},
		},
	};
</script>

<style>
	.extract-image-box {
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 1001;
		left: 0;
		/* width: auto; */
		/* padding: 20px; */
		overflow-y: scroll;
	}
</style>

<style lang="less">
	// .vertical-center-modal{
	//     display: flex;
	//     align-items: center;
	//     justify-content: center;
	// }
	.vertical-center-modal .ivu-modal {
		top: 0;
		right: 0;
		bottom: 0;
	}
</style>
