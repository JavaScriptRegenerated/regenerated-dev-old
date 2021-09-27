# Parsing with Generator Functions

Library used: [yieldparser](https://github.com/RoyalIcing/yieldparser)

## IP Address

<form class="Y">
<label for=parsing-ip-address-input>Enter text to parse:</label> <input id=parsing-ip-address-input type=text value="1.2.3.4">
<output id=parsing-ip-address-output><pre><code class="target language-json"></code></pre></output>
</form>

```js
import { parse } from 'yieldparser';

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

## Router: value approach

```js
import { parse, mustEnd } from 'yieldparser';

function* Home() {
  yield '/';
  yield mustEnd;
  return { type: 'home' };
}

function* Blog() {
  yield '/blog';
  yield mustEnd;
  return { type: 'blog' };
}

function* BlogPost() {
  yield '/blog/';
  const postID = yield /[-_\w]+/;
  yield mustEnd;
  return { type: 'blogPost', postID };
}
```

## Router: loader approach

```js
import { listPosts, findPost } from './blog';

function* Home() {
  yield '/';
  yield mustEnd;

  return {};
}

function* Blog() {
  yield '/blog';
  yield mustEnd;

  function fetchData() {
    return listPosts();
  }
  return { fetchData };
}

function* BlogPost() {
  yield '/blog/';
  const postID = yield /[-_\w]+/;
  yield mustEnd;

  function fetchData() {
    return findPost(postID);
  }
  return { fetchData };
}
```
