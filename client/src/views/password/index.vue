<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container">
      <div class="view-account-top">
        <div class="view-account-top-logo">
          <img src="~@/assets/images/logo.png" alt="" />
          <h2 class="title">Monibuca</h2>
        </div>
      </div>
      <div class="view-account-form">
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
          :rules="rules">
          <n-form-item path="mail">
            <n-input v-model:value="formInline.mail" placeholder="请输入邮箱账号">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block>
              重置密码
            </n-button>
          </n-form-item>
        <div class="view-account-top-desc">点击重置密码后，请到绑定邮箱中查看重置密码，并点击链接进行激活</div>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useUserStore } from '@/store/modules/user'
  import { useMessage } from 'naive-ui'
  import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5'
  import { PageEnum } from '@/enums/pageEnum'
  import { resetPassword } from '@/api/system/user'

  interface FormState {
    mail: string
    password: string
  }

  const formRef = ref()
  const message = useMessage()
  const loading = ref(false)
  const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME

  const formInline = reactive({
    mail: ''
  })

  const rules = {
    mail: { required: true, message: '请输入邮箱账号', trigger: 'blur' },
  }

  const userStore = useUserStore()

  const router = useRouter()
  const route = useRoute()

  const handleSubmit = (e) => {
    e.preventDefault()
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const { mail } = formInline
        const params: FormState = {
          mail
        }
        resetPassword(params).then(() => {
          message.info('重置密码成功，请登录邮箱查看重置密码，并进行激活')
        })
      } else {
        message.error('重置密码失败，请稍后再试')
      }
    })
  }

  function register() {
    router.push({
      name: 'Register'
    })
  }
  function find() {
    router.push({
      name: 'FindPassword'
    })
  }
</script>

<style lang="less" scoped>
  .view-account {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;

    &-container {
      flex: 1;
      padding: 32px 0;
      width: 384px;
      margin: 0 auto;
    }

    &-top {
      padding: 32px 0;
      text-align: center;

      &-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 64px;
        line-height: 64px;
        overflow: hidden;
        white-space: nowrap;

        img {
          width: auto;
          height: 32px;
        }

        .title {
          font-size: 18px;
          margin-bottom: 0;
          margin-left: 5px;
        }
      }

      &-desc {
        font-size: 14px;
        color: #808695;
      }
    }

    &-other {
      width: 100%;
    }

    .default-color {
      color: #515a6e;

      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }
  }

  @media (min-width: 768px) {
    .view-account {
      background-image: url('../../assets/images/login.svg');
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 100%;
    }

    .page-account-container {
      padding: 32px 0 24px 0;
    }
  }
</style>
