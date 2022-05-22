<template>
	<Auth :authority="['ROLE_ADMIN','ROLE_AUDIT']" :access="userAccess">
		<Card>
			<div class="Audit-page">
				<Table :loading="loading" :columns="columns" :data="data">
					<template #name="{ row, index }">
						<Avatar icon="ios-person" :src="row.avatar" class="ivu-mr-8" />
						<strong>{{ row.name }}</strong>
					</template>
					<template #image="{ row, index }">
						<div class="audit-image-box">
							<img id="auditImage" @click="toViewImage(row)" class="audit-image" :src="row.image" />
						</div>
					</template>
					<template #action="{ row, index }">
						<Button @click="toViewImage(row)" shape="circle" size="small" type="success"
							class="ivu-mr-8">审查图片</Button>
						<Button shape="circle" size="small" type="error" @click="unpass(row)">不通过</Button>
					</template>
				</Table>

				<!-- 待审核点击图片弹出 -->
				<Modal draggable sticky loading @on-visible-change="ischange" v-model="imageViewModal" title="原图审核"
					@on-ok="pass" @on-cancel="cancel" okText="通过并将序号图上传至服务器">
					<!-- :style="{ width: imageViewModalLayout.width }" -->
					<div class="modal-image-box">
						<div @click="addPoint($event)" id="auditImg">
							<img :src="imageViewSrc" style="width: 100%" />
						</div>
					</div>

					<ButtonGroup>
						<Button @click="cancel" type="primary" shape="circle">清空序号
							<Icon type="ios-trash" size="15" />
						</Button>
						<Button type="primary" shape="circle" @click="view">预览序图</Button>
					</ButtonGroup>
					<div>
						<h4>预览序图</h4>
						<img :src="htmlUrl" />
						<canvas ref="headCanvas" style="position: absolute; height: 0; width: 0; opacity: 0"></canvas>
					</div>
				</Modal>
			</div>
		</Card>
		<template #noMatch>
			<Alert type="error">权限不足</Alert>
		</template>

	</Auth>

</template>

<script>
	import html2canvas from "html2canvas";
	import {
		drag
	} from "../../components/pointer";
	export default {
		data() {
			return {
				loading: false,
				imageViewModal: false,
				count: 0,
				userAccess: '',
				imageViewSrc: "",
				//   点击序号后生成的图片
				htmlUrl: "",
				imageViewModalLayout: {
					width: "",
					height: "",
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
						title: "原图",
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
				isflag: false,
				invincibleData: "",
				//   点击上传时发送的pid
				sendPid: "",
			};
		},
		mounted() {

			// this.userAccess = JSON.parse(localStorage.getItem('user')).sys.user.access;
			const authData = JSON.parse(localStorage.getItem('user')).sys;
			this.userAccess = authData.user.access
			const page = authData.page
			console.log(this.userAccess, 'audit')

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
				console.log('允许发送api')
				this.axios
					.get("http://fanyi.bhmanhua.top/server/api/manage/getAuditData.php")
					.then((response) => {
						console.log(response);
						this.data = response.data;
					});
			}
		},

		methods: {
			//   不通过的方法
			unpass(row) {
				this.$Modal.confirm({
					title: "提示",
					content: "<p>确认不通过？</p>",
					loading: true,
					onOk: () => {
						this.axios
							.put(
								`http://manage.bhmanhua.top/server/api/manage/putAuditData.php?pid=${row.pid}`
							)
							.then((response) => {
								console.log(response);
								setTimeout(() => {
									this.$Modal.remove();
									this.$Message.info("审核完成");
								}, 1000);
								this.data = response.data;
							});
					},
				});
			},

			tabsClick(name) {
				console.log(name);
				this.axios
					.get(
						`http://manage.bhmanhua.top/server/api/getAuditData.php?type=${name}`, {
							type: name,
						}
					)
					.then((response) => {
						console.log(response);
						this.data = response.data;
					});
			},

			toViewImage(row) {
				console.log(row);
				this.$Notice.info({
					title: "操作提示",
					duration: 10,
					name: "viewImageNotice",
					render: (h) => {
						return h(
							"a", {
								class: "audit-notice",
							},
							[
								"1、单击图片可标注序号，生成序号图 ",
								h("a", "2、拖动标注序号以改变位置"),
								" ",
							]
						);
					},
				});
				this.imageViewModal = !this.imageViewModal;
				this.imageViewSrc = row.image;
				this.sendPid = row.pid;
				const auditImage = document.getElementById("auditImage");
				this.imageViewModalLayout.width = auditImage.naturalWidth + 40;

				this.imageViewModalLayout.height = auditImage.naturalHeight;
			},
			addPoint(e) {
				console.log(e, "check");
				const auditImg = document.getElementById("auditImg");
				const span = document.createElement("span");
				span.className = "point";
				span.setAttribute("id", `drag-${this.count}`);
				//   拖动中禁止向html添加span
				if (!this.isflag) {
					this.count++;
					auditImg.appendChild(span);
				} else {
					this.isflag = false;
				}

				drag(span);

				span.style.top = e.offsetY + "px";
				span.style.left = e.offsetX + "px";
				span.innerHTML = this.count;
				span.addEventListener("mousedown", this.touchmoveHandle, false);
			},

			touchmoveHandle(e) {
				this.isflag = true;
			},
			// 将base64转成文件
			dataURLtoFile(dataurl, filename) {
				let arr = dataurl.split(","),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new File([u8arr], filename, {
					type: mime,
				});
			},
			ischange(flag) {
				console.log(flag);
				if (!flag) {
					this.cancel();
					this.$Notice.close("viewImageNotice");
				}
			},
			cancel() {
				this.count = 0;
				this.htmlUrl = "";
				const auditImg = document.getElementById("auditImg");
				const span = auditImg.querySelectorAll(".point");
				for (var i = 0; i < span.length; i++) {
					span[i].parentNode.removeChild(span[i]);
				}
			},
			view() {
				const auditImg = document.getElementById("auditImg");
				let vm = this;

				html2canvas(auditImg, {
					useCORS: true,
				}).then((canvas) => {
					let url = canvas.toDataURL("image/png");
					//一定要设置为let，不然图片不显示，下面解释↓
					// let image = new Image();

					//解决跨域问题
					// image.setAttribute("crossOrigin", "anonymous");
					//this.invincibleData.thumb这里是网络图片路径，
					//比如：https://down.yantongtech.cn/data/upload/images/2021-03-29/8567a979ba7ab9fd94e49866f095b9e5.jpg?1617081289278
					// image.src = url;

					//image.onload为异步加载
					// image.onload = () => {
					//   var canvas = vm.$refs.headCanvas;
					//   var context = canvas.getContext("2d");
					//   canvas.width = image.width;
					//   canvas.height = image.height;
					//   context.drawImage(image, 0, 0, image.width, image.height);
					//   var dataurl = canvas.toDataURL("image/png");
					//   //得到64位格式
					//   this.invincibleData = dataurl;
					// };
					this.htmlUrl = url;
					// 把生成的base64位图片上传到服务器,生成在线图片地址
				});
			},
			// 如果通过
			pass() {
				const auditImg = document.getElementById("auditImg");
				html2canvas(auditImg, {
					useCORS: true,
				}).then((canvas) => {
					let url = canvas.toDataURL("image/png");

					let pageBlob = this.dataURLtoFile(url);
					this.sendUrl(pageBlob, this.count);
					// 把生成的base64位图片上传到服务器,生成在线图片地址
					// this.sendUrl();
				});
			},
			// 图片上传服务器
			sendUrl(file, count) {
				if (count === 0) return;
				//步骤1:将base64位图片转为formData上传格式
				let params = new window.FormData();
				let fileOfBlob = new File([file], new Date().getTime() + ".jpg");
				params.append("file", fileOfBlob);
				console.log(this.sendPid, "data"); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
				const test =
					"https://www.fastmock.site/mock/743294800277f57d3eb11de685fa2cf0/api/api/auditUpload";
				const url = "http://manage.bhmanhua.top/server/api/auditUpload.php";
				const url2 =
					"http://fanyi.bhmanhua.top/server/api/manage/auditUpload.php";
				//   let f = this.dataURLtoFile(this.htmlUrl, "new"); //data为裁剪后的base64位图片
				let config = {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				};
				this.axios
					.post(
						url2, {
							data: params.get("file"),
							allOrderNum: count,
							pid: this.sendPid,
						},
						config
					)
					.then((res) => {
						if (res.data.status) {
							this.$Message.success(res.data.status);
							this.data = res.data.waitList;
							setTimeout(() => {
								this.imageViewModal = false;
							}, 1000);
						}
					});
			},

			setPoint(x, y, num) {
				// 获取到屏幕倒是是几倍屏。
				const myCanvas = document.getElementById("myCanvas");
				let ctx = myCanvas.getContext("2d");
				let getPixelRatio = function(context) {
					var backingStore =
						context.backingStorePixelRatio ||
						context.webkitBackingStorePixelRatio ||
						context.mozBackingStorePixelRatio ||
						context.msBackingStorePixelRatio ||
						context.oBackingStorePixelRatio ||
						context.backingStorePixelRatio ||
						1;
					return (window.devicePixelRatio || 1) / backingStore;
				};
				// iphone6下得到是2
				const pixelRatio = getPixelRatio(myCanvas);
				// 设置canvas的真实宽高
				myCanvas.width = pixelRatio * myCanvas.offsetWidth; // 想当于 2 * 375 = 750
				myCanvas.height = pixelRatio * myCanvas.offsetHeight;
				//   ctx.save();
				//   ctx.beginPath();
				//   ctx.strokeStyle = "red";
				//   ctx.fillStyle = "red";
				//   ctx.arc(x, y, 10, 0, 2 * Math.PI);
				//   ctx.fill(); //开始填充
				//   ctx.font = "14px bold";
				//   ctx.fillStyle = "white";
				//   ctx.fillText(num, x - 3, y + 4);
				//   ctx.textAlign = "center";
				//   ctx.stroke();
				//   ctx.restore();
			},
		},
	};
</script>

<style>
	ul,
	li {
		list-style: none;
	}

	img {
		width: 100%;
	}

	.audit-image-box {
		width: 100px;
		height: 100px;
		display: flex;
		align-items: center;
		margin: 10px 0;
		overflow: hidden;
	}

	.audit-image {
		width: 100%;
	}

	.modal-image-box {
		display: flex;
		position: relative;
		align-items: center;
		justify-content: space-between;
	}

	#auditImg {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.lispoint {
		background-color: red;
		line-height: 25px;
		font-weight: bold;
		text-align: center;
		color: white;
		width: 25px;
		height: 25px;
		border-radius: 100%;
	}

	.point {
		background-color: red;
		color: white;
		width: 25px;
		height: 25px;
		border-radius: 100%;
		position: absolute;
		text-align: center;
		line-height: 25px;
		font-weight: bold;
		cursor: move;
	}

	.auditPointList {
		position: absolute;
		top: 0;
		right: 10px;
		bottom: 0;
		background-color: rgba(64, 64, 64, 0.762);
		width: 100px;
		/* height: %; */
		height: calc(100% - 5px);
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.pointItem {
		/* background: #fff; */
		color: white;
		padding: 10px;
		display: flex;
		align-items: center;
		cursor: pointer;
		justify-content: space-between;
	}

	.pointItem:hover {
		background-color: rgb(180, 180, 180);
	}

	.audit-notice {
		height: 50px;
		line-height: 28px;
	}
</style>
