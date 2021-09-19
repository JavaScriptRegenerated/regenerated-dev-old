# JavaScript Regenerated

_Rethinking JavaScript with Generator Functions._

## Parsing

[Read more](/article/parsing)

GitHub: [yieldparser](https://github.com/RoyalIcing/yieldparser)

```js
import { parse } from "yieldparser";

function* Digit() {
  const [digit] = yield /^\d+/;
  const value = parseInt(digit, 10);
  if (value < 0 || value > 255) {
    return new Error(`Digit must be between 0 and 255, was ${value}`);
  }
  return value;
}

function* IPAddress() {
  const first = yield Digit;
  yield '.';
  const second = yield Digit;
  yield '.';
  const third = yield Digit;
  yield '.';
  const fourth = yield Digit;
  yield mustEnd;
  return [first, second, third, fourth];
}

parse('1.2.3.4', IPAddress());
/*
{
  success: true,
  result: [1, 2, 3, 4],
  remaining: '',
}
*/

parse('1.2.3.256', IPAddress());
/*
{
  success: false,
  failedOn: {
    nested: [
      {
        yielded: new Error('Digit must be between 0 and 255, was 256'),
      },
    ],
  },
  remaining: '256',
}
*/
```

## Pattern Matching

[Read more](/article/pattern-matching)

GitHub: [yieldpattern](https://github.com/RoyalIcing/yieldpattern)

```js
import { match, _ } from "yieldpattern";

function* FormatPoint(point) {
  switch (yield point) {
    case yield [0, 0]: return "origin";
    case yield [0, _]: return `y = ${point[1]}`;
    case yield [_, 0]: return `x = ${point[0]}`;
    default: return `x = ${point[0]}, y = ${point[1]}`;
  }
}

match(FormatPoint([0, 0])); // 'origin'
match(FormatPoint([0, 7])); // 'y = 7'
match(FormatPoint([12, 0])); // 'x = 12'
match(FormatPoint([5, 9])); // 'x = 5, y = 9'
```

## State Machines

GitHub: [yieldmachine](https://github.com/RoyalIcing/yieldmachine)

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

## Rendering HTML

GitHub: [yieldmarkup](https://github.com/RoyalIcing/yieldmarkup)

```js
import { html, renderToString } from "yieldmarkup";
import { fetchData } from "./yourAPI";

function* NavLink(link) {
  yield html`<li>`;
  yield html`<a href="${link.url}">`;
  yield link.title;
  yield html`</a>`;
  yield html`<li>`;
}

function* Nav(links) {
  yield html`<nav aria-label="Primary">`;
  yield html`<ul>`;

  for (const link of links) {
    yield NavLink(link);
  }

  yield html`</ul>`;
  yield html`</nav>`;
}

function* PrimaryNav() {
  yield Nav([
    { url: '/', title: 'Home' },
    { url: '/pricing', title: 'Pricing' },
    { url: '/features', title: 'Features' },
    { url: '/terms', title: 'Terms & Conditions' },
  ]);
}

function* Page() {
  yield html`<!doctype html>`
  yield html`<html lang=en>`
  yield html`<meta charset=utf-8>`
  yield html`<meta name=viewport content="width=device-width">`
  yield html`<body>`;
  yield PrimaryNav();
  yield html`<main>`;
  
  // Can await any promise
  const data = await fetchData();
  yield html`<pre>`;
  yield JSON.stringify(data);
  yield html`</pre>`;
  
  yield html`</main>`;
;}

// Resulting data waits for promises to resolve
const html = await renderToString([Page()]);
```

## Processing Collections

GitHub: [itsybitsy](https://github.com/RoyalIcing/itsybitsy)

_Coming soon_

## Animation

_Coming soon_

## Generator Functions vs Classes

_Coming soon_
