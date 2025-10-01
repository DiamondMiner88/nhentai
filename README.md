<div align="center">
  <h1>nhentai</h1>
  <p>
    <a href="https://www.npmjs.com/package/nhentai"><img src="https://img.shields.io/npm/dt/nhentai.svg?maxAge=3600" alt="NPM downloads" /></a>
    <img src="https://img.shields.io/badge/Coverage-90.43%25-brightgreen.svg?style=flat" alt="Code Coverage"/>
    <a href="https://www.npmjs.com/package/nhentai"><img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/nhentai"></a>
    <a href="https://www.npmjs.com/package/nhentai"><img alt="npm" src="https://img.shields.io/npm/v/nhentai"></a>
  </p>
  <p>A library for interacting with the nhentai API</p>
</div>

### Installing
```shell
$ npm install nhentai --no-optional
$ pnpm install nhentai --no-optional
$ yarn install nhentai --no-optional
```

### Usage
```js
// CommonJS
const nhentai = require('nhentai');
// ES6/Typescript
import * as nhentai from "nhentai";

const api = new nhentai.API();

api.fetchDoujin(334430).then(doujin => {
    // Keijun Yahagi wa Koi o Shita. Jou | Light Cruiser Yahagi Fell In Love - First
    doujin.titles.pretty;

    // https://i.nhentai.net/galleries/1767063/1.jpg
    doujin.pages[0].url;

    // https://t.nhentai.net/galleries/1767063/cover.jpg
    doujin.cover.url;

    // english, translated, kantai collection, teitoku, yahagi, rosapersica, [etc...]
    doujin.tags.all.map(tag => tag.name).join(', ');
});
```

If you encounter frequent Cloudflare challenges (especially on search requests), you will likely need
to set up a [Flaresolverr](https://github.com/FlareSolverr/FlareSolverr)-compatible API proxy in order to proxy
this library's requests through it to the nhentai API.

```typescript
const api = new nhentai.API({
    flaresolverrUrl: "http://localhost:8081/v1", // URL to selfhosted FlareSolverr API
});
```

This feature also requires the npm package `htmlparser2` as an optional dependency of this library.
