import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { Button, Menu, MenuItem } from '@material-ui/core';
import cl from 'classnames';

class Numbers extends React.Component {
  state = {
    anchorEl: null,
  }

  handleClick = e => this.setState({ anchorEl: e.currentTarget });

  handleClose = (e, index) => {
    if (index !== -1)
      this.props.onValueChange(this.props.name, index);
    this.setState({ anchorEl: null });
  }

  render() {
    const { className, classes, value, name } = this.props;
    return (
      <div className={cl(classes.root, className)}>
        <Button variant={'contained'} color={'primary'} onClick={this.handleClick}><span className={classes.buttonValue}>{value}</span></Button>
        <Menu
          name={name}
          anchorEl={this.state.anchorEl}
          onClose={() => this.handleClose(null, -1)}
          open={Boolean(this.state.anchorEl)}
        >
          {
            (11).map(e => (
              <MenuItem key={e} value={e} onClick={ev => this.handleClose(ev, e)}><span className={classes.number}>{e}</span></MenuItem>
            ))
          }
        </Menu>
      </div>
    );
  }
}

export default withStyles(style)(Numbers);
