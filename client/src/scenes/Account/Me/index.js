import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../../services/redux/tools';
import Title from '../../../components/Title';
import { Button } from '@material-ui/core';
import urls from '../../../services/urls';
import { Link } from 'react-router-dom';

class Me extends React.Component {
  render() {
    const { classes, user } = this.props;
    return (
      <div className={classes.root}>
        <Title>Bienvenue, {user.username}</Title>
        {
          user.todos.length === 0 ? (
            <div>Tous les pronos sont faits</div>
          ) : (
            <div>
              <div>{user.todos[0].local.name} contre {user.todos[0].guest.name}</div>
              <Link to={urls.prono}><Button>Pronostiquer</Button></Link>
            </div>
          )
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Me));
