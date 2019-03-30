

cat << EOF
use scoresfoot
db.teams.remove({})
db.competitions.remove({})
db.steps.remove({})
db.matches.remove({})
EOF