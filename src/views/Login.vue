<template>
  <div class="login">
    <Login @on-submit="handleSubmit">
      <UserName name="username" />
      <Password name="password" />
      <div class="demo-auto-login">
        <a>忘记密码</a>
      </div>
      <Submit />
    </Login>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleSubmit(valid, { username, password }) {
      // http://fanyi.bhmanhua.top/server/api/manage/login.php
      const user = {
        sys: {
          user: {
            name: "lisi",
            access: "ROLE_ADMIN",
          },
          page: [
            {
              name: "审核原图",
              path: "/process/audit",
              meta: {
                auth: true,
              },
            },
            {
              name: "提炼日文",
              path: "/process/extract",
              meta: {
                auth: false,
              },
            },
          ],
        },
      };
      localStorage.setItem("user", JSON.stringify(user));

      if (valid) {
        this.axios
          .post("http://manage.bhmanhua.top/server/api/manage/login.php", {
            username: username,
            password: password,
          })
          .then((response) => {
            console.log(response);
            const res = response.data;
            localStorage.setItem("user", JSON.stringify(response.data));
            this.$router.push("/");
          });
      }
    },
  },
};
</script>
<style>
.login {
  height: 100vh;
  justify-content: center;
  display: flex;
  align-items: center;
}

.login .ivu-login {
  width: 400px;
}

.demo-auto-login {
  margin-bottom: 24px;
  text-align: left;
}

.demo-auto-login a {
  float: right;
}
</style>
