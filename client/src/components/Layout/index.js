import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import Sider from './components/Sider';

class Layout extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <header className={classes.header}>
          Scoresfoot
        </header>
        <div className={classes.container}>
          <div className={classes.sider}>
            <Sider />
          </div>
          <div className={classes.content}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(Layout);