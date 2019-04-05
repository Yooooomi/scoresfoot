//const db = require('./users');
const { makeHierarchy } = require('./tools');

const wait = ms => new Promise((s, f) => setTimeout(s, ms));

const a = [];

for (let i = 0; i < 1000; i++) {
  a.push({ user: 'timothee', password: 'password', score: 1, match: 1249827, localScore: 1, guestScore: 1, local: 19827891, guest: 1982723 });
}

makeHierarchy(a, ['score', 'match', 'local', 'localScore', 'guest', 'guestScore'], 'pronos');

async function main() {
  let user = await db.registerUser('timothee', 'licorne');

  console.log(user);

  user = await db.getUser(user._id);
  console.log(user);

}

//main();
