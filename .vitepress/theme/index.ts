// https://vitepress.dev/guide/custom-theme
import { h, ref, onMounted, defineComponent } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.scss'

export default {
  extends: DefaultTheme,
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
} satisfies Theme