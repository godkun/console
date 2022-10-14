<template>
  <div class="editor" ref="dom"></div>
</template>

<script lang="ts">
  import { onMounted, ref, defineComponent, toRefs, watchEffect } from 'vue'
  import loader from '@monaco-editor/loader'

  // 设置中文菜单
  loader.config({ 'vs/nls': { availableLanguages: { '*': 'zh-cn' } } })

  export default defineComponent({
    props: {
      json: String
    },
    emits: ['update:json'],
    setup(props, { emit }) {
      const { json } = toRefs(props)
      const dom = ref()
      // 当编辑器修改值时，则不再setValue
      const isSetValue = ref(true)
      let instance: any = null
      const createInstance = async () => {
        const monaco = await loader.init()
        instance = monaco.editor.create(dom.value, {
          model: monaco.editor.createModel(json.value!, 'yaml'),
          tabSize: 2,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          foldingStrategy: 'indentation',
          overviewRulerBorder: true,
          theme: 'vs-dark'
        })
        instance &&
          instance.onDidChangeModelContent(() => {
            isSetValue.value = false
            emit('update:json', instance?.getValue())
          })
      }

      watchEffect(() => {
        isSetValue.value && instance && instance.setValue(json.value)
        isSetValue.value = true
      })

      onMounted(() => {
        isSetValue.value = true
        createInstance()
      })

      return {
        dom
      }
    }
  })
</script>
<style></style>
