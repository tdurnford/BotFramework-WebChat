# Sample - Set and Display Character Limit on Web Chat

## Description
A simple web page that includes a maximized Web Chat with a character limit for messages from the user and a counter that displays the number of remaining characters.

# How to run
- Fork this repository
- Navigate to `/Your-Local-WebChat/samples/________________` in command line
- Run `npx serve`
- Browse to [http://localhost:5000/](http://localhost:5000/)

# Things to try out
- Type a message to the bot longer than 25 characters: the number of remaining characters should deminish as you type and you should not be able to continue typing your message once you've hit the character limit.

# Code

> Jump to [completed code](#completed-code) to see the end-result `index.html`.

## Getting started

### Goals of this bot
 This sample will show you how to add a character limit to WebChat and a counter to a simple webpage.

This sample starts with the [full-bundle CDN sample](./../01.a.getting-started-full-bundle/README.md) as the base template.

First we need to add our character counter to the web page. We placed the WebChat component and the counter inside of a div container to help with styling WebChat and the counter later on.

```diff
...
- <div id="webchat" role="main" class="item"></div>
+ <div class="webchat-container">
+    <div id="webchat" role="main"></div>
+    <div class="character-counter">
+        Characters Remaining: <b><span id="counter" class="counter"></span></b>
+    </div>
+ </div>
...
```

Now, we need to initilize the counter's text value to the desired MAX_LENGTH for each message. Then we need to set the `maxlength` property for the input field in WebChat. This will prevent users' messages from exceeding the specified max length. We also need to add an event listener for keyup events to the text input field in the WebChat component. Everytime a user releases a key while they are typing in the input field, we are going to update the counter display to show the remaining number of characters.

```diff
…
+ const MAX_LENGTH = 25;
+        
+ // Initilize the character counter to MAX_LENGTH.
+ document.getElementById("counter").textContent = MAX_LENGTH;
+
+ // Set the max length attribute of the text input field in WebChat to MAX_LENGTH.
+ document.querySelector('input[aria-label="Type your message"]').maxLength = MAX_LENGTH;
+
+ // Add keyup listener to the text input field in Webchat
+ document.querySelector('input[aria-label="Type your message"]').addEventListener('keyup', (event) => {
+   const characterCount = event.target.value.length;
+   document.getElementById("counter").textContent = MAX_LENGTH - characterCount;
+ });
 …
```

We placed the WebChat component and the counter inside of a div container so we could place the

```diff
...
<style>
    html, body { height: 100% }
    body { margin: 0 }

    #webchat,
    #webchat > * {
-       height: 100%;
-       width: 100%;
+       display: flex;
+       flex: 1;
    }   

+    div.webchat-container {
+       height: 100%;
+       min-height: 100%;
+
+       display: flex;
+       flex-direction: column;
+    }
+
+    div.character-counter {
+       padding-right: 10px; 
+       margin-bottom: 20px;
+
+       color: #807f7f;
+       text-align: right;
+       font-family: "Calibri", "Helvetica Neue", "Arial", "sans-serif";
+    }
</style>
...

```

That's it!

## Completed code

Here is the finished `index.html`:

```diff
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <title>Web Chat: Character Limit</title>
    <!--
      For demonstration purposes, we are using the development branch of Web Chat at "/master/webchat.js".
      When you are using Web Chat for production, you should use the latest stable release at "/latest/webchat.js",
      or lock down on a specific version with the following format: "/4.1.0/webchat.js".
    -->
    <script src="https://cdn.botframework.com/botframework-webchat/latest/webchat.js"></script>
    <style>
      html, body { height: 100% }
      body { margin: 0 }

      #webchat,
      #webchat > * {
-        height: 100%;
-        width: 100%;
+        display: flex;
+        flex: 1;
      }

+      div.webchat-container {
+        height: 100%;
+        min-height: 100%;
+
+        display: flex;
+        flex-direction: column;
+      }
+
+      div.character-counter {
+        padding-right: 10px; 
+        margin-bottom: 20px;
+
+        color: #807f7f;
+        text-align: right;
+        font-family: "Calibri", "Helvetica Neue", "Arial", "sans-serif";
+      }
    </style>
  </head>
  <body>
-    <div id="webchat" role="main" class="item"></div>
+    <div class="webchat-container">
+      <div id="webchat" role="main"></div>
+      <div class="character-counter">
+        Characters Remaining: <b><span id="counter" class="counter"></span></b>
+      </div>
+    </div>

    <script>
      (async function () {
        // In this demo, we are using Direct Line token from MockBot.
        // To talk to your bot, you should use the token exchanged using your Direct Line secret.
        // You should never put the Direct Line secret in the browser or client app.
        // https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-authentication
        const res = await fetch('https://webchat-mockbot.azurewebsites.net/directline/token', { method: 'POST' });
        const { token } = await res.json();

        window.WebChat.renderWebChat({
          directLine: window.WebChat.createDirectLine({ token }),
        }, document.getElementById('webchat'));
        
+        const MAX_LENGTH = 25;
+        
+        // Initilize the character counter to MAX_LENGTH.
+        document.getElementById("counter").textContent = MAX_LENGTH;
+
+        // Set the max length attribute of the text input field in WebChat to MAX_LENGTH.
+        document.querySelector('input[aria-label="Type your message"]').maxLength = MAX_LENGTH;
+
+        // Add keyup listener to the text input field in Webchat
+        document.querySelector('input[aria-label="Type your message"]').addEventListener('keyup', (event) => {
+            const characterCount = event.target.value.length;
+            document.getElementById("counter").textContent = MAX_LENGTH - characterCount;
+        });

        document.querySelector('#webchat > *').focus();
      })().catch(err => console.error(err));
    </script>
  </body>
</html>
```