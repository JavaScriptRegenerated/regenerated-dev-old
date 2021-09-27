# Tela.css

```css
:root {
  font-size: 150%;
  font-family: system-ui;

  --text--: #111;
  color: var(--text--);

  --measure: 44rem;
  --nav-spacing: 1rem;
}
```

## Links

```css
a {
  color: var(--_color_);
  text-decoration: var(--_default_);
}
a:hover {
  text-decoration: var(--_hover_);
}
:root {
  --_color_: #4ae;
  --_default_: underline;
  --_hover_: underline;
}
nav {
  --_default_: underline;
  --_hover_: underline;
}
main {
  --_default_: none;
  --_hover_: underline;
}
```

## Flex containers

```css
.X {
  display: flex;
  flex-direction: var(--X);
  flex-wrap: var(--X-wrap);
}
.Y {
  display: flex;
  flex-direction: var(--Y);
  flex-wrap: var(--Y-wrap);
}
:root {
  --X: row;
  --X-wrap: wrap;
  --Y: column;
}
@media(min-width: 44rem) {
  :root {
    --X: column;
  }
}
nav {
  -X-wrap: wrap;
}
```