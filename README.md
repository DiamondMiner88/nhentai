<p align="center">
  <img width="300" src="./docs/logo.svg">
</p>

# A simple API wrapper for [nhentai.net](https://nhentai.net)

### Features:
- Clean classes of each data type
- Typescript declaration file with documentation

### Installing
```
npm i --save nhentai
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
- Doujin downloading
- User accounts

### Contributing
Feel free to make a PR on the repo even if it's for a typo, contributions are welcome.