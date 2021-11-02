# Rich keys

## Value Symbols

I have some information, say a timestamp:

```js
const t = Date.now();
// 1635817108916
```

It would be useful to be able to use this as a key. Here is one approach.

```js
const object = { type: 'instant', time: Date.now() };
const symbol = Symbol(JSON.stringify(object));
const symbolValue = Object.freeze(Object.assign(Object(symbol), object));
```

I can now use this symbol object as an object key:

```js
const cache = {
  [symbolValue]: {
    '/user': { name: "Jane Jones" }
  }
};
// {
//  [Symbol({"type":"instant","time":1635817108916})]: { '/user': { name: 'Jane Jones' } }
// }
```

I can read information from it:

```js
symbolValue.type
// "instant"

symbolValue.time
// 1635817108916
```

It’s incredibly flexible yet self contained.

The JSON version of the object is its canonical string form.

```js
function jsonSymbol(object) {
  Object.freeze(object);
  const symbol = Symbol.for(JSON.stringify(object));
  return Object.freeze(Object.defineProperties(Object(symbol), Object.getOwnPropertyDescriptors(object)));
}

function serialize(symbol) {
  return symbol.description;
}

function toObject(symbol) {
  return JSON.parse(symbol.description);
}

function urlSymbol(url) {
  const symbol = Symbol.for(url.href);
  return Object.freeze(Object.assign(Object(symbol), { href: url.href, host: url.host, pathname: url.pathname, search: url.search, hash: url.hash }));
}
```

```js
const now = jsonSymbol({ type: 'instant', time: Date.now() });
now.time
// 1635817108916

const keyPath = jsonSymbol(['user', 123456]);
keyPath[1]
// 123456

const apiSymbol = urlSymbol(new URL("https://myapi.com/user"));
// '/user'
```

----

## URLs

I have a URL to a resource, say to an API:

```js
const apiURL = new URL("https://myapi.com")
const getUser = new URL("/user", apiURL);
// URL { href: 'https://myapi.com/user', … }
```

It would be useful to be able to use this as a key, and I can:

```js
const cache = {
  [getUser]: { name: "Jane Jones" }
};
// {
//  'https://myapi.com/user': { name: 'Jane Jones' }
// }
```

```js
cache[getUser]
// { name: 'Jane Jones' }
```

The URL’s href is its canonical string form.

----

## Canonical form

It would be useful to be able to get the canonical form of these values. This way we have a key that we can cache with.

```js
function serialize(object) {
  if (typeof object === 'symbol') {
    return object.description;
  } else if (object instanceof URL) {
    return URL.toString();
  } else {
    throw new Error("Unsupported object");
  }
}

function deserialize(string) {
  if (string.startsWith("https:")) {
    return new URL(string);
  } else {
    return Symbol.for(JSON.parse(string));
  }
}
```
