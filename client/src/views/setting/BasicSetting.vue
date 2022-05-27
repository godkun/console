<template>
  <n-grid cols="2 s:2 m:2 l:3 xl:3 2xl:3" responsive="screen">
    <n-grid-item>
      <n-form :label-width="80" :model="formValue" :rules="rules" ref="formRef">
        <n-form-item label="旧密码" path="oldpassword">
          <n-input v-model:value="formValue.oldpassword" placeholder="请输入旧密码" />
        </n-form-item>

        <n-form-item label="新密码" path="password">
          <n-input placeholder="请输入新密码" v-model:value="formValue.password" />
        </n-form-item>

        <div>
          <n-space>
            <n-button type="primary" @click="formSubmit">确定修改</n-button>
          </n-space>
        </div>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useMessage } from 'naive-ui'
  import { changePassword } from '@/api/system/user'

  const rules = {
    oldpassword: {
      required: true,
      message: '请输入旧密码',
      trigger: 'blur'
    },
    password: {
      required: true,
      message: '请输入新密码',
      trigger: 'blur'
    }
  }
  const formRef: any = ref(null)
  const message = useMessage()

  const formValue = reactive({
    oldpassword: '',
    password: ''
  })

  function formSubmit() {
    formRef.value.validate((errors) => {
      if (!errors) {
        const { oldpassword, password } = formValue
        const params = {
          oldpassword,
          password
        }
        changePassword(params).then(() => {
          message.info('修改密码成功，下次登录请使用新密码！')
        })
      } else {
        message.error('验证失败，请填写完整信息')
      }
    })
  }
</script>
