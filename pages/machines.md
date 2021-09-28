# Designing State Machines with YieldMachine

<template id=examples-template>
    <style>:host { display: block; padding: 1rem; }</style>
    <output><slot name=result><pre data-result></pre></slot></output>
    <slot name=mainElement></slot>
</template>

## Click

<machines-example machine="ClickedState">
    <button slot=mainElement type=button>Click Listener</button>
</machines-example>

## Focus

<machines-example machine="FocusState">
    <textarea slot=mainElement></textarea>
</machines-example>

## Details

<machines-example machine="DetailsListener">
    <details slot=mainElement>
        <summary>Click to toggle</summary>
        <div>Some more details</div>
    </details>
</machines-example>
