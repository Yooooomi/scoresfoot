import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { Grid } from '@material-ui/core';

class InlineTeam extends React.Component {
  render() {
    const { classes, team, right } = this.props;
    return (
      <div className={classes.root}>
        <Grid container alignItems={'center'} spacing={24} direction={right ? 'row-reverse' : 'row'}>
          <Grid item xs={3}>
            <img src={'/default_team.png'} alt={'team'} className={classes.logo} />
          </Grid>
          <Grid item xs={'auto'}>
            <span className={classes.name}>{team.name}</span>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(style)(InlineTeam);
