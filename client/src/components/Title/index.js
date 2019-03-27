import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

class Title extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.props.children}
      </div>
    );
  }
}

export default withStyles(style)(Title);
