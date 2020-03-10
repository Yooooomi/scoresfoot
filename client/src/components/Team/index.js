import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import cl from 'classnames';
import urls from '../../services/urls';
import { Link } from 'react-router-dom';

class Team extends React.Component {
  render() {
    const { classes, team, className } = this.props;
    return (
      <div className={cl(classes.root, className)}>
        <img src={`/logos/${team.name}.png`} alt={'team'} className={classes.logo} />
        <Link to={urls.team.replace(':id', team.id)}><span className={classes.teamName}>{team.name}</span></Link>
      </div>
    );
  }
}

export default withStyles(style)(Team);
