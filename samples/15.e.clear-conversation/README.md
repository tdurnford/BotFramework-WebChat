# Sample - Clear Conversation

A full-featured Web Chat with a custom Redux store where one can listen for all incoming activities and dispatch actions to.

# How to run locally

- Fork this repository
- Navigate to `/Your-Local-WebChat/samples/15.e.clear-conversation` in command line
- Run `npx serve` in the full-bundle directory
- Browse to [http://localhost:5000/](http://localhost:5000/)

# Things to try out

- Send a message to the bot and wait for the timer to expire - a new conversation should be started with the bot.
- Send a message to the bot and send a second message before the timer expires - the time remaining should reset to default time alloted.

# Code

> Jump to [completed code](#completed-code) to see the end-result `index.html`.

## Overview

### Goals of this bot

This sample starts with the [full-bundle CDN sample](./../01.a.getting-started-full-bundle/README.md) as the base template.

In this sample, we take advantage of the Web Chat (Redux) store to add custom functionality on the app hosting the bot when bot actions are sent. This means that your app can listen for the dispatch of actions from Web Chat and dispatch actions to the store, though you do not have the capability to modify the internal state of the store. Once your app receives the notification of that dispatch, you are free to add whatever customization your app requires.

In this case, Web Chat waits for the dispatch of an action with type `'WEB_CHAT/SEND_MESSAGE'`. Each Web Chat receives that action, the app will reset and start a session timer. When the timer expires, all of the Activities in the chat will be deleted and Web Chat will disconnect from Direct Line and create a new conversation.

To see the bot actions you are able to intercept, please take a look at the [actions directory](https://github.com/Microsoft/BotFramework-WebChat/tree/master/packages/core/src/actions) in the Web Chat repo. Note that you can also listen for any specific `activity.name` that pertains to your particular bot.

First, set up the store via the `createStore` method, which will be passed into the rendering of Web Chat. The first parameter is the initial state, which you can initialize as an empty object (`{}`) and the second is the middleware we will be applying.

```js
const store = window.WebChat.createStore({}, ({ dispatch } => next => action => next(action)));
```

Expand your middleware method to filter the activities you want to listen for (in this case, outgoing activities). 

```diff
const store = window.WebChat.createStore(
    {},
    ({ dispatch }) => next => action => {
+        if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
+            // ...
+        } else if (action.type === 'WEB_CHAT/SEND_MESSAGE') {
+            timer.start();
+        }
        return next(action);
    }
);
```

Next, we are going to create a `deleteConversation` function that the timer will call when the session expires. The function will iterate through and delete all of the activities from the store. Then it will disconnect from DirectLine and request a new token to start a new conversation.

```diff
+ async function deleteConversation() {
+     const { activities } = store.getState();
+ 
+     // Delete Activities 
+     activities.forEach( ({ id }) => {
+         store.dispatch({
+             type: 'DIRECT_LINE/DELETE_ACTIVITY',
+             payload: {
+                 activityID: id
+             }
+         });
+     });
+ 
+     // Disconnect DirectLine
+     store.dispatch({
+         type: 'DIRECT_LINE/DISCONNECT'
+     });
+ 
+     // Connect to a new DirectLine conversation
+     const res = await fetch('https://thdurn-all-channels-directline-token.azurewebsites.net/+ directline/token', { method: 'POST' });
+     const { token } = await res.json();
+ 
+     store.dispatch({
+         type: 'DIRECT_LINE/CONNECT',
+         payload: {
+             directLine: window.WebChat.createDirectLine({ token }),
+         }
+     });
+ }
```

Finally, pass in your new store to the Web Chat render method, and that's it.

```diff
window.WebChat.renderWebChat({
  directLine: window.WebChat.createDirectLine({ token }),
+ store
}, document.getElementById('webchat'));
```

## Completed code

Here is the finished `index.html`:

```diff
<!DOCTYPE html>
<html lang="en-US">
  <head>
-    <title>Web Chat: Full-featured bundle</title>
+    <title>Web Chat: Clear chat history</title>
    <!--
      For demonstration purposes, we are using the development branch of Web Chat at "/master/webchat.js".
      When you are using Web Chat for production, you should use the latest stable release at "/latest/webchat.js",
      or lock down on a specific version with the following format: "/4.1.0/webchat.js".
    -->
    <script src="https://cdn.botframework.com/botframework-webchat/master/webchat.js"></script>
    <style>
        html, body { height: 100% }
-       body { margin: 0 }
+       body { 
+           display: flex;
+           flex-direction: column;
+           height: 100%;
+           margin: 0 
+       }
+
        #webchat {
+           flex: 1;
            width: 100%;
        }

+       div.time-remaining {
+           padding: 10px 10px; 
+
+           color: #807f7f;
+           text-align: right;
+           font-family: "Calibri", "Helvetica Neue", Arial, sans-serif;
+       }
    </style>
  </head>
  <body>
+   <div class="time-remaining">
+       Time Remaining: <b><span id="timer">0:00</span></b>
+   </div>
    <div id="webchat" role="main"></div>
    
    <script>

      (async function () {
        // In this demo, we are using Direct Line token from MockBot.
        // To talk to your bot, you should use the token exchanged using your Direct Line secret.
        // You should never put the Direct Line secret in the browser or client app.
        // https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-authentication

+       // Session length in seconds
+       const DEFAULT_TIME_INTERVAL = 15;
+
+       class Timer {
+           /**
+           * Constructor
+           * @param {seconds} integer
+           * @param {onStart} function
+           */
+           constructor(seconds=DEFAULT_TIME_INTERVAL) {
+               this.seconds = seconds;
+               
+               this.onStart = () => {};
+               this.onSecond = () => {};
+               this.onComplete = () => {};
+           }
+
+           start() {
+               this.reset();
+               this.onStart(this.secondsRemaining);
+
+               this.secondInterval = setInterval(() => {
+                   if (this.secondsRemaining === 0) {
+                       this.stop();
+                       this.onComplete();
+                   } else {
+                       this.secondsRemaining--;
+                   }
+                   this.onSecond(this.secondsRemaining);
+               }, 1000);
+           }
+
+           reset() {
+               this.stop();
+               this.secondsRemaining = this.seconds;
+           }
+
+           stop() {
+               clearInterval(this.secondInterval);
+           }
+
+           addOnStartCallback(callback) {
+               this.onStart = callback;
+               return this;
+           }
+
+           addOnSecondCallback(callback) {
+               this.onSecond = callback;
+               return this;
+           }
+
+           addOnCompleteCallback(callback) {
+               this.onComplete = callback;
+               return this;
+           }
+
+           static formatSeconds(seconds) {
+               return `${Math.floor(seconds / 60)}:${('0' + (seconds % 60)).slice(-2)}`;
+           }
+       }
+
+       function updateTimerElement(seconds) {
+           const timerElement = document.getElementById("timer");
+           timerElement.textContent = Timer.formatSeconds(seconds);
+           timerElement.style.color = (seconds < 10 && seconds !== 0)? 'red': '#807f7f';
+       }
+
+       const timer = new Timer()
+                       .addOnStartCallback(updateTimerElement)
+                       .addOnSecondCallback(updateTimerElement)
+                       .addOnCompleteCallback(deleteConversation);
+
+       async function deleteConversation() {
+           const { activities } = store.getState();
+
+           // Delete Activities 
+           activities.forEach( ({ id }) => {
+               store.dispatch({
+                   type: 'DIRECT_LINE/DELETE_ACTIVITY',
+                   payload: {
+                       activityID: id
+                   }
+               });
+           });
+
+           // Disconnect DirectLine
+           store.dispatch({
+               type: 'DIRECT_LINE/DISCONNECT'
+           });
+
+           // Connect to a new DirectLine conversation
+           const res = await fetch('https://thdurn-all-channels-directline-token.azurewebsites.net/directline/token', { +method: 'POST' });
+           const { token } = await res.json();
+
+           store.dispatch({
+               type: 'DIRECT_LINE/CONNECT',
+               payload: {
+                   directLine: window.WebChat.createDirectLine({ token }),
+               }
+           });
+       }
       const res = await fetch('https://thdurn-all-channels-directline-token.azurewebsites.net/directline/token', { method: 'POST' });
       const { token } = await res.json();
       
+      // We are adding a new middleware to customize the behavior of WEB_CHAT/SEND_MESSAGE.
+      const store = window.WebChat.createStore(
+          {},
+          ({ dispatch }) => next => action => {
+              if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
+                  dispatch({
+                      type: 'WEB_CHAT/SEND_EVENT',
+                      payload: {
+                          name: 'webchat/join',
+                          value: { language: window.navigator.language }
+                      }
+                  });
+              } else if (action.type === 'WEB_CHAT/SEND_MESSAGE') {
+                  timer.start();
+              }
+              return next(action);
+          }
+      );
 
        window.WebChat.renderWebChat({
-           directLine: window.WebChat.createDirectLine({ token })
+           directLine: window.WebChat.createDirectLine({ token }),
+           store
        }, document.getElementById('webchat'));

        document.querySelector('#webchat > *').focus();
      })().catch(err => console.error(err));
    </script>
  </body>
</html>

```

# Further reading

- Article on [Redux Middleware](https://medium.com/@jacobp100/you-arent-using-redux-middleware-enough-94ffe991e6)

- [Piping to Redux bot](https://microsoft.github.io/BotFramework-WebChat/14.customization-piping-to-redux/) | [Piping to Redux source code](./../14.customization-piping-to-redux)

## Full list of Web Chat hosted samples

View the list of [available Web Chat samples](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples)
