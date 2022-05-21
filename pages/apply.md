# Apply

```js
function* Numbers() {
  yield 1;
  yield 2;
  yield 3;
}

apply(Numbers, []); // [1, 2, 3]

function* Concat(head, tail) {
  yield* head;
  yield* tail;
}

apply(Concat, [[1, 2], [3, 4]]); // [1, 2, 3, 4]
```

```js
function apply(f, a) {
  return Array.from(f.apply(null, a));
}
```
