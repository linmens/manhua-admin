<template>
  <Auth :authority="['ROLE_ADMIN']" :access="userAccess">
    <Card>
      <Table :columns="columns" :data="data" @on-row-click="editUser">
        <template #account="{ row, index }">
          <Avatar icon="ios-person" :src="row.avatar" class="ivu-mr-8" />
          {{ row.account }}
        </template>
        <template #sex="{ row, index }">
          <Tag size="small" :color="row.sex === '男' ? 'blue' : 'magenta'">{{
            row.sex
          }}</Tag>
        </template>
        <template #status="{ row, index }">
          <Badge status="success" v-show="row.status === '正常'" />
          <Badge status="error" v-if="row.status === '冻结'" />
          <Badge status="default" v-show="row.status === '关闭'" />
          {{ row.status }}
        </template>
        <template #action="{ row, index }">
          <a @click="editUser(row)">编辑</a>
          <Divider type="vertical" />
          <a>删除</a>
        </template>
      </Table>
      <div class="ivu-mt ivu-text-center">
        <Page
          :total="allUserNum"
          show-total
          show-elevator
          @on-change="pageChange"
          @on-prev="pageChange"
          @on-next="pageChange"
        />
      </div>

      <Drawer
        :styles="drawstyles"
        title="编辑用户"
        width="560"
        :closable="true"
        v-model="editDrawer"
      >
        <Form>
          <Row :gutter="16">
            <Col span="10" class="ivu-text-center">
              <Avatar icon="ios-person" size="60" :src="editData.avatar" />
            </Col>
            <Col span="14">
              <div>用户ID: {{ editData.userId }}</div>
              <div class="ivu-mt-8">创建时间: {{ editData.createTime }}</div>
            </Col>
          </Row>

          <Divider />
          <Row :gutter="16">
            <Col span="12">
              <FormItem label="用户名">
                <Input type="text" v-model="editData.account" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="手机号">
                <Input type="text" v-model="editData.phone" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="16">
            <Col span="12">
              <FormItem label="邮箱">
                <Input type="text" v-model="editData.email" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="性别">
                <Input type="text" v-model="editData.sex" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="16">
            <Col span="12">
              <FormItem label="状态">
                <!-- <Input type="text" v-model="editData.status" /> -->
                <Select v-model="editData.status">
                  <Option
                    v-for="item in statusList"
                    :value="item.status"
                    :key="item.status"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="角色分配">
                <Select multiple v-model="editData.roleSet">
                  <Option
                    v-for="item in roleList"
                    :key="item.name"
                    :value="item.name"
                  >
                    <span>{{ item.name }}</span>
                    <span style="float: right; color: #ccc">{{
                      item.instructions
                    }}</span>
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="个性签名">
            <Input type="text" v-model="editData.has" />
          </FormItem>
        </Form>
        <div class="drawer-footer">
          <Button style="margin-right: 8px" @click="editDrawer = false"
            >取消</Button
          >
          <Button type="primary" @click="editSubmit">提交</Button>
        </div>
      </Drawer>
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
      allUserNum: 0,
      editDrawer: false,
      userAccess: "",
      editData: "",
      currentPage: 1,
      statusList: [
        {
          status: "正常",
          label: "正常",
        },
        {
          status: "冻结",
          label: "冻结",
        },
        {
          status: "关闭",
          label: "关闭",
        },
      ],
      roleList: [
        {
          name: "ROLE_USER",
          instructions: "普通用户",
        },
        {
          name: "ROLE_ADMIN",
          instructions: "管理员",
        },
        {
          name: "ROLE_AUDIT",
          instructions: "原图审核",
        },
        {
          name: "ROLE_EXTRACT",
          instructions: "提炼日文",
        },
        {
          name: "ROLE_TRANSLATE",
          instructions: "翻译嵌字",
        },
      ],
      drawstyles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static",
      },
      columns: [
        {
          title: "用户名",
          slot: "account",
          width: 200,
        },

        {
          title: "手机号",
          key: "phone",
        },
        {
          title: "邮箱",
          key: "email",
          width: 240,
        },
        {
          title: "性别",
          slot: "sex",
        },
        {
          title: "状态",
          slot: "status",
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 230,
        },
        {
          title: "操作",
          slot: "action",
          fixed: "right",
        },
      ],
      data: [
        {
          account: "John Brown",
          phone: 1535354747,
          email: "278544142@qq.com",
          createTime: "2022-1-3",
          sex: "女",
          status: "正常",
        },
        {
          account: "John Brown",
          phone: 1535354747,
          email: "278544142@qq.com",
          createTime: "2022-1-3",
          sex: "男",
          status: "正常",
        },
        {
          account: "John Brown",
          phone: 1535354747,
          email: "278544142@qq.com",
          createTime: "2022-1-3",
          sex: "女",
          status: "冻结",
        },
        {
          account: "John Brown",
          phone: 1535354747,
          email: "278544142@qq.com",
          createTime: "2022-1-3",
          sex: "女",
          status: "关闭",
        },
      ],
    };
  },
  mounted() {
    const authData = JSON.parse(localStorage.getItem("user")).sys;
    this.userAccess = authData.user.access;
    const page = authData.page;
    console.log(this.userAccess, "audit");

    let flag = false;
    for (var i = 0; i < page.length; i++) {
      if (this.$route.name === page[i].name) {
        if (page[i].meta.auth) {
          flag = page[i].meta.auth;
        }
      }
    }
    if (flag) {
      this.getUserList();
    }
  },
  methods: {
    editSubmit() {
      // this.editDrawer = false
      console.log(this.editData);
      this.axios
        .put(`http://fanyi.bhmanhua.top/server/api/manage/putUserList.php`, {
          editData: this.editData,
        })
        .then((response) => {
          console.log(response);
        });
    },
    editUser(row) {
      this.editDrawer = true;
      this.editData = row;
    },
    getUserList() {
      this.axios
        .get(
          `http://fanyi.bhmanhua.top/server/api/manage/userList.php?page=${this.currentPage}`
        )
        .then((response) => {
          console.log(response);
          this.data = response.data.userList;
          this.allUserNum = response.data.allUserNum;
        });
    },
    pageChange(page) {
      console.log(page);
      this.currentPage = page;
      this.getUserList();
    },
  },
};
</script>
<style>
.drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>
