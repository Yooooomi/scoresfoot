import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../../services/redux/tools';
import Title from '../../../components/Title';

class Me extends React.Component {
  render() {
    const { classes, user } = this.props;
    return (
      <div className={classes.root}>
        <Title>Bienvenue, {user.username}</Title>
        {user.todos[0].local.name} contre {user.todos[0].guest.name}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Me));
