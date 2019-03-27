import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import cl from 'classnames';

class Team extends React.Component {
  render() {
    const { classes, team, className } = this.props;
    return (
      <div className={cl(classes.root, className)}>
        <img src={'/default_team.png'} alt={'team'} className={classes.logo} />
        <span>{team.name}</span>
      </div>
    );
  }
}

export default withStyles(style)(Team);
