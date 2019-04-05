import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import Team from '../../components/Team';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../services/redux/tools';
import Title from '../../components/Title';
import { Grid, Menu, MenuItem, Button } from '@material-ui/core';

import nmap from 'numbermap';
import api from '../../services/api';
import { timeDiffString } from '../../services/date';
import Numbers from '../../components/Numbers';

nmap();

class Prono extends React.Component {

  state = {
    localBet: 0,
    guestBet: 0,
    coeff: 0,
    countdown: '',
  };

  pronoAvailable = () => Boolean(this.props.user.todos.length);

  update = (name, value) => {
    this.setState({ [name]: value });
  }

  updateCountdown = () => {
    if (!this.pronoAvailable()) return;
    const { date } = this.props.user.todos[0];

    const parsedDate = new Date(date);
    const now = new Date();

    this.setState({ countdown: timeDiffString(now, parsedDate) });
  }

  componentDidMount() {
    console.log('mount');
    this.updateCountdown();
    this.int = setInterval(this.updateCountdown, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.int);
  }

  makeProno = async () => {
    const match = this.props.user.todos[0];
    const { id } = match;
    const { localBet, guestBet, coeff } = this.state;

    try {
      await api.post('/prono/pronostic', {
        matchId: id,
        local: localBet,
        guest: guestBet,
        coeff: coeff,
      });
      window.message('success', 'Pronostique enregistré');
      this.props.madeProno(match, localBet, guestBet, coeff);
      console.log(this.props.user);
    } catch (e) {
      window.message('error', 'Erreur lors de l\'enregistrement');
    }
  }

  render() {
    const { classes } = this.props;

    console.log('USER', this.props.user);

    if (!this.pronoAvailable()) {
      clearInterval(this.int);
      return <NoProno />;
    }
    const { local, guest, cote } = this.props.user.todos[0];

    let localCote = 1 / (cote / (1 - cote));
    let guestCote = 1 / ((1 - cote) / (1 - (1 - cote)));

    if (cote === 1) {
      guestCote = 20;
    } else if (cote === 0) {
      localCote = 20;
    }

    return (
      <div className={classes.root}>
        <Title>Pronostiquer un match</Title>
        <div className={classes.countdown}>Match dans {this.state.countdown}</div>
        <Grid container justify={'center'} alignItems={'center'}>
          <Grid item xs={5} className={classes.teamContainer}>
            <Team team={local} className={classes.team} />
            <Numbers className={classes.selector} name={'localBet'} value={this.state.localBet} onValueChange={this.update} />
          </Grid>
          <Grid item xs={2}>{localCote}:{guestCote}</Grid>
          <Grid item xs={5} className={classes.teamContainer}>
            <Team team={guest} className={classes.team} />
            <Numbers className={classes.selector} name={'guestBet'} value={this.state.guestBet} onValueChange={this.update} />
          </Grid>
        </Grid>
        <div>
          <span className={classes.coeffText}>Coefficient</span>
          <Numbers className={classes.selector} name={'coeff'} value={this.state.coeff} onValueChange={this.update} />
        </div>
        <Button variant={'contained'} color={'primary'} className={classes.pronoButton} onClick={this.makeProno}>Pronostiquer !</Button>
      </div>
    );
  }
}

const NoProno = props => {
  return (
    <div>
      <Title>Pronostiquer un match</Title>
      <div>Aucun match a pronostiquer !</div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Prono));
