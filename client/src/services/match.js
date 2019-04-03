export function getPointsId(team, match) {
  if (team === match.local._id) {
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

export function getSeasonStats(team, matchs, matchPopulated = false) {
  return matchs.reduce((acc, curr) => {
    const points = getPoints(team._id, curr);

    acc.points += points;
    if (points === 3) acc.wins++;
    else if (points === 1) acc.draws++;
    else acc.losses++;
    if (matchPopulated) {
      acc.goals += (team._id === curr.local._id ? curr.localScore : curr.guestScore);
      acc.t_goals += (team._id === curr.local._id ? curr.guestScore : curr.localScore);
    } else {
      acc.goals += (team._id === curr.local ? curr.localScore : curr.guestScore);
      acc.t_goals += (team._id === curr.local ? curr.guestScore : curr.localScore);
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