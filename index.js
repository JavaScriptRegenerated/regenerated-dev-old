import { renderToString as renderHTML, attributes, html } from 'yieldmarkup';
import { renderToString as renderCSS, prop, rule } from 'yieldcss';
import { toCode } from 'scalemodel';

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

function* CodeBlock(language, code) {
  yield html`<pre ${attributes({ class: 'lang-' + language })}>`;
  yield html`<code ${attributes({ class: 'lang-' + language })}>`;
  yield code;
  yield html`</code>`;
  yield html`</pre>`;
}

function* Articles() {
yield html`<article class="measure">
  <h2>Processing Collections</h2>
  <p><em>Coming soon</em>
</article>`;

yield html`<article class="measure">`;
yield html`<h2>Parsing</h2>`;
yield html`<p>GitHub: <a href="https://github.com/RoyalIcing/parcook">parcook</a>`;
yield CodeBlock("javascript", `
import { parse } from "parcook";

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
yield html`</article>
`;
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
yield html`</article>`

yield html`<article class="measure">
  <h2>Animation</h2>
  <p><em>Coming soon</em>
</article>`;
}

function *PrismScript() {
  yield html`<!-- Prism syntax highlighting -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.21.0/components/prism-core.min.js" integrity="sha512-hqRrGU7ys5tkcqxx5FIZTBb7PkO2o3mU6U5+qB9b55kgMlBUT4J2wPwQfMCxeJW1fC8pBxuatxoH//z0FInhrA==" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.21.0/plugins/autoloader/prism-autoloader.min.js" integrity="sha512-ROhjG07IRaPZsryG77+MVyx3ZT5q3sGEGENoGItwc9xgvx+dl+s3D8Ob1zPdbl/iKklMKp7uFemLJFDRw0bvig==" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://unpkg.com/prism-theme-night-owl@1.4.0/build/style.css">
  <script>
  //document.querySelectorAll('.post.category-javascript pre code').forEach(el => el.classList.add('language-jsx'));
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
  return fetch(url).then(res => res.text());
}

function* SharedStyles() {
  yield fetchCSS('https://cdnjs.cloudflare.com/ajax/libs/modern-normalize/1.0.0/modern-normalize.min.css');
  yield fetchCSS('https://cdn.jsdelivr.net/gh/RoyalIcing/tela@3d61f6e92daaed960b19598c6c1d851420feae4e/tela.css');
  
  yield ':root { font-size: 125%; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; }';
  yield ':root { background: #222; color: white }';
  yield ':root { --measure: 44rem; --link-color: #00b4ff; }';

  yield '*, *:before, *:after { font: inherit; margin: 0; padding: 0; }';

  yield 'a { color: var(--link-color); }';

  yield 'nav { margin: 1rem; }';
  yield 'article { margin: 4rem 1rem; }';

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

  yield '.measure { max-width: var(--measure); }';
  yield '.measure:not(.measure *) { margin-left: auto; margin-right: auto; }';

  yield '.row { display: flex; flex-wrap: wrap; }';
  yield '.-X- { text-align: center; }';
}

function* SharedStyleElement() {
  yield html`<style>`;
  yield renderCSS(SharedStyles());
  yield html`</style>`;
}

async function HomePage() {
  return renderHTML([
    html`${Page.HtmlEn()} ${Meta.Title(`Regenerated.Dev`)} ${SharedStyleElement()}
      <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
      <link rel="dns-prefetch" href="https://unpkg.com">
      <script type=module src='/main.js'></script>
      <body>
        <nav aria-label="Primary" class="measure">
          <ul class>
            <li><a href="/">Home</a></li>
          </ul>
        </nav>
        <main>
          <div class="measure -X-">
            <h1>Regenerated.Dev</h1>
            <p>Rethinking JavaScript with Generator Functions.
          </div>
          ${Articles()}
        </main>
        ${PrismScript()}
      </body>`,
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
  
  return new Response(source, { headers: { 'content-type': 'text/javascript' }});
}

/**
 * Respond with results
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    
    if (pathname === '/main.js') {
      return mainJS();
    }
    
    const [, ...components] = pathname.split('/').filter(s => s.length > 0);
    let contentType = 'text/html';

    if (components.length === 0) {
      var result = await HomePage();
    } else {
      var result = 'Not found ' + JSON.stringify(components);
    }

    return new Response(result, {
      headers: {
        'content-type': contentType,
      },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
