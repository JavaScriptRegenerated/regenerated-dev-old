import {
  start,
  on,
  listenTo,
  entry,
  cond,
  always,
  accumulate
} from 'https://cdn.jsdelivr.net/npm/yieldmachine@0.4.8/dist/yieldmachine.mjs';

function ClickedState(button) {
  function* Initial() {
    yield on("click", Clicked);
    yield listenTo(button, "click");
  }
  function* Clicked() {}

  return Initial;
}

function FocusState(el) {
  function* CheckingStillActive() {
    yield cond(el.ownerDocument.activeElement === el, Active);
    yield always(Inactive);
  }
  function* Active() {
    yield listenTo(el.ownerDocument, "focusin");
    yield listenTo(el, "blur");
    yield on("focusin", CheckingStillActive);
    yield on("blur", CheckingStillActive);

    // yield on(listenTo(el.ownerDocument, "focusin"), CheckingStillActive);
  }
  function* Inactive() {
    yield listenTo(el, "focus");
    yield on("focus", Active);
  }

  return Inactive;
}

clickController(document.getElementById('click-example'));
focusController(document.getElementById('focus-example'));

function clickController(el) {
  const clickButton = el.querySelector('[data-action]');
  const outputEl = el.querySelector('[data-result]');
  const machine = start(ClickedState.bind(null, clickButton));

  function update() {
    outputEl.textContent = machine.current;
  }

  machine.signal.addEventListener('StateChanged', (event) => {
    update();
  });

  update();
}

function focusController(el) {
  const textbox = el.querySelector('[data-target]');
  const outputEl = el.querySelector('[data-result]');
  const machine = start(FocusState.bind(null, textbox));

  function update() {
    outputEl.textContent = machine.current;
  }

  machine.signal.addEventListener('StateChanged', (event) => {
    update();
  });

  update();
}
