

function pointsEarned(prono) {
  // let localCote = 1 / (cote / (1 - cote));
  // let guestCote = 1 / ((1 - cote) / (1 - (1 - cote)));

  // if (cote === 1) {
  //   guestCote = 20;
  // } else if (cote === 0) {
  //   localCote = 20;
  // }

  if (prono.local === prono.match.localScore && prono.guest === prono.match.guestScore) {
    return 3;
  }
  if (Math.sign(prono.local - prono.guest) === Math.sign(prono.match.localScore - prono.match.guestScore)) {
    return 1;
  }
  return 0;
}

module.exports = {
  pointsEarned,
};