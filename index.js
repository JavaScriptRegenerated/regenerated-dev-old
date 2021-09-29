import { renderToString as renderHTML, html, safe } from 'yieldmarkup';
import { parse, mustEnd } from 'yieldparser';
import { toCode } from 'scalemodel';
import { IconElementHandler } from './view/icons';
import { sha } from './sha';

let devSHAs = {};
if (PRODUCTION_LIKE !== '1') {
  devSHAs = require('./sha.dev').devSHAs;
}

const config = Object.freeze({
  pressGitHubURL: new URL(`https://collected.press/1/github/RoyalIcing/regenerated.dev@${sha}/`),
  pressS3URL: new URL(`https://staging.collected.press/1/s3/object/us-west-2/collected-workspaces/`),
  jsdelivrURL: new URL(`https://cdn.jsdelivr.net/gh/RoyalIcing/regenerated.dev@${sha}/`),
})

const contentTypes = {
  html: 'text/html;charset=UTF-8',
  javascript: 'text/javascript;charset=UTF-8',
  json: 'application/json;charset=UTF-8',
};

const Stylesheets = {
  highlightNightOwl: "https://cdn.jsdelivr.net/npm/highlight.js@11.2.0/styles/night-owl.css",
  // unpkgHighlightNightOwl: "https://unpkg.com/highlight.js@11.2.0/styles/night-owl.css",
  tailwindBase: "https://cdn.jsdelivr.net/npm/tailwindcss@^2/dist/base.min.css",
  tela: "https://cdn.jsdelivr.net/gh/RoyalIcing/tela@80ad30c8fa56fc6e1b7d3178d11c027a24bee5a2/tela.css",
  // "https://cdnjs.cloudflare.com/ajax/libs/modern-normalize/1.0.0/modern-normalize.min.css"
}

const ExternalScripts = {
  prismCore: {
    src: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.21.0/components/prism-core.min.js",
    integrity: "sha512-hqRrGU7ys5tkcqxx5FIZTBb7PkO2o3mU6U5+qB9b55kgMlBUT4J2wPwQfMCxeJW1fC8pBxuatxoH//z0FInhrA=="
  },
  prismAutoloader: {
    src: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.21.0/plugins/autoloader/prism-autoloader.min.js",
    integrity: "sha512-ROhjG07IRaPZsryG77+MVyx3ZT5q3sGEGENoGItwc9xgvx+dl+s3D8Ob1zPdbl/iKklMKp7uFemLJFDRw0bvig=="
  },
  highlightJS: {
    src: "https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.2.0/highlight.min.js",
  },
  highlightJSLanguageJSON: {
    src: "https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.2.0/languages/json.min.js",
  },
}

function *PrismScript() {
  return;
  yield html`<!-- Prism syntax highlighting -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.21.0/components/prism-core.min.js" integrity="sha512-hqRrGU7ys5tkcqxx5FIZTBb7PkO2o3mU6U5+qB9b55kgMlBUT4J2wPwQfMCxeJW1fC8pBxuatxoH//z0FInhrA==" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.21.0/plugins/autoloader/prism-autoloader.min.js" integrity="sha512-ROhjG07IRaPZsryG77+MVyx3ZT5q3sGEGENoGItwc9xgvx+dl+s3D8Ob1zPdbl/iKklMKp7uFemLJFDRw0bvig==" crossorigin="anonymous"></script>
  <!--<link rel="stylesheet" href="https://unpkg.com/prism-theme-night-owl@1.4.0/build/style.css">-->
  <script type=module>
  //window.Prism.highlightAll();
  </script>`;
}

async function* chunkStyledHTML(makeContentHTML) {
  yield * [
    `<!doctype html>`,
    `<html lang=en>`,
    `<meta charset=utf-8>`,
    `<meta name=viewport content="width=device-width, initial-scale=1.0">`,
    `<link rel=preload href="${Stylesheets.tailwindBase}" as=style>`,
    `<link rel=preload href="${Stylesheets.highlightNightOwl}" as=style>`,
    `<link rel=preload href="${Stylesheets.tela}" as=style>`,
    `<script defer src="https://cdn.usefathom.com/script.js" data-site="AJDDWZCI"></script>`,
    `<link href="${Stylesheets.tailwindBase}" rel="stylesheet">`,
    `<link href="${Stylesheets.highlightNightOwl}" rel="stylesheet">`,
    `<link href="${Stylesheets.tela}" rel="stylesheet">`,
    `<script defer src="${ExternalScripts.highlightJS.src}"></script>`,
    `<script defer src="${ExternalScripts.highlightJSLanguageJSON.src}"></script>`,
    `<style>
    body { max-width: 50rem; margin: auto; padding: calc(1rem + 1vh + 1vw) 1rem; }
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
  ]
  
  yield renderHTML(SharedStyleElement())

  yield *makeContentHTML()
}

function streamStyledHTML(makeContentHTML) {
  const encoder = new TextEncoder()
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  async function performWrite() {
    for await (const chunk of chunkStyledHTML(makeContentHTML)) {
      await writer.write(encoder.encode(chunk));
    }
  }

  return [readable, performWrite()];
}

async function renderStyledHTML(makeContentHTML) {
  let chunks = [];
  for await (const chunk of chunkStyledHTML(makeContentHTML)) {
    chunks.push(chunk);
  }
  return chunks.join('\n')
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
  event.respondWith(handleRequest(event.request, event));
});

// function CurrentYear() {
//   return (new Date).getFullYear();
// }

function* SharedStyles() {
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
  yield 'input[type="text"] { padding-left: 0.25rem; }';

  yield 'h1 { font-size: 2rem; line-height: 1.2; font-weight: bold; margin-bottom: 1rem; }';
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
  yield safe(Array.from(SharedStyles()).join('\n'));
  yield html`</style>`;
}

const secureHTMLHeaders = {
  'strict-transport-security': 'max-age=63072000',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  /* 'x-xss-protection': '1; mode=block', */
};

function notFoundResponse(url, html = '') {
  return new Response(`Page not found: ${url.pathname}` + html, { status: 404, headers: { ...secureHTMLHeaders, 'content-type': contentTypes.html } });
}

async function fetchContentHTML(sourceURL) {
  /* const sourceURL = new URL(path, config.pressGitHubURL); */
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

function pressGitHubURL(path) {
  return new URL(path, config.pressGitHubURL);
}

function jsdelivrURL(path) {
  return new URL(path, config.jsdelivrURL);
}

function pressS3URL(path) {
  return new URL(path, config.pressS3URL);
}

function renderModuleScript(sourceURL) {
  return `<script type=module src="${sourceURL}"></script>`
}

async function renderPage(event, requestURL, contentURL, clientURL, title) {
  console.log(contentURL.toString());
  if (requestURL.searchParams.has('stream')) {
    console.log("will stream")
    const [stream, promise] = streamStyledHTML(() => [
      renderHTML([html`<title>`, title, html`</title>`]),
      clientURL ? renderModuleScript(clientURL) : '',
      `<body>`,
      `<p>Streaming!`,
      `<main>`,
      fetchContentHTML(contentURL),
      `</main>`,
      fetchContentHTML(pressGitHubURL("pages/_footer.md")),
    ]);

    event.waitUntil(promise);
    return new Response(stream, { headers: { ...secureHTMLHeaders, 'content-type': contentTypes.html } });
  }

  return new Response(
    await renderStyledHTML(() => [
      renderHTML([html`<title>`, title, html`</title>`]),
      clientURL ? renderModuleScript(clientURL) : '',
      `<body>`,
      `<main>`,
      fetchContentHTML(contentURL),
      `</main>`,
      fetchContentHTML(pressGitHubURL("pages/_footer.md")),
    ]),
    { headers: { ...secureHTMLHeaders, 'content-type': contentTypes.html } }
  );
}

/**
 * Respond with results
 * @param {Request} request
 * @param {Event} event
 */
async function handleRequest(request, event) {
  const url = new URL(request.url);
  const { pathname } = url;
  const { success, result } = parsePath(pathname);

  console.log('Go!')
  const render = renderPage.bind(null, event, url)
  console.log(result, devSHAs)

  if (!success) {
    return notFoundResponse(url);
  } else if (result.type === 'home') {
    if (url.searchParams.has('icons')) {
      const res = await render(pressGitHubURL("pages/home.md"), undefined, 'JavaScript Regenerated');
      const rewriter = new HTMLRewriter();
      IconElementHandler.addToRewriter(rewriter);
      return rewriter.transform(res);
    } else {
      return render(pressGitHubURL("pages/home.md"), undefined, 'JavaScript Regenerated')
    }
    /* return new Response(await HomePage(), { headers: { 'content-type': contentTypes.html } }); */
    /* return new Response('<!doctype html><html lang=en><meta charset=utf-8><meta name=viewport content="width=device-width"><p>Hello!</p>', { headers: { 'content-type': contentTypes.html } }); */
  } else if (result.type === 'article') {
    if (result.slug === 'parsing') {
      return render(pressGitHubURL("pages/parsing.md"), jsdelivrURL("pages/parsing.client.js"), 'JavaScript Regenerated: Parsing')
    } else if (result.slug === 'pattern-matching') {
      return render(pressGitHubURL("pages/pattern-matching.md"), undefined, 'JavaScript Regenerated: Pattern Matching')
    } else if (result.slug === 'markup') {
      return render(pressGitHubURL("pages/markup.md"), undefined, 'JavaScript Regenerated: Rendering HTML Markup')
    } else if (result.slug === 'control-the-flow') {
      return render(pressGitHubURL("pages/control-the-flow.md"), undefined, 'JavaScript Regenerated: Control The Flow')
    } else if (result.slug === 'message-generators') {
      return render(pressGitHubURL("pages/message-generators.md"), undefined, 'JavaScript Regenerated: Message Generators')
    } else if (result.slug === 'tela') {
      return render(pressGitHubURL("pages/tela.md"), undefined, 'JavaScript Regenerated: TELA')
    } else if (result.slug === 'machines') {
      console.log(JSON.stringify(PRODUCTION_LIKE));
      if (PRODUCTION_LIKE === '1') {
        return render(pressGitHubURL("pages/machines.md"), jsdelivrURL("pages/machines.client.js"), 'JavaScript Regenerated: State Machines')
      } else {
        return render(
          pressS3URL(`text/markdown/${devSHAs['pages/machines.md']}`),
          `/article/${devSHAs['pages/machines.client.js']}.js`,
          /* undefined, */
          'JavaScript Regenerated: State Machines'
        )
        /* return fetch('https://staging.collected.press/1/s3/object/us-west-2/collected-workspaces/text/markdown/32b4f11a5fe3fd274ce2f0338d5d9af4e30c7e226f4923f510d43410119c0855') */
      }
    }
  } else if (result.type === 'articleModule') {
    if (PRODUCTION_LIKE === '1') {
      return fetch(jsdelivrURL(`pages/${result.slug}.js`))
    } else {
      const sourceURL = pressS3URL(`application/javascript/${result.slug}`);
      console.log("FETCHING", sourceURL.toString())
      return fetch(sourceURL)
      /* return fetch('https://staging.collected.press/1/s3/object/us-west-2/collected-workspaces/text/markdown/32b4f11a5fe3fd274ce2f0338d5d9af4e30c7e226f4923f510d43410119c0855') */
    }
  } else {
    return notFoundResponse(url);
  }
    /* return new Response(result.slug, { headers: { 'content-type': contentTypes.html } }); */
}
