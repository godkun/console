<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container">
      <div class="view-account-top">
        <div class="view-account-top-logo">
          <img src="~@/assets/images/logo.png" alt="" />
        </div>
        <div class="view-account-top-desc">流媒体在线管理</div>
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
          <n-form-item path="password">
            <n-input
              v-model:value="formInline.password"
              type="password"
              showPasswordOn="click"
              placeholder="请输入密码">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block>
              登录
            </n-button>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex view-account-other">
              <div class="flex-initial" style="margin-left: auto">
                <a @click="register">注册账号</a>
                <a style="margin-left: 20px" @click="resetPassword">忘记密码</a>
              </div>
            </div>
          </n-form-item>
        </n-form>
      </div>
    </div>
    <img src="/guide.png" width="300" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useUserStore } from '@/store/modules/user'
  import { useMessage } from 'naive-ui'
  import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5'
  import { PageEnum } from '@/enums/pageEnum'

  interface FormState {
    mail: string
    password: string
  }

  const formRef = ref()
  const message = useMessage()
  const loading = ref(false)
  const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME

  const formInline = reactive({
    mail: '',
    password: '',
    isCaptcha: true
  })

  const rules = {
    mail: { required: true, message: '请输入邮箱账号', trigger: 'blur' },
    password: { required: true, message: '请输入密码', trigger: 'blur' }
  }

  const userStore = useUserStore()

  const router = useRouter()
  const route = useRoute()

  const handleSubmit = () => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const { mail, password } = formInline
        loading.value = true

        const params: FormState = {
          mail,
          password
        }

        try {
          const res = await userStore.login(params)
          message.destroyAll()
          if (res.code == 0) {
            const toPath = decodeURIComponent((route.query?.redirect || '/') as string)
            message.success('登录成功')
            if (route.name === LOGIN_NAME) {
              router.replace('/')
            } else router.replace(toPath)
          }
        } catch (err) {
          loading.value = false
        } finally {
          loading.value = false
        }
      } else {
        message.error('请填写完整信息，并且进行验证码校验')
      }
    })
  }

  function register() {
    router.push({
      name: 'Register'
    })
  }
  function resetPassword() {
    router.push({
      name: 'Password'
    })
  }

  document.onkeydown = function () {
    const key = window.event.keyCode
    //事件中keycode=13为回车事件
    if (key == 13) {
      handleSubmit()
    }
  }
</script>

<style lang="less" scoped>
  .view-account {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;
    & > img {
      margin: auto;
    }
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
        // height: 160px;
        // line-height: 64px;
        overflow: hidden;
        white-space: nowrap;

        img {
          width: auto;
          height: auto;
          // height: 64px;
        }

        .title {
          font-size: 18px;
          margin-bottom: 0;
          margin-left: 5px;
        }
      }

      &-desc {
        font-size: 24px;
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
      background-image: url('../../assets/images/login-bg.svg');
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 100%;
    }

    .page-account-container {
      padding: 32px 0 24px 0;
    }
  }
</style>
