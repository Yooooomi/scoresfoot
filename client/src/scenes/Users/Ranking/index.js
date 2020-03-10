import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import api from '../../../services/api';
import SimpleTable from '../../../components/SimpleTable';
import Title from '../../../components/Title';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../../services/redux/tools';
import urls from '../../../services/urls';
import { Link } from 'react-router-dom';
import { orderStats } from '../../../services/match';

class UserRanking extends React.Component {

  state = {
    users: [],
    comp: null,
  };

  async componentDidMount() {
    try {
      const users = await api.get('/users/ranking');

      this.setState({ users: users.data.users, comp: users.data.competition });
    } catch (e) {
      // TODO invent something
    }
  }

  render() {
    const { classes, user } = this.props;
    const { users, comp } = this.state;

    if (!comp) return null;

    users.sort(orderStats('points'));
    users.forEach((e, k) => e.rank = k);

    const columns = [
      {
        key: 'rank',
        name: '#',
        render: (el, k) => <span>{el.rank + 1}</span>,
        sort: orderStats('rank'),
      },
      {
        name: 'name',
        key: 'username',
        render: (el, k, props) => <Link to={urls.viewUser.replace(':id', el.id)}><span className={user.username === el.username ? classes.me : ''}>{el.username}</span></Link>,
        sort: 'auto',
      },
      {
        name: 'score',
        key: 'points',
        sort: 'auto',
      },
      {
        name: 'pronos',
        key: 'pronos',
        sort: 'auto',
      },
      {
        name: 'scores justes',
        key: 'sj',
        sort: 'auto',
      },
      {
        name: 'bonne tendance',
        key: 'bt',
        sort: 'auto',
      },
      {
        name: 'ratés',
        key: 'failed',
        sort: 'auto',
      },
      {
        name: 'points pariés',
        key: 'bet',
        sort: 'auto',
      },
      {
        name: 'moy. pariés',
        render: (el, k, props) => <span>{Math.round(el.bet / el.pronos * 100) / 100}</span>
      },
      {
        name: 'pts/match',
        render: (el, k, props) => <span>{Math.round(el.points / el.pronos * 100) / 100}</span>
      },
      {
        name: 'buts pariés',
        key: 'goals',
        sort: 'auto',
      },
    ];

    return (
      <div className={classes.root}>
        <Title>Classement des joueurs pour {comp.name}</Title>
        <SimpleTable columns={columns} data={users} className={classes.table} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(UserRanking));
