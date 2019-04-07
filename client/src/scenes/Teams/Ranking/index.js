import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import api from '../../../services/api';
import { getSeasonStats, ezSort, orderStats } from '../../../services/match';
import SimpleTable from '../../../components/SimpleTable';
import Title from '../../../components/Title';
import urls from '../../../services/urls';
import { Link } from 'react-router-dom';

class Ranking extends React.Component {

  state = {
    comp: null,
    teams: [],
  };

  async componentDidMount() {
    try {
      const teams = await api.get('/teams/ranking');
      console.log(teams.data);
      this.setState({ teams: teams.data.teams, comp: teams.data.competition });
    } catch (e) {
      // nothing
    }
  }

  render() {
    const { classes } = this.props;
    const { teams, comp } = this.state;

    if (!teams || !comp) return null;

    teams.sort(orderStats('points', -1));
    teams.forEach((e, k) => e.rank = k);

    const columns = [
      {
        key: 'rank',
        name: '#',
        render: (el, k) => <span>{el.rank + 1}</span>,
        sort: orderStats('rank'),
      },
      {
        key: 'name',
        name: 'Nom',
        render: (el, k, props) => <Link to={urls.team.replace(':id', el.id)}><span>{el.name}</span></Link>,
        sort: orderStats('name'),
      },
      {
        key: 'points',
        name: 'Points',
        sort: orderStats('points'),
      },
      {
        key: 'played',
        name: 'Joués',
        sort: orderStats('played'),
      },
      {
        key: 'winrate',
        name: 'Pc de victoire',
        render: (el, props) => <span>{Math.round(el.wins / el.played * 100)} %</span>,
        sort: (a, b) => {
          a = a.wins / a.played;
          b = b.wins / b.played;

          if (a > b) return 1;
          if (a < b) return -1;
          return 0;
        }
      },
      {
        key: 'goals',
        name: 'Buts pour',
        sort: orderStats('goals'),
      },
      {
        key: 't_goals',
        name: 'Buts contre',
        sort: orderStats('t_goals'),
      },
      {
        key: 'average goals',
        name: 'Moy. de buts',
        render: (el) => <span>{Math.round(el.goals / el.played * 100) / 100}</span>,
        sort: (a, b) => {
          a = a.goals / a.played;
          b = b.goals / b.played;

          if (a > b) return 1;
          if (a < b) return -1;
          return 0;
        }
      },
    ];

    return (
      <div className={classes.root}>
        <Title>Classement des equipes pour {comp.name}</Title>
        <SimpleTable columns={columns} data={teams} className={classes.table} />
      </div>
    );
  }
}

export default withStyles(style)(Ranking);
