import { html, attributes } from 'yieldmarkup';

export function* CodeBlock(language, code) {
  yield html`<pre ${attributes({ class: 'lang-' + language })}>`;
  yield html`<code ${attributes({ class: 'lang-' + language })}>`;
  yield code;
  yield html`</code>`;
  yield html`</pre>`;
}
