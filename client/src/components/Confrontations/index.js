import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import cl from 'classnames';
import { Paper, Grid } from '@material-ui/core';
import Matches from '../../scenes/Teams/Team/components/Matches';
import InlineTeam from '../InlineTeam';
import { describe } from '../../services/date';

class Confrontations extends React.Component {
  render() {
    const { classes, className, matches, teamId, teams } = this.props;
    console.log(matches);
    return (
      <div className={cl(classes.root, className)}>
        {
          matches.map(match => (
            <Matches className={classes.match} key={match.id} match={match} customWinFunction={() => 'draw'}
              customLocal={match.local_team_id === teams[0].id ? teams[0] : teams[1] } customGuest={match.guest_team_id === teams[0].id ? teams[0] : teams[1]} />
          ))
        }
      </div>
    );
  }
}

export default withStyles(style)(Confrontations);
