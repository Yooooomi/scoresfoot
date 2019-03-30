import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import api from '../../services/api';
import { Grid, Paper } from '@material-ui/core';
import { getPointsId } from '../../services/match';
import Matches from './Matches';

class Team extends React.Component {

  state = {
    team: null,
  };

  listener = null;

  refresh = async () => {
    const teamId = this.props.match.params.id;

    const team = await api.get(`/teams/${teamId}`);
    this.setState({ team: team.data }, () => this.forceUpdate());
  }

  onLocationChange = (location, a, b) => {
    setTimeout(this.refresh, 0);
  }

  async componentDidMount() {
    this.listener = this.props.history.listen(this.onLocationChange);
    this.refresh();
  }

  componentWillUnmount() {
    if (this.listener) this.listener();
  }

  render() {
    const { classes } = this.props;
    const { team } = this.state;

    if (!team) return null;

    const playedMatches = team.history.filter(m => m.localScore !== -1);

    console.log(playedMatches.length);
    const stats = playedMatches.reduce((acc, curr) => {
      const points = getPointsId(team._id, curr);

      acc.points += points;
      if (points === 3) acc.wins++;
      else if (points === 1) acc.draws++;
      else acc.losses++;
      acc.goals += (team._id === curr.local._id ? curr.localScore : curr.guestScore);
      acc.t_goals += (team._id === curr.local._id ? curr.guestScore : curr.localScore);
      return acc;
    }, {
      points: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      goals: 0,
      t_goals: 0,
    });

    const matchs = playedMatches.reverse().map(e => (
      <Matches match={e} key={e._id} winningTeam={team._id} className={classes.matches} />
    ));

    return (
      <div className={classes.root}>
        <Paper className={classes.descPaper}>
          <Grid container alignItems={'center'} spacing={24}>
            <Grid item xs={2}>
              <img src={'/default_team.png'} className={classes.logo} alt={'team'} />
              <span className={classes.name}>{team.name}</span>
            </Grid>
            <Grid item xs={3} className={classes.statsContainer}>
              <span className={classes.stat}>Points:</span>
              <span className={classes.stat}>Victoires:</span>
              <span className={classes.stat}>Defaites:</span>
              <span className={classes.stat}>Ratio Victoires:</span>
            </Grid>
            <Grid item xs={1} className={classes.statsContainer}>
              <span className={classes.stat}>{stats.points}</span>
              <span className={classes.stat}>{stats.wins}</span>
              <span className={classes.stat}>{stats.losses}</span>
              <span className={classes.stat}>{Math.round(stats.wins / playedMatches.length * 100)}%</span>
            </Grid>
            <Grid item xs={3} className={classes.statsContainer}>
              <span className={classes.stat}>Buts:</span>
              <span className={classes.stat}>Buts concédés:</span>
              <span className={classes.stat}>Ratio buts/match:</span>
              <span className={classes.stat}>Ratio buts concédés/match:</span>
            </Grid>
            <Grid item xs={1} className={classes.statsContainer}>
              <span className={classes.stat}>{stats.goals}</span>
              <span className={classes.stat}>{stats.t_goals}</span>
              <span className={classes.stat}>{Math.round(stats.goals / playedMatches.length * 100) / 100}</span>
              <span className={classes.stat}>{Math.round(stats.t_goals / playedMatches.length * 100) / 100}</span>
            </Grid>
          </Grid>
        </Paper>
        <div className={classes.divider}></div>
        {
          matchs
        }
      </div>
    );
  }
}

export default withStyles(style)(Team);
