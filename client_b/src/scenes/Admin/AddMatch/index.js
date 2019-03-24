import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import Select from 'react-select';
import api from '../../../services/api';
import { Grid, Button } from '@material-ui/core';

class AddMatch extends React.Component {
  state = {
    teams: [],
    local: null,
    guest: null,
  }

  async componentDidMount() {
    const teams = await api.get('/teams');

    this.setState({ teams: teams.data });
  }

  change = name => value => {
    this.setState({ [name]: value });
  }

  addMatch = e => {

  }

  render() {
    const { classes } = this.props;
    const { teams, local, guest } = this.state;

    const autoc = teams.map(e => ({
      label: e.name,
      value: e,
    }));

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={6}>
            <Select options={autoc} value={local} onChange={this.change('local')} />
          </Grid>
          <Grid item xs={6}>
            <Select options={autoc} value={guest} onChange={this.change('guest')} />
          </Grid>
        </Grid>
        <Button onClick={this.addMatch}>Add</Button>
      </div>
    );
  }
}

export default withStyles(style)(AddMatch);
