<p align="center">
  <img width="450" src="./docs/logo.svg">
</p>

#  A library for using the [nhentai.net](https://nhentai.net) API

### Features:
- Search and fetch doujins
- Downloading pages individually or zipping the whole doujin
- TypeScript support

### Installing
```
npm install --save nhentai
```

### Usage
```js
const nhentai = require('nhentai');
const api = new nhentai.API();

api.fetchDoujin(334430).then(doujin => {
    // Keijun Yahagi wa Koi o Shita. Jou | Light Cruiser Yahagi Fell In Love - First
    doujin.titles.pretty;

    // https://i.nhentai.net/galleries/1767063/1.jpg
    doujin.pages[0].url;

    // https://t.nhentai.net/galleries/1767063/cover.jpg
    doujin.cover.url;

    // english, translated, kantai collection, teitoku, yahagi, rosapersica, [etc...]
    doujin.tags.map(tag => tag.name).join(', ');
});

```

### Upcoming features
- Proper documentation
- More scraping features
- User accounts
- Command line downloading

### Contributing
Feel free to make a PR even if it's for a typo fix, contributions are welcome.