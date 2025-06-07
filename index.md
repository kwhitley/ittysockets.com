---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Itty Sockets <small id=version></small>"
  text: "Realtime, Simplified."
  tagline: No accounts needed.  Just start sending.<a href="#viewer-count-demo" id="watching">There <span id="watching-count"></span> on this page. *</a>
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
// received: "hello world"
// received: [1, 2, 3]
// received: { foo: "bar" }
```

### Don't want to import files?
Want to use it in a browser?  Just paste the snippet below and use `connect()` normally.  You'll lose TypeScript support, but this tiny script is the entire client code!

```ts
let connect=(e,o={})=>{let s,t=[],n=0,r={},a=()=>(s||(s=new WebSocket(`wss://ittysockets.io/r/${e}?${new URLSearchParams(o)}`),s.onopen=()=>{for(;t.length;)s?.send(t.shift());for(let e of r.open??[])e();n&&s?.close()},s.onmessage=(e,o=JSON.parse(e.data))=>{for(let e of r[o.type??"message"]??[])e({...o,date:new Date(o.date)})},s.onclose=()=>{n=0,s=null;for(let e of r.close??[])e()}),l);const l=new Proxy(a,{get:(e,o)=>({open:a,close:()=>(1==s?.readyState?s.close():n=1,l),send:(e,o)=>(e=JSON.stringify(e),e=o?`@@${o}@@${e}`:e,1==s?.readyState?(s.send(e),l):(t.push(e),a())),push:(e,o)=>(n=1,l.send(e,o)),on:(e,o)=>((r[e]??=[]).push(o),a()),remove:(e,o,s=r[e],t=s?.indexOf(o)??-1)=>(~t&&s?.splice(t,1),a())}[o])});return l};
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

1. *You can send private messages or reply to a specific user, by passing a recipient `uid` along with the message payload:*
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


## Viewer Count Demo
The realtime viewer count on this page is powered by itty-sockets.  Here's how it works:
```ts
// get the element to update
const watching = document.getElementById('watching-count')

// set the count when a new user joins or leaves
const setWatching = ({ users }) => {
  watching.innerHTML = users
  watching.className = users > 1 ? 'plural' : 'singular'
}

// connect to the channel and set the count when a new user joins or leaves
const channel = connect('watching/' + window.location.pathname)
  .on('join', setWatching)
  .on('leave', setWatching)
```

<script setup>
  import { onMounted } from 'vue'
  import { connect } from 'itty-sockets'

  onMounted(async () => {
    const version = await fetch('https://ittysockets.io/version').then(r => r.text())
    console.log(`ittysockets.io @ v${version}`)
    document.getElementById('version').innerHTML = `v${version}`

    const watching = document.getElementById('watching-count')

    const setWatching = ({ users }) => {
      watching.innerHTML = users
      watching.className = users > 1 ? 'plural' : 'singular'
    }

    const channel = connect('watching/' + window.location.pathname)
      .on('join', setWatching)
      .on('leave', setWatching)

    return () => channel.close()
  })
</script>
