import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { Paper, Grid } from '@material-ui/core';
import InlineTeam from '../../../../../components/InlineTeam';
import cl from 'classnames';
import { describe, months } from '../../../../../services/date';

class Matches extends React.Component {
  render() {
    const { className, classes, match, winningTeam } = this.props;

    const date = describe(new Date(match.date));

    let state = 'draw';

    if (match.localScore > match.guestScore) {
      if (match.local._id === winningTeam) state = 'win';
      if (match.guest._id === winningTeam) state = 'loss';
    } else if (match.localScore < match.guestScore) {
      if (match.local._id === winningTeam) state = 'loss';
      if (match.guest._id === winningTeam) state = 'win';
    }

    return (
      <div className={cl(classes.root, className)}>
        <Paper className={cl(classes.paper, classes[state])} >
          <Grid container justify={'center'} alignItems={'center'}>
            <Grid item xs={3}>
              <InlineTeam team={match.local} />
            </Grid>
            <Grid item xs={2}>
              <span className={classes.middle}>
                <span className={classes.score}>
                  {match.localScore} - {match.guestScore}
                </span>
                <br />
                {date.day} {months[date.month]} {date.year} à {date.hours}:{(date.minutes < 10 ? '0' : '') + date.minutes}
              </span>
            </Grid>
            <Grid item xs={3}>
              <InlineTeam right team={match.guest} />
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(style)(Matches);
