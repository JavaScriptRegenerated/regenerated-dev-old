# Routing with Generator Functions

Library used: [yieldparser](https://github.com/RoyalIcing/yieldparser)

## Approach A: Components return values

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

function* Route() {
  return yield [Home, Blog, BlogPost];
}

function handleRequest(request) {
  const url = new URL(request.url);
  const route = parse(url.pathname, Route());
  if (!route.success) {
    return new Response(`Not found: ${url.pathname}`, { status: 404 });
  }

  if (route.value.type === 'home') {
    return renderHomePage();
  } else if (route.value.type === 'blog') {
    return renderBlogList();
  } else if (route.value.type === 'blogPost') {
    return renderBlogPost(route.value.postID);
  }
}
```

## Approach B: Components return fetch functions

```js
import { getHomeContent } from './home';
import { listPosts, findPost } from './blog';
import { renderHTMLPage, renderHTMLList } from './html';

function* Home() {
  yield '/';
  yield mustEnd;

  return () => renderHTMLPage('Home', getHomeContent());
}

function* Blog() {
  yield '/blog';
  yield mustEnd;

  return async () => {
    const posts = await listPosts();
    return renderHTMLPage('Blog', renderHTMLList(posts));
  };
}

function* BlogPost() {
  yield '/blog/';
  const postID = yield /[-_\w]+/;
  yield mustEnd;

  return async () => {
    const post = await findPost(postID);
    return renderHTMLPage(post.title, post.contentHTML);
  };
}

function* Route() {
  return yield [Home, Blog, BlogPost];
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const route = parse(url.pathname, Route());
  if (!route.success) {
    return new Response(`Not found: ${url.pathname}`, { status: 404 });
  }

  const html = await route.value;
  return new Response(html, {
    status: 200,
    headers: new Headers({ 'content-type': 'text/html;charset=UTF-8' })
  });
}
```
