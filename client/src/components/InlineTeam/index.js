import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import urls from '../../services/urls';

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
            <Link to={urls.team.replace(':id', team.id)}><span className={classes.name}>{team.name}</span></Link>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(style)(InlineTeam);
