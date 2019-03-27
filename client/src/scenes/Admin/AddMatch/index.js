import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import Select from 'react-select';
import api from '../../../services/api';
import { Grid, Button, List, ListItem, TextField } from '@material-ui/core';
import Title from '../../../components/Title';

class AddMatch extends React.Component {
  state = {
    teams: [],
    local: [null],
    guest: [null],
    date: '',
  }

  async componentDidMount() {
    const teams = await api.get('/teams');

    this.setState({ teams: teams.data });
  }

  update = e => this.setState({ [e.target.name]: e.target.value });

  change = (name, index) => value => {
    const array = this.state[name];

    array[index] = value;

    this.setState({ [name]: array });
  }

  addMatch = async e => {
    const { local, guest, date } = this.state;

    for (let i in local) {
      if (local[i] && guest[i]) {
        await api.post('/match/new', {
          local: local[i].value._id,
          guest: guest[i].value._id,
          date,
        });
      }
    }
  }

  addCase = e => {
    const { local, guest } = this.state;

    local.push(null);
    guest.push(null);
    this.setState({ local, guest });
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
        <Title>Enregistrer un match</Title>
        <List>
          {
            local.map((e, k) => (
              <ListItem key={k} style={{ padding: 0 }}>
                <div className={classes.container}>
                  <div className={classes.part} >
                    <Select className={classes.select} options={autoc} value={local[k]} onChange={this.change('local', k)} />
                  </div>
                  <div className={classes.divider} >contre</div>
                  <div className={classes.part} >
                    <Select className={classes.select} options={autoc} value={guest[k]} onChange={this.change('guest', k)} />
                  </div>
                </div>
              </ListItem>
            ))
          }
        </List>
        <Button onClick={this.addCase} color={'secondary'} fullWidth className={classes.spacing} variant={'contained'}>+</Button>
        <div>
          <TextField
            value={this.state.date}
            onChange={this.update}
            name={'date'}
            id="datetime-local"
            label="Match date"
            type="datetime-local"
            className={classes.spacing}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <Button onClick={this.addMatch} variant={'contained'}>Add</Button>
      </div >
    );
  }
}

export default withStyles(style)(AddMatch);
