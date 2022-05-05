<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container">
      <div class="view-account-top">
        <div class="view-account-top-logo">
          <img src="~@/assets/images/logo.png" alt="" />
          <h2 class="title">Monibuca</h2>
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
            <n-input v-model:value="formInline.mail" placeholder="请输入邮箱帐号">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="verifycode">
            <n-input v-model:value="formInline.verifycode" placeholder="请输入邮箱验证码">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
            <n-button type="success" @click="sendCode" :disabled="isDisabled">{{
              btnText
            }}</n-button>
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
              注册
            </n-button>
          </n-form-item>
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
  import { getVerifyCode } from '@/api/system/user'

  interface FormState {
    password: string
    mail: string
    verifycode: string
  }

  const isDisabled = ref(false)
  const btnText = ref('发送邮箱验证码')
  const counter = ref(10)

  const formRef = ref()
  const message = useMessage()
  const loading = ref(false)
  const REGISTER_NAME = PageEnum.BASE_REGISTER_NAME

  const formInline = reactive({
    password: '',
    mail: '',
    verifycode: ''
  })

  const rules = {
    mail: { required: true, message: '请输入邮箱', trigger: 'blur' },
    password: { required: true, message: '请输入密码', trigger: 'blur' },
    verifycode: { required: true, message: '请邮箱验证码', trigger: 'blur' }
  }

  const userStore = useUserStore()

  const router = useRouter()
  const route = useRoute()

  const handleSubmit = (e) => {
    e.preventDefault()
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const { verifycode, password, mail } = formInline
        message.loading('注册中...')
        loading.value = true

        const params: FormState = {
          verifycode,
          password,
          mail
        }

        try {
          const res = await userStore.register(params)
          message.destroyAll()
          if (res.code == 0) {
            localStorage.setItem('mail', mail)
            const toPath = decodeURIComponent((route.query?.redirect || '/') as string)
            message.success('注册成功，即将进入系统')
            if (route.name === REGISTER_NAME) {
              router.replace('/')
            } else router.replace(toPath)
          } else {
            message.info(res.msg || '登录失败')
          }
        } finally {
          loading.value = false
        }
      } else {
        message.error('请填写正确信息')
      }
    })
  }

  function sendCode() {
    if (!formInline.mail) {
      message.info('请输入邮箱验证码')
    } else {
      const params = {
        mail: formInline.mail
      }
      getVerifyCode(params).then(() => {
        message.info('验证码发送成功，请注意查收')
        const timer = setInterval(() => {
          isDisabled.value = true
          btnText.value = `(${counter.value}秒)后重新发送`
          counter.value--
          if (counter.value < 0) {
            clearInterval(timer)
            btnText.value = `发送邮箱验证码`
            isDisabled.value = false
            counter.value = 10
          }
        }, 1000)
      })
    }
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
