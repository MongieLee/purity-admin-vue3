<script setup>
import {reactive} from "vue";
import {message} from "ant-design-vue";
import AuthService from "../../../services/auth/auth.js";
import {useRouter} from "vue-router";

const router = useRouter();

const formState = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ""
});

const onFinish = async (values) => {
  await AuthService.changePassword(values);
  message.success("修改密码成功，需要重新登录");
  // todo：清除缓存
  router.push("/login")
};

const resetForm = () => {
  formState.oldPassword = ""
  formState.newPassword = ""
  formState.confirmPassword = ""
}

const validator = (rule, value, cb) => {
  if (!value) {
    return Promise.reject('请输入确认新密码')
  }
  if (!(value === formState.newPassword)) {
    return Promise.reject("与新密码不一致")
  } else {
    return Promise.resolve();
  }
}
</script>

<template>
  <a-card>
    <h3><strong>修改密码</strong></h3>
    <p>修改成功后将自动退出系统，需要重新登录账号！</p>
    <a-form
        name="fuck"
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
    >
      <a-form-item
          label="旧密码"
          name="oldPassword"
          :rules="[{ required: true, message: '请输入旧密码!' }]"
      >
        <a-input-password v-model:value="formState.oldPassword" placeholder="请输入旧密码"/>
      </a-form-item>

      <a-form-item
          label="新密码"
          name="newPassword"
          :rules="[{ required: true, message: '请输入新密码!' }]"
      >
        <a-input-password v-model:value="formState.newPassword" placeholder="请输入新密码"/>
      </a-form-item>

      <a-form-item
          label="确认新密码"
          name="confirmPassword"
          :rules="[{ required: true ,validator}]"
      >
        <a-input-password v-model:value="formState.confirmPassword" placeholder="请确认新密码"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24 }">
        <div style="display: flex;justify-content: center">
          <a-button @click="resetForm" style="margin-right: 1em;">重置</a-button>
          <a-button type="primary" html-type="submit">确认</a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<style>
</style>
