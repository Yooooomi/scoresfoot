const axios = require('axios');
const fs = require('fs');

async function main() {
  if (!fs.existsSync('./logos')) {
    fs.mkdirSync('./logos');
  }
  for (let i = 0; i < 818; i++) {
    console.log('Downloading logo', i);
    const { data } = await axios({
      method: 'get',
      url: `https://medias.lequipe.fr/logo-football/${i}/15000`,
      responseType: 'stream'
    })
    data.pipe(fs.createWriteStream(`./logos/${i}.png`))
  }
}

main();