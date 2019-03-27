import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { Input } from '@material-ui/core';

class Create extends React.Component {
  render() {
    const { classes, onChange } = this.props;
    console.log('render');
    return (
      <div className={classes.root}>
        <Input placeholder={'Nom de la compétition'} onChange={onChange} />
      </div>
    );
  }
}

export default withStyles(style)(Create);
