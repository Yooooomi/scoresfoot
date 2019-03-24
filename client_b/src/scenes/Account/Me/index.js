import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

class Me extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        
      </div>
    );
  }
}

export default withStyles(style)(Me);
