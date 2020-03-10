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
        <header>
          <Paper className={classes.header}>
            <span className={classes.scoresfoot}>Scoresfoot</span>
          </Paper>
        </header>
        <div className={classes.container}>
          <Paper square className={classes.sider}>
            <Sider />
          </Paper>
          <div className={classes.content}>
            <Paper style={{width: '100%', padding: '25px'}}>
              {this.props.children}
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(Layout);