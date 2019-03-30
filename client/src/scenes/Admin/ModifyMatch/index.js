import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import api from '../../../services/api';
import Select from 'react-select';
import Title from '../../../components/Title';
import InlineTeam from '../../../components/InlineTeam';
import { Grid, Button } from '@material-ui/core';
import { describe } from '../../../services/date';
import ModifyableMatch from './components/ModifyableMatch';

class ModifyMatch extends React.Component {

  state = {
    competitions: [],
    selectComp: null,
    selectStep: null,
    selectStepData: null,
  };

  async componentDidMount() {
    const competitions = (await api.get('/competition/getall')).data;

    const newState = {
      competitions,
    };
    this.setState(newState);
  }

  selectStep = async value => {
    this.setState({ selectStep: value });
    try {
      const matches = await api.get(`/competition/step/${value.value._id}`);
      console.log(matches.data);
      this.setState({ selectStepData: matches.data });
    } catch (e) {
      console.error(e);
    }
  }

  selectComp = async value => {
    try {
      const comp = (await api.get(`/competition/${value.value._id}`)).data;

      let newState = {
        steps: comp.steps,
        selectComp: {
          label: comp.name,
          value: comp,
        }
      };
      if (comp.steps.length > 0) {
        newState.selectStep = {
          value: comp.steps[0],
          label: comp.steps[0].name,
        };
      }
      this.setState(newState);
    } catch (e) {
      return;
    }
  }

  modifyTime = index => newTime => {
    const { selectStepData } = this.state;

    console.log('index', index);

    selectStepData.matchs[index].modified = true;
    selectStepData.matchs[index].date = newTime;
    this.setState({ selectStepData });
  }

  save = async () => {
    const { selectStepData } = this.state;

    for (let m of selectStepData.matchs) {
      if (m.modified) {
        await api.post('/match/update', {
          matchId: m._id,
          date: m.date.toISOString(),
        });
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { competitions, selectComp, selectStep, selectStepData } = this.state;

    const comps = competitions.map(e => ({
      value: e,
      label: e.name,
    }));

    let steps = [];
    if (selectComp) {
      steps = selectComp.value.steps.map(e => ({
        label: e.name,
        value: e,
      }));
    }

    let matches = [];
    if (selectStep && selectStepData) {
      matches = selectStepData.matchs.map((e, k) => (
        <ModifyableMatch onChange={this.modifyTime(k)} className={classes.modify} key={e._id} match={e} />
      ));
    }

    return (
      <div className={classes.root}>
        <Title>Modifier un match</Title>
        <Select value={this.state.selectComp} className={classes.selects} options={comps} onChange={this.selectComp} />
        <Select value={this.state.selectStep} className={classes.selects} options={steps} onChange={this.selectStep} />
        {
          matches
        }
        <Button onClick={this.save}>SAVE</Button>
      </div>
    );
  }
}

export default withStyles(style)(ModifyMatch);
