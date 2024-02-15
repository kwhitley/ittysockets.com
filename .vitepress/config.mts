import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Itty Sockets",
  description: "Realtime communication in 3 lines of code.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    logo: '/logo.svg',

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024+ Itty Industries, llc.'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kwhitley/ittysockets.com' }
    ]
  }
})
