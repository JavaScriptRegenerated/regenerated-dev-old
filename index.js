import { renderToString, attributes, html } from 'yieldmarkup';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

function* Term(term, definition) {
  yield '<dt>';
  yield term;
  yield '</dt>';
  yield '<dd>';
  yield definition;
  yield '</dd>';
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

function* SharedStyle() {
  yield html`<style>`;

  yield ':root { font-size: 125%; font-family: system-ui, sans-serif; }';
  yield ':root { background: #222; color: white }';
  yield ':root { --measure: 44rem; --link-color: #00b4ff; }';

  yield '*, *:before, *:after { font: inherit; margin: 0; padding: 0; }';

  yield 'a { color: var(--link-color); }';

  yield 'nav { margin: 1rem; }';
  yield 'article { margin: 1rem; }';

  yield 'h1 { font-size: 2rem; font-weight: bold; }';
  yield 'h2 { font-size: 1.5rem; font-weight: bold; }';
  yield 'h3 { font-size: 1.375rem; font-weight: bold; }';

  yield 'dl { display: grid; grid-template-columns: minmax(min-content, auto) max-content; }';
  yield 'dt { font-weight: bold; }';
  yield 'dd { text-align: "." center; }';
  yield 'ul[class], ol[class] { list-style: none; }';

  yield '.measure { max-width: var(--measure); }';
  yield '.measure:not(.measure *) { margin-left: auto; margin-right: auto; }';

  yield '.row { display: flex; flex-wrap: wrap; }';

  yield html`</style>`;
}

async function HomePage() {
  return renderToString([
    html`${Page.HtmlEn()} ${Meta.Title(`Regenerated.Dev`)} ${SharedStyle()}
      <body>
        <nav aria-label="Primary" class="measure">
          <ul class>
            <li><a href="/">Home</a></li>
          </ul>
        </nav>
        <div role="img" style="position: relative; width: 100px; height: 100px;">
          <span style="position: absolute; color: red">*</span>
          <span style="position: absolute; color: red">*</span>
          <span style="position: absolute; color: red">*</span>
        </div>
        <main>
          <h1 class="measure">
            Regenerated.Dev
          </h1>
          <article class="measure">
            <h2>Anatomy of Generator Functions</h2>
          </article>
          <article class="measure">
            <h2>Processing Collections</h2>
          </article>
          <article class="measure">
            <h2>Parsing</h2>
          </article>
          <article class="measure">
            <h2>Pattern Matching</h2>
          </article>
          <article class="measure">
            <h2>State Machines</h2>
          </article>
          <article class="measure">
            <h2>Rendering HTML</h2>
          </article>
          <article class="measure">
            <h2>Animation</h2>
          </article>
        </main>
      </body>`,
  ]);
}

/**
 * Respond with results
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    const { pathname, searchParams } = new URL(request.url);
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
