# Rendering HTML

GitHub: [yieldmarkup](https://github.com/JavaScriptRegenerated/yieldmarkup)

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