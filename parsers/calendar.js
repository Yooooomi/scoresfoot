const axios = require('axios');
const xmldom = require('xmldom').DOMParser;
const xpath = require('xpath');
const fs = require('fs');

const xmldomParser = new xmldom({
  errorHandler: {
    warning: () => { }
  },
});

class Match {
  constructor(initialDate, team1, team2) {
    this.date = new Date();
    this.setDay(initialDate);
    this.setHour('21h00');
    this.teams = [team1, team2];
    this.score = [-1, -1];
  };

  setHour(hour) {
    const parts = hour.split('h');
    this.date.setHours(+parts[0]);
    this.date.setMinutes(+parts[1]);
  }

  setDay(day) {
    const parts = day.split('/');
    this.date.setDate(+parts[0]);
    this.date.setMonth(+parts[1] - 1);
    this.date.setFullYear(+parts[2]);
  }

  setScore(team1, team2) {
    this.score = [team1, team2];
  }
}

const TooltipRegex = new RegExp(/(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s(\d{2}\/\d{2}\/\d{4}).{3}(\d{2}h\d{2})/);
const ScoreRegex = new RegExp(/\d-\d/);

async function main() {
  // const { data: web } = await axios.get('http://www.maxifoot.fr/calendrier-ligue-1-france.htm', {
  //   responseEncoding: 'latin1'
  // });
  // fs.writeFileSync('./calendar.html', web);
  const web = fs.readFileSync('./calendar.html').toString();
  const xml = xmldomParser.parseFromString(web);
  const days = xpath.select('//div[@class="cald1"]//table//table[@class="cd1"]', xml);
  const matchDays = days.map(day => {
    let [header] = xpath.select('.//tr[@class="ch3"]//td', day);
    const matchEntries = xpath.select('.//tr[@class="cl1" or @class="cl2"]', day);
    header = header.textContent.substr(4).split(',').map(e => e.trim());
    // console.log('--', header, matchEntries.length)

    const initialDate = header[1].split(' ')[1];

    const matches = matchEntries.map(entry => {
      const [team1, team2, time] = [entry.childNodes[0], entry.childNodes[1], entry.childNodes[2]];
      const newMatch = new Match(initialDate, team1.textContent, team2.textContent);

      const timeText = time.textContent;

      if (ScoreRegex.test(timeText)) { // then it's a score
        const scores = timeText.split('-')
        newMatch.setScore(+scores[0], +scores[1]);
      } else if (timeText.includes('/')) { // then it's a date
        const tooltip = time.firstChild.attributes[0].value;
        const groups = TooltipRegex.exec(tooltip);
        newMatch.setDay(groups[1]);
        newMatch.setHour(groups[2]);
      } else if (timeText.includes('h')) { // then it's an hour
        newMatch.setHour(timeText);
      }
      return newMatch;
    });
    return {
      step: header[0],
      matches,
    };
  });
  console.log(matchDays.reverse().forEach(m => console.log(m.matches)));
  sync('Ligue 1 2019-2020', matchDays);
}

async function sync(competitionName, days) {
  const api = axios.create({
    baseURL: 'http://localhost:8081',
  });
  const { data: competition } = await api.post('/competition/new', {
    name: competitionName,
    start: '1',
  });
  const teamCreations = days[0].matches.map(async match => {
    await api.post('/teams/new', {
      name: match.teams[0],
    });
    await api.post('/teams/new', {
      name: match.teams[1],
    });
  });
  await Promise.all(teamCreations);
  console.log('Created competition', competition);
  const promises = days.map(async day => {
    const { data: step } = await api.post('/competition/newstep', {
      competitionId: competition.id,
      name: day.step,
    });
    const matchPromises = day.matches.map(async match => {
      await api.post('/match/new_by_names', {
        stepName: step.name,
        local: match.teams[0],
        guest: match.teams[1],
        local_score: match.score[0],
        guest_score: match.score[1],
        date: match.date,
      });
    });
    await Promise.all(matchPromises);
  });
  await Promise.all(promises);
}

main();
