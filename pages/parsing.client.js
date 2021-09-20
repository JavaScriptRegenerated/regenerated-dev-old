//import { parse, mustEnd } from "https://unpkg.com/yieldparser@0.2.0/dist/yieldparser.umd.js?module";
//import { parse, mustEnd } from "https://cdn.skypack.dev/yieldparser";
//import { parse, mustEnd } from "https://unpkg.com/yieldparser@0.2.0/dist/yieldparser.modern.js";
import {
  parse,
  mustEnd,
} from 'https://cdn.jsdelivr.net/npm/yieldparser@0.2.0/dist/yieldparser.modern.js';

function* Digit() {
  const [digit] = yield /^[0-9]+/;
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

const inputEl = document.querySelector('#parsing-ip-address-input');
const outputEl = document.querySelector('#parsing-ip-address-output .target');
function apply() {
  const input = inputEl.value;
  console.log({ input });
  const output = parse(input, IPAddress());
  outputEl.textContent = JSON.stringify(output, null, 2);
//   window.Prism.highlightElement(outputEl);
}
inputEl.addEventListener('input', {
  handleEvent(event) {
    apply();
  },
});
apply();
