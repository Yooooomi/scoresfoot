import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import Sider from './components/Sider';
import { Paper } from '@material-ui/core';

class Layout extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.sider}>
          <div className={classes.scoresfoot}>
            Scoresfoot
          </div>
          <Sider />
        </div>
        <header>
          <Paper className={classes.header}>
          </Paper>
        </header>
        <div className={classes.container}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withStyles(style)(Layout);