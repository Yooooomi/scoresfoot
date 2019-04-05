import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import Select from 'react-select';
import api from '../../../services/api';
import { Grid, Button, List, ListItem, TextField } from '@material-ui/core';
import Title from '../../../components/Title';
import Create from './components/Create';

class AddMatch extends React.Component {
  state = {
    competitions: [],
    steps: [],
    step: [],
    teams: [],
    local: [null],
    guest: [null],
    date: '',
    comp: null,

    createName: '',
  }

  async componentDidMount() {
    let teams = api.get('/teams');
    let competitions = api.get('/competition/getall');


    teams = await teams;
    competitions = await competitions;
    console.log(competitions.data);

    competitions.data.reverse();

    this.setState({
      teams: teams.data, competitions: competitions.data,
    });
    if (competitions.data.length > 0) {
      this.changeComp({
        label: competitions.data[0].name,
        value: { id: competitions.data[0].id },
      });
    }
  }

  update = e => this.setState({ [e.target.name]: e.target.value });

  change = (name, index) => value => {
    const array = this.state[name];

    array[index] = value;

    this.setState({ [name]: array });
  }

  changeComp = (value) => {
    this.setState({ comp: value });
    api.get(`/competition/${value.value.id}`)
      .then(r => {
        r.data.steps.reverse();
        let newState = {
          steps: r.data.steps,
        };
        if (r.data.steps.length > 0) {
          newState.step = {
            value: r.data.steps[0],
            label: r.data.steps[0].name,
          };
        } else {
          newState.step = null;
        }
        this.setState(newState);
      });
  }

  changeStep = value => {
    this.setState({ step: value });
  }

  addMatch = async e => {
    const { step, local, guest, date } = this.state;

    for (let i in local) {
      if (local[i] && guest[i]) {
        await api.post('/match/new', {
          stepId: step.value.id,
          local: local[i].value.id,
          guest: guest[i].value.id,
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

  createNameChange = e => this.setState({ createName: e.target.value }, () => console.log(this.state.createName));

  onAddComp = () => {
    this.setState({ createName: '' }, () => {
      window.popup('Créer une compétition', <Create onChange={this.createNameChange} />, this.addComp);
    });
  }

  addComp = async () => {
    const newcomp = await api.post('/competition/new', {
      name: this.state.createName,
      start: new Date().toISOString(),
    });
    const compets = await api.get('/competition/getall');
    compets.data.reverse();
    this.setState({ competitions: compets.data }, () => this.changeComp({
      value: newcomp.data,
      label: newcomp.data.name,
    }));
  }

  onAddStep = () => {
    this.setState({ createName: '' }, () => {
      window.popup('Créer une journée', <Create onChange={this.createNameChange} />, this.addStep);
    });
  }

  addStep = async () => {
    console.log(this.state);
    await api.post('/competition/newstep', {
      competitionId: this.state.comp.value.id,
      name: this.state.createName,
    });
    const compet = await api.get(`/competition/${this.state.comp.value.id}`);
    compet.data.steps.reverse();
    this.setState({
      comp: {
        value: compet.data,
        label: compet.data.name,
      },
      steps: compet.data.steps,
      step: {
        value: compet.data.steps[0],
        label: compet.data.steps[0].name,
      }
    });
  }

  render() {
    const { classes } = this.props;
    const { competitions, comp, step, steps, teams, local, guest } = this.state;

    const compc = competitions.map(e => ({
      label: e.name,
      value: e,
    }));

    console.log(comp && comp.value);

    let stepc = steps.map(e => ({
      label: e.name,
      value: e,
    }));

    const autoc = teams.map(e => ({
      label: e.name,
      value: e,
    }));

    return (
      <div className={classes.root}>
        <Title>Enregistrer un match</Title>
        <Grid container>
          <Grid item xs={11}>
            <Select className={classes.select} options={compc} value={comp} onChange={this.changeComp} />
          </Grid>
          <Grid item xs={1}>
            <Button onClick={this.onAddComp}>+</Button>
          </Grid>
          <Grid item xs={11}>
            <Select className={classes.select} options={stepc} value={step} onChange={this.changeStep} />
          </Grid>
          <Grid item xs={1}>
            <Button disabled={!comp} onClick={this.onAddStep}>+</Button>
          </Grid>
        </Grid>
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
