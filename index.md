---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Itty Sockets"
  text: "Realtime, Simplified."
  tagline: No accounts needed.  Just start sending.
  <!-- actions:
    - theme: brand
      text: Markdown Examples
      link: /markdown-examples
    - theme: alt
      text: API Examples
      link: /api-examples -->
features:
  - icon: 🚀
    title: Simple.
    details: Building realtime features is hard.  I wanted to make it easy <i>(mostly for myself)</i>.<br /><br /> Like... really easy.
  - icon: 💪🏼
    title: Powerful.
    details:  I provide the communication layer, but leave the rest to you.  Your payloads can be anything you want.
  - icon: 😎
    title: Private.
    details:  These channels are as private as the channel name you pick.  Plus, I log nothing, track nothing, and store nothing. That's easier for me, and safer for you.
  - icon: 😶‍🌫️
    title: Tiny.
    details:  The entire client code is just 400 bytes.  It almost fits in a tweet!  This means it's easy to include anywhere you need it, even in the browser.

---

## Getting Started

### 1. [Import the client](https://npmjs.com/package/itty-sockets)
```ts
import { connect } from 'itty-sockets' // ~400 bytes
```

Don't want to import files?  Want to use it in a browser?  Just paste the snippet below and start using it immediately.  You'll lose TypeScript support, but this is the entire client code! I told you it was tiny.

```ts
let connect=(e,s={})=>{let t,n=[],o=[],a=0,r=()=>{t||(t=new WebSocket(`wss://ittysockets.io/r/${e??""}?${new URLSearchParams(s)}`),t.onopen=()=>{for(;n.length;)t?.send(n.shift());a&&t?.close()},t.onmessage=(e,s=JSON.parse(e.data))=>{for(let e of o)e({...s,date:new Date(s.date)})},t.onclose=()=>(a=0,t=null))};return new Proxy(r,{get:(e,s,l)=>({ws:t,send:(e,s)=>(e=JSON.stringify(e),e=s?`@@${s}@@${e}`:e,1==t?.readyState?t.send(e)??l:(n.push(e),r()??l)),push:(e,s)=>(a=1,l.send(e,s)),listen:(e,s)=>(o.push((t=>(!s||s(t))&&e(t))),r()??l),close:()=>(1==t?.readyState?t.close():a=1,l)}[s])})};
```

### 2. Connect to a channel and use it.

No stringifying, parsing, or extra steps required.

```ts
const channel = connect('my-cool-channel', { echo: true })

  // listen for messages
  .listen(e => console.log('received:', e.message))

  // send messages
  .send('hello world')
  .send([1,2,3])
  .send({ foo: 'bar' })

// received: hello world
// received: [1, 2, 3]
// received: { foo: 'bar' }
```