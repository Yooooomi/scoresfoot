import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import api from '../../../services/api';
import Team from '../../../components/Team';
import InlineTeam from '../../../components/InlineTeam';
import { Grid, Button } from '@material-ui/core';
import Numbers from '../../../components/Numbers';

import numbermap from 'numbermap';
import Title from '../../../components/Title';

numbermap();

class UpdateMatch extends React.Component {
  state = {
    matches: [],
    local: [],
    guest: [],
  };

  refresh = async () => {
    try {
      const matches = await api.get('/match/needupdate');

      const local = [];
      const guest = [];

      matches.data.length.map(e => local.push(0) && guest.push(0));

      this.setState({ matches: matches.data, local, guest });
    } catch (e) {
      window.message('error', 'Nous n\'avons pas pu retrouver les matchs :(');
    }
  }

  update = (index, name, value) => {
    const array = this.state[name];

    array[index] = value;
    this.setState({ [name]: array });
  }

  componentDidMount() {
    this.refresh();
  }

  setScore = async ndx => {
    const { matches, local, guest } = this.state;

    try {
      await api.post('/match/setscore', {
        matchId: matches[ndx]._id,
        localScore: local[ndx],
        guestScore: guest[ndx],
      });
      window.message('success', 'Score mis à jour !');
      local.splice(ndx, 1);
      guest.splice(ndx, 1);
      matches.splice(ndx, 1);
      this.setState({ local, guest, matches });
    } catch (e) {
      console.error(e);
      window.message('error', 'Score non mis à jour');
    }
  }

  render() {
    const { classes } = this.props;
    const { matches } = this.state;

    return (
      <div className={classes.root}>
        <Title>Mettre a jour un score</Title>
        {
          matches.length === 0 ? (
            <NoMatch />
          ) : (
            matches.map((e, k) => (
              <Grid container key={e._id} alignItems={'center'}>
                <Grid item xs={3}>
                  <InlineTeam team={e.local} />
                </Grid>
                <Grid item xs={1}>
                  <Numbers value={this.state.local[k]} name={'local'} onValueChange={(name, value) => this.update(k, name, value)} />
                </Grid>
                <Grid item xs={1}>à</Grid>
                <Grid item xs={1}>
                  <Numbers value={this.state.guest[k]} name={'guest'} onValueChange={(name, value) => this.update(k, name, value)} />
                </Grid>
                <Grid item xs={3}>
                  <InlineTeam right team={e.guest} />
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'right' }}>
                  <Button variant={'contained'} color={'primary'} onClick={e => this.setScore(k)}>OK</Button>
                </Grid>
              </Grid>
            ))
          )
        }
      </div>
    );
  }
}

const NoMatch = props => {
  return (
    <div>
      Pas de matchs a mettre a jour
    </div>
  );
}

export default withStyles(style)(UpdateMatch);
