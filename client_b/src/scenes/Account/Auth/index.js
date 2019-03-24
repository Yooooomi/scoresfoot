import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { withRouter } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import { Paper } from '@material-ui/core';

const paths = {
  '/login': Login,
  '/register': Register,
};

class Auth extends React.Component {
  render() {
    const { classes } = this.props;

    const Comp = paths[this.props.location.pathname];

    return (
      <div className={classes.root}>
        <Paper className={classes.container}>
          <Comp className={classes.comp} />
        </Paper>
      </div>
    );
  }
}

export default withStyles(style)(Auth);
