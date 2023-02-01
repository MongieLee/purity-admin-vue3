<script setup>
import {setAuthToken} from '@/utils/token';
import {useRoute, useRouter} from "vue-router";
import {UserOutlined, LockOutlined} from "@ant-design/icons-vue";
import {reactive, ref} from "vue";
import {message} from "ant-design-vue"
import AuthService from "../../services/auth/auth.js";

const router = useRouter();
const topic = '后台管理系统'
const minorTitle = '管理系统';

const formState = reactive({
  username: undefined,
  password: undefined
})
const loginLoading = ref(false);
const route = useRoute();
const onFinish = async () => {
  loginLoading.value = true;
  try {
    const {token, expires, refresh_token} = await AuthService.login(formState);
    setAuthToken(token, expires);
    message.success("登录成功");
    router.push(route.query.redirect ? decodeURIComponent(route.query.redirect) : "/");
  } finally {
    loginLoading.value = false;
  }
}
</script>

<template>
  <div class="container">
    <a-card class="card-decorator">
      <div class="dfcc">
        <img width="50" src="@/assets/logo.png" alt="company's log"/>
        <span class="topic">{{ topic }}</span>
      </div>
      <p class="minor-title">{{ minorTitle }}</p>
      <a-form :model="formState" autocomplete="off" @finish="onFinish">
        <a-form-item name="username"
                     :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="formState.username">
            <template #prefix>
              <user-outlined/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model:value="formState.password">
            <template #prefix>
              <lock-outlined/>
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button class="login-btn" size="large" :loading="loginLoading" type="primary"
                    html-type="submit">登录
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>


<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: calc(((100vw - 40rem) / 2) - 3.2rem),
  calc(((100vw - 40rem) / 2) - 3.2rem), cover;
  background-position: left bottom, right bottom;
  background-image: url("@/assets/left.svg"), url("@/assets/right.svg");

  .topic {
    margin-left: 1rem;
    font-size: 2.2rem;
    font-weight: bold;
  }

  .minor-title {
    text-align: center;
    font-size: 1.2rem;
    color: #848587;
  }

  .card-decorator {
    width: 460px;
    height: 50vh;
    padding: 3.2rem;
    box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
  }

  .login-btn {
    width: 100%;
    margin-top: 12px;
  }
}
</style>
