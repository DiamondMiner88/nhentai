<div align="center">
  <br/>
  <p>
    <img width="700" src="https://raw.githubusercontent.com/DiamondMiner88/nhentai/main/.github/logo.svg">
  </p>
  <br />
  <p>
    <a href="https://discord.gg/kkcqFZrT52"><img src="https://img.shields.io/discord/775543884503056424?color=7289da&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/nhentai"><img src="https://img.shields.io/npm/dt/nhentai.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://www.npmjs.com/package/nhentai"><img alt="npm" src="https://img.shields.io/npm/v/nhentai"></a>
    <a href="https://www.npmjs.com/package/nhentai"><img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/nhentai"></a>
  </p>
</div>

#  A library for interacting with the [nhentai](https://nhentai.net) API

- [Documentation](https://diamondminer88.github.io/nhentai/index.html)
- 100% coverage of known API
- NOT ABANDONED, JUST FEATURE COMPLETE

### Installing
```
npm install nhentai
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
