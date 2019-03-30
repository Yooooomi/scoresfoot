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