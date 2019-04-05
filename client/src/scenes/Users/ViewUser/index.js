import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { withRouter } from 'react-router-dom';
import api from '../../../services/api';

class ViewUser extends React.Component {

  state = {
    user: null,
  };

  async componentDidMount() {
    const { id } = this.props.match.params;

    try {
      const user = await api.get(`/users/stats/${id}`);
      this.setState({ user: user.data });
    } catch (e) {
      // TODO
    }
  }

  render() {
    const { classes } = this.props;

    const { user } = this.state;

    console.log(user);

    return (
      <div className={classes.root}>

      </div>
    );
  }
}

export default withRouter(withStyles(style)(ViewUser));
