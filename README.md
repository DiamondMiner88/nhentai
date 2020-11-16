<p align="center">
  <img width="450" src="./docs/logo.svg">
</p>

# A simple API wrapper for [nhentai.net](https://nhentai.net)

### Features:
- Clean classes of each data type
- Typescript declaration file with documentation
- Downloading zip bundles of doujins

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

    // Downloads page 1 to C:/temp/1.[extension]
    doujin.pages[0].download('C:/temp', '1');

    // Downloads zip-bundled doujin to C:/temp/334430.zip
    doujin.downloadZipped('C:/temp/334430.zip');
});
```

### Upcoming features
- Proper documentation
- nhentai torrent downloads
- User accounts

### Contributing
Feel free to make a PR on the repo even if it's for a typo, contributions are welcome.