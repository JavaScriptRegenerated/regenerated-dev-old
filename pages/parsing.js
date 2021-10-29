import { html } from 'yieldmarkup';
import { CodeBlock } from '../components';

export function* Intro() {
  yield html`<article class="measure">`;
  yield html`<h2>Parsing</h2>`;
  yield html`<p>GitHub: <a href="https://github.com/JavaScriptRegenerated/yieldparser">yieldparser</a>`;
  yield CodeBlock("javascript", `
import { parse, mustEnd } from "yieldparser";

function* Digit() {
  const [digit] = yield /^\d+/;
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
}

export function* Primary() {
  yield html`<article class="measure">`;
  yield html`<h1>Parsing with Generator Functions</h1>`;
  yield html`<p>Library used: <a href="https://github.com/JavaScriptRegenerated/yieldparser">yieldparser</a>`;

  yield html`<h2>IP Address</h2>`;

  yield html`<form class="Y">`;
  yield html`<label for=parsing-ip-address-input>Enter text to parse:</label> <input id=parsing-ip-address-input type=text value="1.2.3.4">`;
  yield html`<output id=parsing-ip-address-output class="X" style="background: var(--highlight-code-bg)"><pre><code class="target language-json"></code></pre></output>`;
  yield html`</form>`;

  yield CodeBlock("javascript", `
import { parse } from "yieldparser";

function* Digit() {
  const [digit] = yield /^\d+/;
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
      {
        yielded: new Error('Digit must be between 0 and 255, was 256'),
      },
    ],
  },
  remaining: '256',
}
*/
`.trim());

  yield html`</article>`;
}

export function ClientModule() {
  return `
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
}
