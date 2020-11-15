const nhentai = require('../lib/index');
const api = new nhentai.API();

(async () => {
    const doujin = await api.fetchDoujin(1);
    console.log(doujin);
})();
