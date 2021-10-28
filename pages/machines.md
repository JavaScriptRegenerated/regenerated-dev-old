# Designing State Machines with YieldMachine

<template id=examples-template>
    <style>
        :host { display: block; padding: 1rem; }
        [data-result] { background: #fff3; }
    </style>
    <output><slot name=result><code data-result></code></slot></output>
    <slot name=mainElement></slot>
</template>

----

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

## Click

<machines-example machine="ClickedState">
    <button slot=mainElement type=button>Click Listener</button>
</machines-example>

## Focus

<machines-example machine="FocusState">
    <textarea slot=mainElement></textarea>
</machines-example>

## Details

<machines-example machine="DetailsListener">
    <details slot=mainElement>
        <summary>Click to toggle</summary>
        <div>Some more details</div>
    </details>
</machines-example>
