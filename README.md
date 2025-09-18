<div align="center">
  <h1>nhentai</h1>
  <p>
    <a href="https://www.npmjs.com/package/nhentai"><img src="https://img.shields.io/npm/dt/nhentai.svg?maxAge=3600" alt="NPM downloads" /></a>
    <img src="https://img.shields.io/badge/Coverage-97.14%25-brightgreen.svg?style=flat" alt="Code Coverage"/>
    <a href="https://www.npmjs.com/package/nhentai"><img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/nhentai"></a>
    <a href="https://www.npmjs.com/package/nhentai"><img alt="npm" src="https://img.shields.io/npm/v/nhentai"></a>
  </p>
  <p>A library for interacting with the nhentai API</p>
</div>

### Installing
```shell
$ npm install nhentai
$ pnpm install nhentai
$ yarn install nhentai
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
