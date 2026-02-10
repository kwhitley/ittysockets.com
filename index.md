---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Itty Sockets <small id=version></small>"
  text: "Realtime, Simplified."
  tagline: No accounts, no API keys.  Just start sending.<a href="#viewer-count-demo" id="watching">There <span id="watching-count"></span> on this page. *</a>
  <!-- actions:
    - theme: brand
      text: Markdown Examples
      link: /markdown-examples
    - theme: alt
      text: API Examples
      link: /api-examples -->
features:
  - icon: 🚀
    title: Dead-Simple.
    details: I <i>hate</i> boilerplate. In fact, I hate steps in general.
      <br /><br />I figure that's a pretty safe DX target to optimize for...
  - icon: 💪🏼
    title: Flexible.
    details:  I provide the communication layer, but leave the rest to you.
      <br /><br />Your messages can be anything you want.*
      <br /><br /><span class="footnote">* As long as it's JSON serializable.</span>
  - icon: 😎
    title: Private.
    details:  These channels are as private as the channel name you pick.  I log nothing, track nothing, and store nothing.
      </br /><br />Want something even more secure? Encrypt your payloads!
  - icon: 😶‍🌫️
    title: Tiny.
    details:  The entire client code is well under 500 bytes.
      <br /><br />Because <i>powerful</i> code doesn't need to be <i>big</i> code.

---

## Getting Started

### 1. Import the tiny [client](https://npmjs.com/package/itty-sockets).
```ts
import { connect } from 'itty-sockets' // ~466 bytes
```

### 2. Connect to a channel and use it.

No stringifying, parsing, or extra steps required.

#### `User A` connects to a channel and listens:

```ts
connect('my-cool-channel')
  .on('message', ({ message }) =>
    console.log('received:', message)
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

### Optional
This library includes handy message-routing based on either `message.type` or even a custom filter function. Using `.on('message', handler)` will catch *any* message, but using custom types/filters allows you to route easily between *different types of messages*.

```ts
// SENDER
channel.send({ type: 'myChat', content: 'hey there', isPetOwner: true })

// RECEIVER
channel
  .on('myChat', ({ content }) => {
    // do something with content
  })
  .on((e: MessageEvent) => e.is)

```

### Don't want to import files?
Want to use it in a browser?  Just paste the snippet below and use `connect()` normally.  You'll lose TypeScript support, but this is all the code you need!

```ts
let connect=(e,s={})=>{let a,t,n=[],p={},o=()=>(a||(a=new WebSocket((/^wss?:/.test(e)?e:"wss://itty.ws/c/"+e)+"?"+new URLSearchParams(s)),a.onmessage=(e,s=JSON.parse(e.data),a=s?.message,t={...null==a?.[0]&&a,...s})=>[t.type,s.type?0:"message","*"].map(e=>p[e]?.map(e=>e(t))),a.onopen=()=>(n.splice(0).map(e=>a.send(e)),p.open?.map(e=>e(t)),t&&a?.close()),a.onclose=()=>(t=a=null,p.close?.map(e=>e(t)))),l),l={open:o,send:(e,s)=>(e=(s?`${s}`:"")+JSON.stringify(e),1&a?.readyState?a.send(e):n.push(e),o()),on:(e,s)=>((p[e?.[0]?e:"*"]??=[]).push(e?.[0]?s:a=>e?.(a)&&s(a)),o()),remove:(e,s)=>(p[e]=p[e]?.filter(e=>e!=s),l),close:()=>(1&a?.readyState?a.close():t=1,l),push:(e,s)=>(t=1,l.send(e,s))};return l};
```

### Does itty-sockets (client) work on *any* WebSocket server?
As long as it serves/accepts JSON, yes!  You lose a few niceties like `join` and `leave` messages, but you still get a tiny client that handles race conditions, auto parses, etc.

```ts
const ws = connect('wss://randomserver.com')
             .on('message', console.log)  // parsed
             .send({ foo: 'bar' })        // can send immediately

setInterval(ws.open, 1000)                // auto-reconnect every 1s
```

## Usage Tips
1. *You don't need to connect to start sending messages.*
Normal WebSocket race conditions (like trying to send before the connection is open) are handled internally within the client, so you can just send and forget.
All unsent messages will be queued, the connection opened, and the messages delivered once connected.

1. *The payloads are yours to control.*  We add our tiny wrapper, containing a bit of useful information about the message - and then send it to all the connections on the channel.  When received, it looks like this:

    ```ts
    type MessageEvent = {
      date: number,     // UNIX timestamp of original message
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
