import { renderToString as renderHTML, attributes, html, safe } from 'yieldmarkup';
import { renderToString as renderCSS, prop, rule } from 'yieldcss';
import { parse, mustEnd } from 'yieldparser';
import { toCode } from 'scalemodel';
import * as pages from './pages';
import { CodeBlock } from './components';
import { NewsletterForm } from './convertkit';

const sha = 'bd6b0278a74a4c323777d7e3390d3be2866b6b73'
const pressURL = new URL(`https://press.collected.workers.dev/1/github/RoyalIcing/regenerated.dev@${sha}/`)
const jsdelivrURL = new URL(`https://cdn.jsdelivr.net/gh/RoyalIcing/regenerated.dev@${sha}/`)

const contentTypes = {
  html: 'text/html;charset=UTF-8',
  javascript: 'text/javascript;charset=UTF-8',
  json: 'application/json;charset=UTF-8',
};

function renderStyledHTML(...contentHTML) {
  return [
    `<!doctype html>`,
    `<html lang=en>`,
    `<meta charset=utf-8>`,
    `<meta name=viewport content="width=device-width, initial-scale=1.0">`,
    // '<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">',
    '<link href="https://unpkg.com/tailwindcss@^2/dist/base.min.css" rel="stylesheet">',
    '<link href="https://unpkg.com/highlight.js@11.2.0/styles/night-owl.css" rel="stylesheet">',
    `<style>
    body { max-width: 50rem; margin: auto; padding: 3rem 1rem; }
    a { color: #0060F2; }
    a:hover { text-decoration: underline; }
    p, ul, ol, pre, hr, blockquote, h1, h2, h3, h4, h5, h6 { margin-bottom: 1rem; }
    h1 { font-size: 2em; font-weight: 600; }
    h2 { font-size: 1.5em; font-weight: 600; }
    h3 { font-size: 1.25em; font-weight: 600; }
    h4 { font-size: 1em; font-weight: 600; }
    h5 { font-size: .875em; font-weight: 600; }
    h6 { font-size: .85em; font-weight: 600; }
    img { display: inline-block; }
    article ul { list-style: inside; }
    nav ul { display: flex; flex-wrap: wrap; }
    nav a { display: inline-block; padding: 0.5em; background: #f5f5f5; }
    nav a { border: 1px solid #e5e5e5; }
    nav li:not(:first-child) a { border-left: none; }
    nav a:hover { background: #e9e9e9; border-color: #ddd; }
    </style>`,
    ...contentHTML,
  ].join('\n')
}

function* PathParser() {
  function* Home() {
    yield '/';
    yield mustEnd;
    return { type: 'home' };
  }
  function* ArticleModule() {
    yield '/article/';
    const [, slug] = yield /^([^\/]+).js$/;
    return { type: 'articleModule', slug };
  }
  function* ArticlePage() {
    yield '/article/';
    const [, slug] = yield /^([^\/]+)$/;
    return { type: 'article', slug };
  }
  
  return yield [Home, ArticleModule, ArticlePage];
}

function parsePath(path) {
  return parse(path, PathParser());
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

function* Term(term, definition) {
  yield html`<dt>`;
  yield term;
  yield html`</dt>`;
  yield html`<dd>`;
  yield definition;
  yield html`</dd>`;
}

function* Articles() {
yield html`<article class="measure">`;
yield html`<h2>Parsing</h2>`;
yield html`<p>GitHub: <a href="https://github.com/RoyalIcing/yieldparser">yieldparser</a>`;
yield CodeBlock("javascript", `
import { parse } from "yieldparser";

function* Digit() {
  const [digit]: [string] = yield /^\d+/;
  const value = parseInt(digit, 10);
  if (value < 0 || value > 255) {
    return new Error(\`Digit must be between 0 and 255, was \${value}\`);
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
      expect.objectContaining({
        yielded: new Error('Digit must be between 0 and 255, was 256'),
      }),
    ],
  },
  remaining: '256',
}
*/
`.trim());
yield html`</article>`;
yield html`<article class="measure">`;
yield html`<h2>Pattern Matching</h2>`;
yield html`<p>GitHub: <a href="https://github.com/RoyalIcing/yieldpattern">yieldpattern</a>`;
yield CodeBlock("javascript", `
import { match, _ } from "yieldpattern";

function* FormatPoint(point) {
  switch (yield point) {
    case yield [0, 0]: return "origin";
    case yield [0, _]: return \`y = \${point[1]}\`;
    case yield [_, 0]: return \`x = \${point[0]}\`;
    default: return \`x = \${point[0]}, y = \${point[1]}\`;
  }
}

match(FormatPoint([0, 0])); // 'origin'
match(FormatPoint([0, 7])); // 'y = 7'
match(FormatPoint([12, 0])); // 'x = 12'
match(FormatPoint([5, 9])); // 'x = 5, y = 9'
`.trim());
yield html`</article>`;

yield html`<article class="measure">`;
yield html`<h2>State Machines</h2>`;
yield html`<p>GitHub: <a href="https://github.com/RoyalIcing/yieldmachine">yieldmachine</a>`;
yield CodeBlock("javascript", `
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
    // Its return value is available at \`loader.results.fetchData\`
    yield entry(fetchData);
    // If the promise succeeds, we will transition to the \`success\` state
    // If the promise fails, we will transition to the \`failure\` state
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
`.trim());
yield html`</article>`;

yield html`<article class="measure">
  <h2>Rendering HTML</h2>
  <p>GitHub: <a href="https://github.com/RoyalIcing/yieldmarkup">yieldmarkup</a>`;
yield CodeBlock("javascript", `
import { html, renderToString } from "yieldmarkup";
import { fetchData } from "./yourAPI";

function* NavLink(link) {
  yield html\`<li>\`;
  yield html\`<a href="\${link.url}">\`;
  yield link.title;
  yield html\`</a>\`;
  yield html\`<li>\`;
}

function* Nav(links) {
  yield html\`<nav aria-label="Primary">\`;
  yield html\`<ul>\`;

  for (const link of links) {
    yield NavLink(link);
  }

  yield html\`</ul>\`;
  yield html\`</nav>\`;
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
  yield html\`<!doctype html>\`
  yield html\`<html lang=en>\`
  yield html\`<meta charset=utf-8>\`
  yield html\`<meta name=viewport content="width=device-width">\`
  yield html\`<body>\`;
  yield PrimaryNav();
  yield html\`<main>\`;
  
  // Can await any promise
  const data = await fetchData();
  yield html\`<pre>\`;
  yield JSON.stringify(data);
  yield html\`</pre>\`;
  
  yield html\`</main>\`;
;}

// Resulting data waits for promises to resolve
const html = await renderToString([Page()]);`.trim())
yield html`</article>`;

yield html`<article class="measure">
  <h2>Generator Functions vs Classes</h2>
  <p><em>Coming soon</em>
</article>`;

yield html`<article class="measure">
<h2>Processing Collections</h2>
<p><em>Coming soon</em>
</article>`;

yield html`<article class="measure">
  <h2>Animation</h2>
  <p><em>Coming soon</em>
</article>`;
}

function CurrentYear() {
  return (new Date).getFullYear();
}

function* ContentInfo() {
  yield html`<footer role=contentinfo class="measure">
  <p>
    <small>
    © ${CurrentYear()} Patrick Smith
    · <a href="https://icing.space/">Blog</a>
    · <a href="https://twitter.com/concreteniche/">Twitter</a>
    · <a href="https://github.com/RoyalIcing/">GitHub</a>
    · <a href="https://github.com/RoyalIcing/regenerated.dev">View source</a>
    · <a href="https://app.usefathom.com/share/ajddwzci/regenerated.dev">View analytics</a>
    · <a href="https://components.guide">Components.Guide</a>
    </small>
</article>`;
}

function *PrismScript() {
  yield html`<!-- Prism syntax highlighting -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.21.0/components/prism-core.min.js" integrity="sha512-hqRrGU7ys5tkcqxx5FIZTBb7PkO2o3mU6U5+qB9b55kgMlBUT4J2wPwQfMCxeJW1fC8pBxuatxoH//z0FInhrA==" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.21.0/plugins/autoloader/prism-autoloader.min.js" integrity="sha512-ROhjG07IRaPZsryG77+MVyx3ZT5q3sGEGENoGItwc9xgvx+dl+s3D8Ob1zPdbl/iKklMKp7uFemLJFDRw0bvig==" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://unpkg.com/prism-theme-night-owl@1.4.0/build/style.css">
  <script type=module>
  window.Prism.highlightAll();
  </script>`;
}

const Page = {
  *HtmlEn() {
    yield html`<!doctype html>`
    yield html`<html lang=en>`
    yield html`<meta charset=utf-8>`
    yield html`<meta name=viewport content="width=device-width">`
  }
}

const Meta = {
  *Title(text) {
    yield html`<title>`;
    yield text;
    yield html`</title>`;
  },
};

function fetchCSS(url) {
  return fetch(url).then(res => res.text()).then(s => safe(s));
  //return fetch(url).then(res => res.text());
}

function* SharedStyles() {
  yield fetchCSS('https://cdnjs.cloudflare.com/ajax/libs/modern-normalize/1.0.0/modern-normalize.min.css');
  yield fetchCSS('https://cdn.jsdelivr.net/gh/RoyalIcing/tela@80ad30c8fa56fc6e1b7d3178d11c027a24bee5a2/tela.css');
  
  yield ':root { font-size: 125%; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; }';
  yield ':root { background: #1a1f30; color: white }';
  yield ':root { --measure: 44rem; --link-color: #00b4ff; }';
  yield ':root { --highlight-code-bg: #011627; }';

  yield '*, *:before, *:after { font: inherit; margin: 0; padding: 0; }';
  yield '* { --py: 0; --px: 0; padding-top: var(--py); padding-bottom: var(--py); padding-left: var(--px); padding-right: var(--px); }';

  yield 'a { color: var(--link-color); }';

  yield 'nav { margin: 1rem; }';
  yield 'header[role=banner] { margin: 2rem 1rem; }';
  yield 'article { margin: 4rem 1rem; }';

  yield 'h1, h2, h3, p, ul, ol, dl, form { --px: var(--content-px); }';
  yield String(' input[type="text"] { padding-left: 0.25rem; }');

  yield 'h1 { font-size: 2rem; font-weight: bold; margin-bottom: 1rem; }';
  yield 'h2 { font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; }';
  yield 'h3 { font-size: 1.375rem; font-weight: bold; margin-bottom: 1rem; }';
  
  yield 'p { margin: 1rem 0; }';
  yield 'pre { font-size: 0.8rem; }';

  yield 'dl { display: grid; grid-template-columns: minmax(min-content, auto) max-content; }';
  yield 'dt { font-weight: bold; }';
  yield 'dd { text-align: "." center; }';
  yield 'ul[class], ol[class] { list-style: none; }';
  
  yield 'em { font-style: italic; }';

  yield 'input, textarea { color: black; }';

  yield '.measure { max-width: var(--measure); }';
  yield '.measure { --content-px: 1rem; }';
  yield '.measure:not(.measure *) { margin-left: auto; margin-right: auto; }';

  yield '.row { display: flex; flex-wrap: wrap; }';
  yield '.-X- { text-align: center; }';
  
  yield '.formkit-form { border: none !important; margin-bottom: 2rem; }';
}

function* SharedStyleElement() {
  yield html`<style>`;
  yield renderCSS(SharedStyles());
  yield html`</style>`;
}

async function HomePage() {
  return renderHTML([
    html`${Page.HtmlEn()} ${Meta.Title(`Regenerated.Dev`)}
      <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
      <link rel="dns-prefetch" href="https://unpkg.com">
      <link rel="dns-prefetch" href="https://cdn.skypack.dev">
      ${SharedStyleElement()}
      ${PrismScript()}
      <script src="https://cdn.usefathom.com/script.js" data-site="AJDDWZCI" defer></script>
      <body>
        <nav aria-label="Primary" class="measure" hidden>
          <ul class>
            <li><a href="/">Home</a></li>
          </ul>
        </nav>
        <header role=banner class="measure -X-">
          <h1>JavaScript Regenerated</h1>
          <p><em>Rethinking JavaScript with Generator Functions.</em>
        </header>
        <main>
        ${Articles()}
        <div class="X -X-">
          ${NewsletterForm()}
        </div>
        </main>
        ${ContentInfo()}
      `,
  ]);
}

async function ArticlePage(url, { Primary, ClientModule }) {
  const clientModuleURL = `${url.pathname}.js`;

  return renderHTML([
    html`${Page.HtmlEn()} ${Meta.Title(`Regenerated.Dev`)}
      <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
      <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
      <link rel="dns-prefetch" href="https://unpkg.com">
      <link rel="dns-prefetch" href="https://cdn.skypack.dev">
      ${PrismScript()}
      ${!!ClientModule && html`<script type=module src='${clientModuleURL}'></script>`}
      <script src="https://cdn.usefathom.com/script.js" data-site="AJDDWZCI" defer></script>
      ${SharedStyleElement()}
      <body>
        <nav aria-label="Primary" class="measure" hidden>
          <ul class>
            <li><a href="/">Home</a></li>
          </ul>
        </nav>
        <header role=banner class="measure X |X-X|" data-links="current-color underline-on-hover">
          <div><a href="/">JavaScript Regenerated</a></div>
          <p><em>Rethinking JavaScript with Generator Functions.</em>
        </header>
        <main>
        ${Primary()}
        <div class="X -X-">
          ${NewsletterForm()}
        </div>
        </main>
        ${ContentInfo()}
      `,
  ]);
}

function mainJS() {
  function* Inner() {
    yield 1;
    yield 2 * 2;
    yield "hello world";
  }
  function* Example() {
    yield 1;
    yield 2 * 2;
    yield "hello world";
    yield Inner;
  }
  function Blah() {}
  
  const source = `
  ${toCode(Example)}
  // ${Example.name}
  // ${Blah.name}
  console.log(${Example.name});
  console.log(Array.from(${Example.name}()));
  `;
  
  return new Response(source, { headers: { 'content-type': contentTypes.javascript }});
}

function notFoundResponse(url, html = '') {
  return new Response(`Page not found: ${url.pathname}` + html, { status: 404, headers: { 'content-type': contentTypes.html } });
}

async function fetchContentHTML(path) {
  const sourceURL = new URL(path, pressURL);
  const res = await fetch(sourceURL, {
    cf: {
      cacheTtlByStatus: { "200-299": 86400, 404: 1, "500-599": 0 },
      cacheEverything: true,
    }
  });
  if (res.status >= 400) {
    return null
  }
  return res.text()
}

function renderModuleScript(path) {
  const sourceURL = new URL(path, jsdelivrURL);
  return `<script type=module src="${sourceURL}"></script>`
}

async function renderPage(path, clientPath) {
  return new Response(
    renderStyledHTML(
      `<script src="https://cdn.usefathom.com/script.js" data-site="AJDDWZCI" defer></script>`,
      clientPath ? renderModuleScript(clientPath) : '',
      await renderHTML(SharedStyleElement()),
      `<body>`,
      `<main>`,
      await fetchContentHTML(path),
      `</main>`,
      await fetchContentHTML("pages/_footer.md"),
    ),
    { headers: { 'content-type': contentTypes.html } }
  );
}

/**
 * Respond with results
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const { pathname } = url;
    const { success, result } = parsePath(pathname);
  
    if (!success) {
      return notFoundResponse(url);
    } else if (result.type === 'home') {
      return renderPage("pages/home.md")
      /* return new Response(await HomePage(), { headers: { 'content-type': contentTypes.html } }); */
      /* return new Response('<!doctype html><html lang=en><meta charset=utf-8><meta name=viewport content="width=device-width"><p>Hello!</p>', { headers: { 'content-type': contentTypes.html } }); */
    } else if (result.type === 'article') {
      if (result.slug === 'parsing') {
        return renderPage("pages/parsing.md", "pages/parsing.client.js")
      } else if (result.slug === 'pattern-matching') {
        return renderPage("pages/pattern-matching.md")
      }

      if (result.slug in pages) {
        return new Response(await ArticlePage(url, pages[result.slug]), { headers: { 'content-type': contentTypes.html } });
      } else {
        return notFoundResponse(url);
      }
      /* return new Response(result.slug, { headers: { 'content-type': contentTypes.html } }); */
    } else if (result.type === 'articleModule') {
      if (result.slug === 'parsing') {
        const js = `
  //import { parse, mustEnd } from "https://unpkg.com/yieldparser@0.2.0/dist/yieldparser.umd.js?module";
  //import { parse, mustEnd } from "https://cdn.skypack.dev/yieldparser";
  //import { parse, mustEnd } from "https://unpkg.com/yieldparser@0.2.0/dist/yieldparser.modern.js";
  import { parse, mustEnd } from "https://cdn.jsdelivr.net/npm/yieldparser@0.2.0/dist/yieldparser.modern.js";
  
  function* Digit() {
    const [digit] = yield /^[0-9]+/;
    const value = parseInt(digit, 10);
    if (value < 0 || value > 255) {
      return new Error(\`Digit must be between 0 and 255, was \${value}\`);
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
  
  const inputEl = document.querySelector("#parsing-ip-address-input");
  const outputEl = document.querySelector("#parsing-ip-address-output .target");
  function apply() {
    const input = inputEl.value;
    console.log({ input });
    const output = parse(input, IPAddress());
    outputEl.textContent = JSON.stringify(output, null, 2);
    window.Prism.highlightElement(outputEl);
  }
  inputEl.addEventListener('input', {
    handleEvent(event) {
      apply();
    }
  });
  apply();
  `;
  return new Response(js, { headers: { 'content-type': contentTypes.javascript } });
      }

      if (result.slug in pages && 'ClientModule' in pages[result.slug]) {
        return new Response(pages[result.slug].ClientModule(), { headers: { 'content-type': contentTypes.javascript } });
      } else {
        return notFoundResponse(url);
      }
      /* return new Response(result.slug, { headers: { 'content-type': contentTypes.html } }); */
    }
  } catch (error) {
    console.error(error.message, error.stack);
    return new Response(`Error: ${error.message} ${error.stack}`, { status: 500 });
  }
}
