import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import api from '../../../services/api';

class UserRanking extends React.Component {

  state = {
    users: [],
  };

  async componentDidMount() {
    try {
      const users = await api.get('/users/ranking');

      this.setState({ users: users.data });
    } catch (e) {
      // TODO invent something
    }
  }

  render() {
    const { classes } = this.props;
    const { users } = this.state;

    console.log(users);

    return (
      <div className={classes.root}>

      </div>
    );
  }
}

export default withStyles(style)(UserRanking);
