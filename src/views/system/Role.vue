<template>
  <Auth :authority="['ROLE_ADMIN']" :access="userAccess">
    <Card>
      <Button type="primary" icon="ios-add" ghost @click="addRoleDrawer = true"
        >添加角色</Button
      >
      <Table
        :columns="columns"
        :data="data"
        class="ivu-mt"
        @on-row-click="editUser"
      >
        <template #defaultRole="{ row, index }">
          <Tag size="small" :color="row.defaultRole ? 'green' : 'red'">{{
            row.defaultRole ? "是" : "否"
          }}</Tag>
        </template>
        <template #action="{ row, index }">
          <a @click.stop="cellMenuSelect(row)">页面权限</a>
          <Divider type="vertical" />
          <a @click="editUser(row)">编辑</a>
          <Divider type="vertical" />
          <a>删除</a>
        </template>
      </Table>
      <Drawer
        :styles="drawstyles"
        title="添加角色"
        width="360"
        :closable="true"
        v-model="addRoleDrawer"
      >
        <Form label-position="top">
          <FormItem label="角色名称">
            <Input
              type="text"
              v-model="addRoleForm.name"
              placeholder="请输入角色名称"
            />
          </FormItem>
          <FormItem label="说明">
            <Input
              type="text"
              v-model="addRoleForm.instructions"
              placeholder="请输入说明"
            />
          </FormItem>
          <FormItem label="是否默认角色">
            <Switch v-model="addRoleForm.defaultRole" />
          </FormItem>
        </Form>
        <div class="drawer-footer">
          <Button type="primary" @click="addRoleSubmit">提交</Button>
        </div>
      </Drawer>

      <!-- edit -->
      <Drawer
        :styles="drawstyles"
        title="编辑角色"
        width="360"
        :closable="true"
        v-model="editRoleDrawer"
      >
        <Form label-position="top">
          <FormItem label="角色名称">
            <Input
              type="text"
              v-model="editRoleDrawerData.name"
              placeholder="请输入角色名称"
            />
          </FormItem>
          <FormItem label="说明">
            <Input
              type="text"
              v-model="editRoleDrawerData.instructions"
              placeholder="请输入说明"
            />
          </FormItem>
          <FormItem label="是否默认角色">
            <Switch v-model="editRoleDrawerData.defaultRole" />
          </FormItem>
        </Form>
        <div class="drawer-footer">
          <Button type="primary" @click="addRoleSubmit">提交</Button>
        </div>
      </Drawer>
    </Card>

    <Modal
      :title="`分配${cellMenuSelectData.name}的页面权限`"
      v-model="showMenuModal"
    >
      <Tree
        :data="currentMenuSet"
        @on-select-change="treeSelect"
        show-checkbox
        v-model="menuVal"
      ></Tree>
    </Modal>
    <template #noMatch>
      <Alert type="error">权限不足</Alert>
    </template>
  </Auth>
</template>
<script>
export default {
  data() {
    return {
      menuVal: "",
      addRoleDrawer: false,
      editRoleDrawer: false,
      showMenuModal: false,
      editRoleDrawerData: "",
      cellMenuSelectData: { name: "", menu: [] },
      userAccess: "",
      addRoleForm: {
        name: "",
        instructions: "",
        roleStatus: false,
      },
      drawstyles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static",
      },
      currentMenuSet: [],
      columns: [
        {
          title: "角色名称",
          key: "name",
        },
        {
          title: "说明",
          key: "instructions",
        },
        {
          title: "创建时间",
          key: "createTime",
        },
        {
          title: "更新时间",
          key: "updateTime",
        },
        {
          title: "是否默认角色",
          slot: "defaultRole",
        },
        {
          title: "操作",
          slot: "action",
        },
      ],
      data: [
        {
          name: "ROLE_USER",
          instructions: "普通用户",
          createTime: "2015-23-3",
          updateTime: "2016-10-03",
          defaultRole: true,
        },
        {
          name: "ROLE_ADMIN",
          instructions: "管理员",
          createTime: "2019-9-10",
          updateTime: "2016-10-03",
          defaultRole: false,
        },
        {
          name: "ROLE_AUDIT",
          instructions: "原图审核",
          createTime: "2019-9-10",
          updateTime: "2016-10-03",
          defaultRole: false,
        },
        {
          name: "ROLE_EXTRACT",
          instructions: "提炼日文",
          createTime: "2019-9-10",
          updateTime: "2016-10-03",
          defaultRole: false,
        },
        {
          name: "ROLE_TRANSLATE",
          instructions: "翻译嵌字",
          createTime: "2019-9-10",
          updateTime: "2016-10-03",
          defaultRole: false,
        },
      ],
      menuData: [
        {
          title: "首页",
          expand: true,
          value: "/",
          selected: false,
          checked: false,
          children: [
            {
              title: "系统管理",
              expand: true,
              value: "/system",
              selected: false,
              checked: false,
              children: [
                {
                  title: "用户管理",
                  expand: true,
                  value: "/system/user",
                  selected: false,
                  checked: false,
                },
                {
                  title: "页面权限管理",
                  expand: true,
                  value: "/system/menu",
                  selected: false,
                  checked: false,
                },
                {
                  title: "角色管理",
                  expand: true,
                  value: "/system/role",
                  selected: false,
                  checked: false,
                },
              ],
            },
            {
              title: "流程页面",
              expand: true,
              value: "/system",
              selected: false,
              checked: false,
              children: [
                {
                  title: "审核原图",
                  expand: true,
                  value: "/process/audit",
                  selected: false,
                  checked: false,
                },
                {
                  title: "提炼日文",
                  expand: true,
                  value: "/process/extract",
                  selected: false,
                  checked: false,
                },
                {
                  title: "翻译嵌字",
                  expand: true,
                  value: "/system/role",
                  selected: false,
                  checked: false,
                },
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    editUser(row) {
      this.editRoleDrawer = true;
      this.editRoleDrawerData = row;
    },
    cellMenuSelect(row) {
      this.showMenuModal = true;
      const menu = this.menuData;
      if (row.name === "ROLE_ADMIN") {
        menu[0].checked = true;
        this.currentMenuSet = menu;
      } else if (row.name === "ROLE_AUDIT") {
        this.currentMenuSet = [];
        menu[0].checked = false;
        this.currentMenuSet = menu;
      } else {
        this.currentMenuSet = menu;
      }
      //   switch (row.name) {
      //     case "ROLE_ADMIN":
      //       this.menuData = [
      //         {
      //           title: "首页",
      //           expand: true,
      //           value: "/",
      //           checked: true,
      //           children: [
      //             {
      //               title: "系统管理",
      //               expand: true,
      //               value: "/system",
      //               checked: true,
      //               children: [
      //                 {
      //                   title: "用户管理",
      //                   expand: true,
      //                   value: "/system/user",
      //                   checked: true,
      //                 },
      //                 {
      //                   title: "页面权限管理",
      //                   expand: true,
      //                   value: "/system/menu",
      //                   checked: true,
      //                 },
      //                 {
      //                   title: "角色管理",
      //                   expand: true,
      //                   value: "/system/role",
      //                   checked: true,
      //                 },
      //               ],
      //             },
      //             {
      //               title: "流程页面",
      //               expand: true,
      //               value: "/system",
      //               checked: true,
      //               children: [
      //                 {
      //                   title: "审核原图",
      //                   expand: true,
      //                   value: "/process/audit",
      //                   checked: true,
      //                 },
      //                 {
      //                   title: "提炼日文",
      //                   expand: true,
      //                   value: "/process/extract",
      //                   checked: true,
      //                 },
      //                 {
      //                   title: "翻译嵌字",
      //                   expand: true,
      //                   value: "/system/role",
      //                   checked: true,
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //       ];

      //       break;
      //     case "ROLE_AUDIT":
      //       this.menuData = [
      //         {
      //           title: "首页",
      //           expand: true,
      //           value: "/",
      //           selected: false,
      //           checked: false,
      //           children: [
      //             {
      //               title: "系统管理",
      //               expand: true,
      //               value: "/system",
      //               selected: false,
      //               checked: false,
      //               children: [
      //                 {
      //                   title: "用户管理",
      //                   expand: true,
      //                   value: "/system/user",
      //                   checked: false,
      //                 },
      //                 {
      //                   title: "页面权限管理",
      //                   expand: true,
      //                   value: "/system/menu",
      //                   checked: false,
      //                 },
      //                 {
      //                   title: "角色管理",
      //                   expand: true,
      //                   value: "/system/role",
      //                   checked: false,
      //                 },
      //               ],
      //             },
      //             {
      //               title: "流程页面",
      //               expand: true,
      //               value: "/system",
      //               checked: false,
      //               children: [
      //                 {
      //                   title: "审核原图",
      //                   expand: true,
      //                   value: "/process/audit",
      //                   checked: true,
      //                 },
      //                 {
      //                   title: "提炼日文",
      //                   expand: true,
      //                   value: "/process/extract",
      //                   checked: false,
      //                 },
      //                 {
      //                   title: "翻译嵌字",
      //                   expand: true,
      //                   value: "/system/role",
      //                   checked: false,
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //       ];
      //       break;
      //     default:
      //   }

      this.cellMenuSelectData.name = row.name;
    },
  },
  mounted() {
    this.userAccess = JSON.parse(localStorage.getItem("user")).sys.user.access;
  },
};
</script>
