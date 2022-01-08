# Designing State Machines with YieldMachine

<template id=examples-template>
    <style>
        :host { display: block; padding: 1rem; }
        [data-result] { padding: 0.25em 0.5em; background: #fff3; border-radius: 4px; }
    </style>
    <output><slot name=result><code data-result>loading…</code></slot></output>
    <slot name=mainElement></slot>
</template>

Library used: [yieldmachine](https://github.com/JavaScriptRegenerated/yieldmachine)

## Click

<machines-example machine="ClickedState">
    <button slot=mainElement type=button>Click Listener</button>
</machines-example>

```js
function ClickedState(button) {
  function* Initial() {
    yield on('click', Clicked);
    yield listenTo(button, 'click');
  }
  function* Clicked() {}

  return Initial;
}
```

----

## Focus

<machines-example machine="FocusState">
    <textarea slot=mainElement></textarea>
</machines-example>

```js
function FocusState(el) {
  function* CheckingStillActive() {
    yield cond(el.ownerDocument.activeElement === el, Active);
    yield always(Inactive);
  }
  function* Active() {
    yield listenTo(el.ownerDocument, 'focusin');
    yield listenTo(el, 'blur');
    yield on('focusin', CheckingStillActive);
    yield on('blur', CheckingStillActive);
  }
  function* Inactive() {
    yield listenTo(el, 'focus');
    yield on('focus', Active);
  }

  return CheckingStillActive;
}
```

----

## Details

<machines-example machine="DetailsListener">
    <details slot=mainElement>
        <summary>Click to toggle</summary>
        <div>Some more details</div>
    </details>
</machines-example>

```js
function* DetailsListener(el) {
  yield listenTo(el, ['toggle']);
  yield on('toggle', compound(CheckingOpen));

  function* Closed() {}
  function* Open() {}
  function* CheckingOpen() {
    yield cond(el.open, Open);
    yield always(Closed);
  }

  return CheckingOpen;
}
```

----

## Document Visibility

<machines-example machine="DocumentVisibilityListener">
    <div slot=mainElement></div>
</machines-example>

```js
function* DocumentVisibilityListener() {
  yield listenTo(document, ['visibilitychange']);
  yield on('visibilitychange', compound(Checking));

  function* Visible() {}
  function* Hidden() {}
  function* Checking() {
    yield cond(document.visibilityState === 'visible', Visible);
    yield always(Hidden);
  }

  return Checking;
}
```

----

## Fetch

```js
import { entry, on, start } from "yieldmachine";

const exampleURL = new URL("https://example.org/");
function fetchData() {
  return fetch(exampleURL);
}

// Define a machine just using functions
function Loader() {
  // Each state is a generator function
  function* idle() {
    yield on("FETCH", loading);
  }
  // This is the ‘loading’ state
  function* loading() {
    // This function will be called when this state is entered.
    // Its return value is available at `loader.results.fetchData`
    yield entry(fetchData);
    // If the promise succeeds, we will transition to the `success` state
    // If the promise fails, we will transition to the `failure` state
    yield on("SUCCESS", success);
    yield on("FAILURE", failure);
  }
  // States that don’t yield anything are final
  function* success() {}
  // Or they can define transitions to other states
  function* failure() {
    // When the RETRY event happens, we transition from ‘failure’ to ‘loading’
    yield on("RETRY", loading);
  }

  // Return the initial state from your machine definition
  return idle;
}

const loader = start(Loader);
loader.current; // "idle"

loader.next("FETCH");
loader.current; // "loading"

loader.results.then((results) => {
  console.log("Fetched", results.fetchData); // Use response of fetch()
  loader.current; // "success"
});
```