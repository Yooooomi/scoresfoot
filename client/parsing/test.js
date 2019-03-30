const axios = require('axios');
const parser = require('node-html-parser');

const fs = require('fs');

async function main() {
  const page = (await axios.get('http://www.maxifoot.fr/calendrier-ligue1.htm')).data;
  const parsed = parser.parse(page);
  const days = [];

  fs.writeFileSync('./page.html', page);

  let cald = true;
  for (let i = 1; true; i++) {
    cald = parsed.querySelector(`#tj${i}`);
    if (cald === null) break;
    console.log(i);
    const datas = cald.parentNode.childNodes.filter(e => e.tagName && e.childNodes.length === 3);
    days.push(datas.map(e => {
      const hasScore = Boolean(e.childNodes[2].childNodes[0].childNodes.length);
      let localScore = -1, guestScore = -1;
      if (hasScore) {
        const scores = e.childNodes[2].childNodes[0].childNodes[0].rawText.split('-');
        localScore = +scores[0];
        guestScore = +scores[1];
      }
      return ({
        local: e.childNodes[0].childNodes[0].childNodes[0].rawText,
        guest: e.childNodes[1].childNodes[0].childNodes[0].rawText,
        localScore,
        guestScore,
      });
    })
    );
  }
  const teams = days[0].map(e => e.local);
  teams.push(...days[0].map(e => e.guest));
  console.log(teams);
  for (let team of teams) {
    await axios.post('http://localhost:8081/teams/new', {
      name: team,
    });
  }
  const date = new Date(2018, 7, 11, 21, 0, 0, 0);
  let daynb = 1;
  const compet = (await axios.post('http://localhost:8081/competition/new', {
    name: 'Ligue 1',
    start: date.toLocaleDateString(),
  })).data;
  console.log('Created compet');
  for (let day of days) {
    const step = (await axios.post('http://localhost:8081/competition/newstep', {
      name: `Journee ${daynb}`,
      competitionId: compet._id,
    })).data;
    console.log('Created step', 'Journee', daynb);
    daynb++;
    for (let match of day) {
      console.log(match, step);
      await axios.post('http://localhost:8081/match/new_by_names', {
        local: match.local,
        guest: match.guest,
        localScore: isNaN(match.localScore) ? -1 : match.localScore,
        guestScore: isNaN(match.guestScore) ? -1 : match.guestScore,
        date: date.toISOString(),
        stepName: step.name,
      });
      console.log('Created match', match.local, ' - ', match.guest);
    }
    date.setDate(date.getDate() + 7);
  }
  // days.reverse().forEach((e, k) => {
  //   console.log(`--- ${38 - k} Journée ---`);
  //   console.log(e);
  //   console.log();
  // });
}

main();