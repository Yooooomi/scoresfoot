import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { Input } from '@material-ui/core';
import cl from 'classnames';

class SearchBar extends React.Component {
  state = {
    search: '',
  };

  onUpdate = e => {
    this.setState({ search: e.target.value });
  }

  render() {
    const { classes, className } = this.props;
    return (
      <div className={cl(classes.root, className)}>
        <Input placeholder={'Rechercher...'} classes={{ input: classes.input }} className={classes.search} />
        {/* <Popper id={id} open={open} anchorEl={anchorEl} transition>
          <Paper>
            <Typography className={classes.typography}>The content of the Popper.</Typography>
          </Paper>
        </Popper> */}
      </div>
    );
  }
}

export default withStyles(style)(SearchBar);
