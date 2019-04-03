

cat << EOF
use scoresfoot
db.users.remove({})
db.pronos.remove({})
db.teams.remove({})
db.competitions.remove({})
db.steps.remove({})
db.matches.remove({})
EOF