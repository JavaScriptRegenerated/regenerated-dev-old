# Control The Flow

Generators put you in control of the flow.

In normal code, if something unexpected happens, we could throw an error:

```js
mustBeInBrowser(); // throws

const url = window.location.href;
```

Or we could check a result:

```js
if (!inBrowser()) {
    return;
}

const url = window.location.href;
```

With generator functions, we have another option.

```js
function* BrowserRouter() {
    yield browserOnly;

    const url = window.location.href;
}
```

What the difference? Here we are sending a message using `yield`. The message is “this component only works in the browser”.

This message will be received by a _message processor_, who is doing the job of iterating through the generator. It can decide to continue or stop iterating at any time.

Here’s what that processor might look like:

```js
const browserOnly = Symbol("browserOnly");

function processor(genFun) {
    for (const message of genFun()) {
        if (message === browserOnly && typeof window !== 'undefined') {
            break; // Stop processing.
        }
    }
}
```

And here’s using it with our `BrowserRouter` component:

```js
function* BrowserRouter() {
    yield browserOnly;

    // From here on will only run if we are in the browser:
    const url = window.location.href;
}

processor(BrowserRouter);
```