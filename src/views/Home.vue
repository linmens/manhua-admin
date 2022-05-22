<style>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.dev-run-preview .dev-run-preview-edit {
  display: none;
}
</style>
<template>
  <div class="Home-page">
    <div class="layout">
      <Sider
        :style="{
          position: 'fixed',
          height: '100vh',
          left: 0,
          overflow: 'auto',
        }"
      >
        <Menu
          :active-name="$route.name"
          theme="dark"
          width="auto"
          :open-names="['1', '2']"
        >
          <Submenu name="1">
            <template #title>
              <Icon type="ios-navigate"></Icon>
              系统管理
            </template>
            <MenuItem name="用户管理" to="/system/user">用户管理</MenuItem>
            <MenuItem name="页面权限管理" to="/system/menu"
              >页面权限管理</MenuItem
            >
            <MenuItem name="角色管理" to="/system/role">角色管理</MenuItem>
          </Submenu>
          <Submenu name="2">
            <template #title>
              <Icon type="ios-keypad"></Icon>
              流程页面
            </template>
            <MenuItem name="审核原图" to="/process/audit">审核原图</MenuItem>
            <MenuItem name="提炼日文" to="/process/extract">提炼日文</MenuItem>
            <MenuItem name="翻译嵌字">翻译嵌字</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout :style="{ marginLeft: '200px' }">
        <Header
          class="header-layout"
          :style="{
            background: '#fff',
            boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)',
          }"
        >
          <div class="header-item ivu-mr-8">
            <Avatar size="mini" :src="users.avatar"></Avatar>
          </div>
          <div class="header-item">{{ users.name }}</div>
        </Header>
        <Content :style="{ padding: '64px 16px 16px' }">
          <Breadcrumb :style="{ margin: '16px 0' }">
            <BreadcrumbItem
              :key="index"
              :to="item.path"
              v-for="(item, index) in breadList"
              >{{ item.name }}
            </BreadcrumbItem>
          </Breadcrumb>
          <div>
            <router-view />
          </div>
        </Content>
        <Footer class="layout-footer-center">2011-2022 &copy; fanyibao</Footer>
      </Layout>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      breadList: [],
      users: "",
    };
  },
  created() {
    this.users = JSON.parse(localStorage.getItem("user")).sys.user;
    this.getBreadcrumb();
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
  methods: {
    getBreadcrumb() {
      console.log(this.$route); //可以获取上下文路由 也就是可以获取父亲和孩子路由组成的数组
      if (Object.keys(this.$route.matched).length > 0) {
        this.breadList = this.$route.matched;
      } else {
        this.breadList = [];
      }
    },
  },
};
</script>

<style>
.header-layout {
  position: fixed;
  top: 0;
  width: calc(100% - 200px);
  left: 200px;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 100;
}
.header-item {
  padding: 0 10px;
  cursor: pointer;
}
.header-item:hover {
  background-color: #f8f8f9;
}
</style>
