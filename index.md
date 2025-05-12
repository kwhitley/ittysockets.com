---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Itty Sockets <small id=version></small>"
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
    details:  The entire client code is just 450 bytes.  It almost fits in a tweet!  This means it's easy to include anywhere you need it, even in the browser.

---

## Getting Started

### 1. Import the tiny [client](https://npmjs.com/package/itty-sockets).
```ts
import { connect } from 'itty-sockets' // ~422 bytes
```

### 2. Connect to a channel and use it.

No stringifying, parsing, or extra steps required.

#### `User A` connects to a channel and listens:
```ts
connect('my-cool-channel')
  .on('message',
    (e) => console.log('received:', e.message)
  )
```

#### `User B` connects to the same channel and sends:
```ts
const channel = connect('my-cool-channel')
  // send messages
  .send('hello world')
  .send([1, 2, 3])

// and keep sending on the open connection...
channel.send({ foo: 'bar' })
```

...meanwhile, `User A` receives:

```ts
// received: hello world
// received: [1, 2, 3]
// received: { foo: 'bar' }
```

### Don't want to import files?
Want to use it in a browser?  Just paste the snippet below and use `connect()` normally.  You'll lose TypeScript support, but this tiny script is the entire client code!

```ts
let connect=(e,s={})=>{let o,t=[],n=[],a=0,r={},c=()=>(o||(o=new WebSocket(`wss://ittysockets.io/r/${e??""}?${new URLSearchParams(s)}`),o.onopen=()=>{for(;t.length;)o?.send(t.shift());r.open?.(),a&&o?.close()},o.onmessage=(e,s=JSON.parse(e.data))=>{for(let e of n)e({...s,date:new Date(s.date)})},o.onclose=()=>(a=0,o=null,r.close?.())),l);const l=new Proxy(c,{get:(e,s)=>({open:c,close:()=>(1==o?.readyState?o.close():a=1,l),send:(e,s)=>(e=JSON.stringify(e),e=s?`@@${s}@@${e}`:e,1==o?.readyState?o.send(e)??l:(t.push(e),c())),push:(e,s)=>(a=1,l.send(e,s)),on:(e,s)=>(r[e]=s,"message"==e?(n.push(s),c()):l)}[s])});return l};
```

## Usage Tips
1. *You don't need to connect to start sending messages.*
Normal WebSocket race conditions (like trying to send before the connection is open) are handled internally within the client, so you can just send and forget.
All unsent messages will be queued, the connection opened, and the messages delivered once connected.

1. *The payloads are yours to control.*  We add our tiny wrapper, containing a bit of useful information about the message - and then send it to all the connections on the channel.  When received, it looks like this:

    ```ts
    type MessageEvent = {
      date: Date,       // actual Date object of original message
      id: String,       // unique message ID
      uid: String,      // unique user ID of the sending connection
      alias?: String    // optional alias if the user connected with one
      message: any      // your message payload
    }
    ```

    Example:
    ```ts
    connect('my channel', { echo: true }) // echo sends back to yourself for testing
      .on('message', (e: MessageEvent) => {
        console.log('received:', e.message, 'at', e.date.toLocaleTimeString())
      })
      .send([1, 2, 3])

    // received: [1, 2, 3] at 8:22:15 PM
    ```

1. *You can send messages or reply to a specific user, by passing a recipient `uid` along with the message payload:*
    ```ts
    connect('my channel')
      .send([1, 2, 3], 'rMUuzH') // assumes rMUuzH is a valid uid in the channel
    ```

1. *I include a bit of rate-limiting to prevent traffic that might impact the service for others.* If you flood the connection with messages, you'll be kicked from the server and blocked for a period of time.  Can it handle mousemove events and such?  Sure, but even then, you might want to throttle/debounce your own traffic to be kinder on the server and avoid a potential block.


### Like using it?
I don't want a dime, but a little motivation/flattery goes a long way! Consider giving me a shout-out:
  - [@kevinrwhitley](https://x.com/kevinrwhitley) on [X](https://x.com)
  - [@ittydev](https://x.com/ittydev) on [X](https://x.com)
  - [@ittydev](https://bsky.app/profile/itty.dev) on [BlueSky](https://bsky.app)

<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  const version = await fetch('https://ittysockets.io/version').then(r => r.text())
  console.log(`ittysockets.io @ v${version}`)
  document.getElementById('version').innerHTML = `v${version}`
})
</script>