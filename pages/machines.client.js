import {
  start,
  on,
  compound,
  listenTo,
  entry,
  cond,
  always,
  accumulate,
} from 'https://cdn.jsdelivr.net/npm/yieldmachine@0.4.10/dist/yieldmachine.mjs';

function ClickedState(button) {
  function* Initial() {
    yield on('click', Clicked);
    yield listenTo(button, 'click');
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
    yield listenTo(el.ownerDocument, 'focusin');
    yield listenTo(el, 'blur');
    yield on('focusin', CheckingStillActive);
    yield on('blur', CheckingStillActive);

    // yield on(listenTo(el.ownerDocument, "focusin"), CheckingStillActive);
  }
  function* Inactive() {
    yield listenTo(el, 'focus');
    yield on('focus', Active);
  }

  return CheckingStillActive;
}

function* DetailsListener(el) {
  yield listenTo(el, ['toggle']);
  yield on('toggle', compound(CheckingOpen));

  function* Closed() {}
  function* Open() {}
  function* CheckingOpen() {
    yield cond(el.open, Open);
    yield always(Closed);
  }

  return CheckingOpen;
}

function* DocumentVisibilityListener() {
  yield listenTo(document, ['visibilitychange']);
  yield on('visibilitychange', compound(Checking));

  function* Visible() {}
  function* Hidden() {}
  function* Checking() {
    yield cond(document.visibilityState === 'visible', Visible);
    yield always(Hidden);
  }

  return Checking;
}

const machineRegistry = new Map();
machineRegistry.set('ClickedState', ClickedState);
machineRegistry.set('FocusState', FocusState);
machineRegistry.set('DetailsListener', DetailsListener);
machineRegistry.set('DocumentVisibilityListener', DocumentVisibilityListener);

class MachinesExample extends HTMLElement {
  constructor() {
    super();

    const templateEl = document.getElementById('examples-template');
    const template = templateEl.content;
    const clone = template.cloneNode(true);
    // const clone = this.ownerDocument.importNode(template, true);
    // const clone = this.ownerDocument.createRange().createContextualFragment(templateEl.innerHTML);
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(clone);
    const [mainElement] = shadowRoot.querySelector('slot[name=mainElement]').assignedElements();
    const [outputEl] = shadowRoot.querySelector('slot[name=result]').assignedElements({ flatten: true });
    
    const machineName = this.getAttribute('machine');
    const machineDefinition = machineRegistry.get(machineName);
    if (!machineDefinition) {
      console.error("No machine defined with name", machineName);
    }
    const machine = start(machineDefinition.bind(null, mainElement));
    
    machine.signal.addEventListener('StateChanged', this);
    
    Object.assign(this, { machine, outputEl });
    Object.preventExtensions(this);
  }
  
  connectedCallback() {
    this.update();
  }

  disconnectedCallback() {
    this.machine.abort();
  }

  handleEvent(event) {
    this.update();
  }

  update() {
    this.outputEl.textContent = this.machine.current;
  }
}
customElements.define('machines-example', MachinesExample);
