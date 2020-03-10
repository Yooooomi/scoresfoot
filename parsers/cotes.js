const axios = require('axios');
const xmldom = require('xmldom').DOMParser;
const xpath = require('xpath');
const fs = require('fs');

// const { data: web } = await axios.get('https://www.betclic.fr/football/ligue-1-conforama-e4');
// fs.writeFileSync('./page.html', web);

async function main() {
  const web = fs.readFileSync('./page.html').toString();
  const xml = new xmldom().parseFromString(web);
  // const nodes = xpath.select('//div[@id="event-wrapper"]/div[contains(@class, "day-entry")]/div[class="schedule clearfix"]', xml);
  const nodes = xpath.select('//div[@id="event-wrapper"]//div[contains(@class, "match-entry")]', xml);
  console.log(nodes.length);
  nodes.forEach(node => {
    const [match] = xpath.select('div[@class="match-name"]', node);
    const [one, tie, two] = xpath.select('div[@class="match-odds"]/div[@class="match-odd"]/span', node);
    console.log(match.textContent.trim(), one.textContent, tie.textContent, two.textContent);
  });
}

main();
