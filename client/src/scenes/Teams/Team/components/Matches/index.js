import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { Paper, Grid } from '@material-ui/core';
import InlineTeam from '../../../../../components/InlineTeam';
import cl from 'classnames';
import { describe, months } from '../../../../../services/date';

class Matches extends React.Component {
  render() {
    const { className, classes, match, winningTeam, customWinFunction, customLocal, customGuest } = this.props;

    const date = describe(new Date(match.date));

    let state = 'draw';

    if (customWinFunction) state = customWinFunction(match);
    else {
      if (match.local_score > match.guest_score) {
        if (match.local.id === winningTeam) state = 'win';
        if (match.guest.id === winningTeam) state = 'loss';
      } else if (match.local_score < match.guest_score) {
        if (match.local.id === winningTeam) state = 'loss';
        if (match.guest.id === winningTeam) state = 'win';
      }
    }

    return (
      <div className={cl(classes.root, className)}>
        <Paper className={cl(classes.paper, classes[state])} >
          <Grid container justify={'center'} alignItems={'center'}>
            <Grid item xs={3}>
              <InlineTeam team={customLocal ? customLocal : match.local} />
            </Grid>
            <Grid item xs={2} className={classes.middleContainer}>
              <span className={classes.middle}>
                <span className={classes.score}>
                  {match.local_score} - {match.guest_score}
                </span>
                <br />
                {date.day} {months[date.month]} {date.year} à {date.hours}:{(date.minutes < 10 ? '0' : '') + date.minutes}
              </span>
            </Grid>
            <Grid item xs={3}>
              <InlineTeam right team={customGuest ? customGuest : match.guest} />
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(style)(Matches);
