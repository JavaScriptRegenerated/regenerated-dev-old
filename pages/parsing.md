# Parsing with Generator Functions

Library used: [yieldparser](https://github.com/RoyalIcing/yieldparser)

## IP Address

<form class="Y">
<label for=parsing-ip-address-input>Enter text to parse:</label> <input id=parsing-ip-address-input type=text value="1.2.3.4">
<output id=parsing-ip-address-output class="X" style="background: var(--highlight-code-bg)"><pre><code class="target language-json"></code></pre></output>
</form>

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

## Router

```js
// Coming soon
```
