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
    // logo: '/logo.svg',
    logo: '/itty-square.64.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kwhitley/ittysockets.com' },
      { icon: 'discord', link: 'https://discord.gg/MQcpj9SA4G' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/itty.dev' },
      { icon: 'x', link: 'https://twitter.com/ittydev' },
    ],
    editLink: {
      pattern: 'https://github.com/kwhitley/ittysockets.com/edit/main/:path',
      text: 'Edit this page on GitHub',
    },
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
      copyright: 'Copyright © 2025+ Itty'
    },
  },
  head: [
    ['link', { rel: 'icon', href: '/itty-square.64.png' }],
  ],
})
