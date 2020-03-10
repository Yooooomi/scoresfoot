export function getPointsId(team, match) {
  if (team === match.local.id) {
    if (match.localScore > match.guestScore) return 3;
    if (match.localScore === match.guestScore) return 1;
    if (match.localScore < match.guestScore) return 0;
  } else {
    if (match.localScore > match.guestScore) return 0;
    if (match.localScore === match.guestScore) return 1;
    if (match.localScore < match.guestScore) return 3;
  }
}

export function getPoints(team, match) {
  if (team === match.local) {
    if (match.localScore > match.guestScore) return 3;
    if (match.localScore === match.guestScore) return 1;
    if (match.localScore < match.guestScore) return 0;
  } else {
    if (match.localScore > match.guestScore) return 0;
    if (match.localScore === match.guestScore) return 1;
    if (match.localScore < match.guestScore) return 3;
  }
}

export function getPronoPoints(prono) {
  if (prono.local_score === prono.match.local_score && prono.guest_score === prono.match.guest_score) return 3;
  if (prono.local_score - prono.guest_score < 0 && prono.match.local_score - prono.match.guest_score < 0) return 1;
  if (prono.local_score - prono.guest_score > 0 && prono.match.local_score - prono.match.guest_score > 0) return 1;
  if (prono.local_score - prono.guest_score === 0 && prono.match.local_score - prono.match.guest_score === 0) return 1;
  return 0;
}

export function getSeasonStats(team, matchs, matchPopulated = false) {
  return matchs.reduce((acc, curr) => {
    const points = getPoints(team.id, curr);

    acc.points += points;
    if (points === 3) acc.wins++;
    else if (points === 1) acc.draws++;
    else acc.losses++;
    if (matchPopulated) {
      acc.goals += (team.id === curr.local.id ? curr.localScore : curr.guestScore);
      acc.t_goals += (team.id === curr.local.id ? curr.guestScore : curr.localScore);
    } else {
      acc.goals += (team.id === curr.local ? curr.localScore : curr.guestScore);
      acc.t_goals += (team.id === curr.local ? curr.guestScore : curr.localScore);
    }
    acc.played++;
    return acc;
  }, {
    points: 0,
    played: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    goals: 0,
    t_goals: 0,
  });
}

export const ezSort = path => (a, b) => {
  if (a[path] > b[path]) return 1;
  if (a[path] < b[path]) return -1;
  return 0;
};

export const orderStats = (path, asc = 1) => (a, b) => {
  if (a[path] > b[path]) return 1 * asc;
  if (a[path] < b[path]) return -1 * asc;
  return 0;
};