<template>
  <div class="layout-header">
    <!--顶部菜单-->
    <div
      class="layout-header-left"
      v-if="navMode === 'horizontal' || (navMode === 'horizontal-mix' && mixMenu)">
      <div class="logo" v-if="navMode === 'horizontal'">
        <img src="~@/assets/imgs/logo.png" alt="" />
        <h2 v-show="!collapsed" class="title">Monibuca</h2>
      </div>
      <AsideMenu
        v-model:collapsed="collapsed"
        v-model:location="getMenuLocation"
        :inverted="getInverted"
        mode="horizontal" />
    </div>

    <!--左侧菜单-->
    <div class="layout-header-left" v-else>
      <!-- 菜单收起 -->
      <div
        class="ml-1 layout-header-trigger layout-header-trigger-min"
        @click="switchCollapse(collapsed)">
        <n-icon size="18" v-if="collapsed">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon size="18" v-else>
          <MenuFoldOutlined />
        </n-icon>
      </div>

      <!-- 刷新 -->

      <!-- <div
        class="mr-1 layout-header-trigger layout-header-trigger-min"
        v-if="headerSetting.isReload"
        @click="reloadPage">
        <n-icon size="18">
          <ReloadOutlined />
        </n-icon>
      </div> -->

      <!-- 面包屑 -->

      <n-breadcrumb v-if="crumbsSetting.show">
        <template v-for="routeItem in breadcrumbList" :key="routeItem.name">
          <n-breadcrumb-item>
            <n-dropdown
              v-if="routeItem.children.length"
              :options="routeItem.children"
              @select="dropdownSelect">
              <span class="link-text">
                <component
                  v-if="crumbsSetting.showIcon && routeItem.meta.icon"
                  :is="routeItem.meta.icon" />
                {{ routeItem.meta.title }}
              </span>
            </n-dropdown>
            <span class="link-text" v-else>
              <component
                v-if="crumbsSetting.showIcon && routeItem.meta.icon"
                :is="routeItem.meta.icon" />
              {{ routeItem.meta.title }}
            </span>
          </n-breadcrumb-item>
        </template>
      </n-breadcrumb>
    </div>
    <div class="layout-header-right">
      <div v-if="!isSaas" class="c-wrap">
        <n-button v-if="!isHome" type="primary" @click="goBack">返回首页</n-button>
      </div>
      <div v-if="!isSaas">
        <div class="c-wrap" v-if="isEnd">体验版时间已用尽，请联系官方人员</div>
        <div v-else class="c-wrap">
          体验版倒计时：
          <div :class="[isHigh ? 'count-down' : '']">
            <n-countdown :duration="duration" :on-finish="setTip" :active="active" />
          </div>
        </div>
      </div>

      <div
        class="layout-header-trigger layout-header-trigger-min"
        v-for="item in iconList"
        :key="item.icon.name">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="item.icon" v-on="item.eventObject || {}" />
            </n-icon>
          </template>
          <span>{{ item.tips }}</span>
        </n-tooltip>
      </div>

      <!--切换全屏-->

      <div class="layout-header-trigger layout-header-trigger-min">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="fullscreenIcon" @click="toggleFullScreen" />
            </n-icon>
          </template>
          <span>全屏</span>
        </n-tooltip>
      </div>

      <!-- 个人中心 -->

      <div class="layout-header-trigger layout-header-trigger-min">
        <div class="avatar" @click="userSetting">
          <n-avatar
            :style="{
              color: 'white',
              backgroundColor: '#2d8cf0'
            }"
            round>
            {{ username }}({{ level }})
          </n-avatar>
        </div>
      </div>

      <!--设置-->
      <div class="layout-header-trigger layout-header-trigger-min" @click="openSetting">
        <n-tooltip placement="bottom-end">
          <template #trigger>
            <n-icon size="18" style="font-weight: bold">
              <SettingOutlined />
            </n-icon>
          </template>
          <span>主题配置</span>
        </n-tooltip>
      </div>
    </div>
  </div>

  <!--项目配置-->
  <ProjectSetting ref="drawerSetting" />
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, ref, computed, unref, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import components from './components'
  import { NDialogProvider } from 'naive-ui'
  import { useUserStore } from '@/store/modules/user'
  import ProjectSetting from './ProjectSetting.vue'
  import { AsideMenu } from '@/layout/components/Menu'
  import { useProjectSetting } from '@/hooks'
  import { isTimeout } from '@/api/system/user'

  export default defineComponent({
    name: 'PageHeader',
    components: { ...components, NDialogProvider, ProjectSetting, AsideMenu },
    props: {
      collapsed: {
        type: Boolean
      },
      inverted: {
        type: Boolean
      }
    },
    emits: ['update:collapsed'],
    setup(props, { emit }) {
      const userStore = useUserStore()

      const {
        isSaas,
        getNavMode,
        getNavTheme,
        getHeaderSetting,
        getMenuSetting,
        getCrumbsSetting
      } = useProjectSetting()

      const drawerSetting = ref()

      const duration = ref(0)
      const active = ref(false)
      const isHigh = ref(false)
      const isEnd = ref(false)
      const currentRoute = useRoute()
      if (!isSaas.value) {
        isTimeout()
          .then((res) => {
            active.value = true

            duration.value = Number(res.data.remainseconds) * 1000
            if (duration.value < 5 * 60 * 1000) isHigh.value = true
            else isHigh.value = false
          })
          .catch((err) => {
            console.log(err)
            isEnd.value = true
          })
      }

      const state = reactive({
        username: userStore.username || userStore.mail,
        level: userStore.level,
        fullscreenIcon: 'FullscreenOutlined',
        navMode: getNavMode,
        navTheme: getNavTheme,
        headerSetting: getHeaderSetting,
        crumbsSetting: getCrumbsSetting
      })

      const getInverted = computed(() => {
        const navTheme = unref(getNavTheme)
        return ['light', 'header-dark'].includes(navTheme) ? props.inverted : !props.inverted
      })

      const mixMenu = computed(() => {
        return unref(getMenuSetting).mixMenu
      })

      const goBack = () => {
        window.location.href = '/#/instance/list'
        window.location.reload()
      }

      const getChangeStyle = computed(() => {
        const { collapsed } = props
        const { minMenuWidth, menuWidth }: any = unref(getMenuSetting)
        return {
          left: collapsed ? `${minMenuWidth}px` : `${menuWidth}px`,
          width: `calc(100% - ${collapsed ? `${minMenuWidth}px` : `${menuWidth}px`})`
        }
      })

      const getMenuLocation = computed(() => {
        return 'header'
      })

      const setTip = () => {
        console.log(888888)
        isEnd.value = true
      }

      const router = useRouter()
      const route = useRoute()

      const generator: any = (routerMap) => {
        return routerMap.map((item) => {
          const currentMenu = {
            ...item,
            label: item.meta.title,
            key: item.name,
            disabled: item.path === '/'
          }
          // 是否有子菜单，并递归处理
          if (item.children && item.children.length > 0) {
            // Recursion
            currentMenu.children = generator(item.children, currentMenu)
          }
          return currentMenu
        })
      }

      const breadcrumbList = computed(() => {
        return generator(route.matched)
      })

      const dropdownSelect = (key) => {
        router.push({ name: key })
      }

      const isHome = ref(route.name == 'instance_list')

      watch(
        () => currentRoute.fullPath,
        () => {
          isHome.value = currentRoute.name == 'instance_list'
        }
      )

      // 刷新页面
      const reloadPage = () => {
        router.push({
          path: '/redirect' + unref(route).fullPath
        })
      }

      // 切换全屏图标
      const toggleFullscreenIcon = () =>
        (state.fullscreenIcon =
          document.fullscreenElement !== null ? 'FullscreenExitOutlined' : 'FullscreenOutlined')

      // 监听全屏切换事件
      document.addEventListener('fullscreenchange', toggleFullscreenIcon)

      // 全屏切换
      const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen()
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          }
        }
      }

      // 图标列表
      const iconList = [
        {
          icon: 'GithubOutlined',
          tips: 'github',
          eventObject: {
            click: () => window.open('https://github.com/monibuca')
          }
        }
      ]
      // const avatarOptions = [
      //   {
      //     label: '个人设置',
      //     key: 1
      //   },
      //   {
      //     label: '退出登录',
      //     key: 2
      //   }
      // ]

      //头像下拉菜单
      // const avatarSelect = (key) => {
      //   switch (key) {
      //     case 1:
      //       router.push({ name: 'Setting' })
      //       break
      //     case 2:
      //       doLogout()
      //       break
      //   }
      // }

      function openSetting() {
        const { openDrawer } = drawerSetting.value
        openDrawer()
      }

      function switchCollapse(collapsed) {
        emit('update:collapsed', !collapsed)
      }

      return {
        isSaas,
        isEnd,
        isHigh,
        setTip,
        active,
        duration,
        ...toRefs(state),
        iconList,
        toggleFullScreen,
        // doLogout,
        route,
        dropdownSelect,
        userSetting() {
          router.push({ name: 'Setting' })
        },
        getChangeStyle,
        // avatarSelect,
        breadcrumbList,
        reloadPage,
        drawerSetting,
        openSetting,
        getInverted,
        getMenuLocation,
        mixMenu,
        switchCollapse,
        isHome,
        goBack
      }
    }
  })
</script>

<style lang="less" scoped>
  .layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    height: @header-height;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    transition: all 0.2s ease-in-out;
    width: 100%;
    z-index: 11;

    &-left {
      display: flex;
      align-items: center;

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 64px;
        line-height: 64px;
        overflow: hidden;
        white-space: nowrap;
        padding-left: 10px;

        img {
          width: auto;
          height: 32px;
          margin-right: 10px;
        }

        .title {
          margin-bottom: 0;
        }
      }

      ::v-deep(.ant-breadcrumb span:last-child .link-text) {
        color: #515a6e;
      }

      .n-breadcrumb {
        display: inline-block;
      }

      &-menu {
        color: var(--text-color);
      }
    }

    &-right {
      display: flex;
      align-items: center;
      margin-right: 20px;

      .avatar {
        display: flex;
        align-items: center;
        height: 64px;
      }

      > * {
        cursor: pointer;
      }
      .count-down {
        color: red;
        font-size: 20px;
        font-weight: bold;
      }
      .c-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
      }
    }

    &-trigger {
      display: inline-block;
      width: 64px;
      height: 64px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      .n-icon {
        display: flex;
        align-items: center;
        height: 64px;
        line-height: 64px;
      }

      &:hover {
        background: hsla(0, 0%, 100%, 0.08);
      }

      .anticon {
        font-size: 16px;
        color: #515a6e;
      }
    }

    &-trigger-min {
      width: auto;
      padding: 0 12px;
    }
  }

  .layout-header-light {
    background: #fff;
    color: #515a6e;

    .n-icon {
      color: #515a6e;
    }

    .layout-header-left {
      ::v-deep(.n-breadcrumb .n-breadcrumb-item:last-child .n-breadcrumb-item__link) {
        color: #515a6e;
      }
    }

    .layout-header-trigger {
      &:hover {
        background: #f8f8f9;
      }
    }
  }

  .layout-header-fix {
    position: fixed;
    top: 0;
    right: 0;
    left: 200px;
    z-index: 11;
  }
</style>
