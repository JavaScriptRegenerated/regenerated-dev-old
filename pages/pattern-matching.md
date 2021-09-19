# Pattern Matching

Library used: [yieldpattern](https://github.com/RoyalIcing/yieldpattern)

```js
import { match, _ } from "yieldpattern";

function* FormatPoint(point) {
  switch (yield point) {
    case yield [0, 0]: return "origin";
    case yield [0, _]: return `y = ${point[1]}`;
    case yield [_, 0]: return `x = ${point[0]}`;
    default: return `x = ${point[0]}, y = ${point[1]}`;
  }
}

match(FormatPoint([0, 0])); // 'origin'
match(FormatPoint([0, 7])); // 'y = 7'
match(FormatPoint([12, 0])); // 'x = 12'
match(FormatPoint([5, 9])); // 'x = 5, y = 9'
```
