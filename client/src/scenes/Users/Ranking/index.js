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

const orderStats = (path, asc = 1) => (a, b) => {
  if (a[path] > b[path]) return 1 * asc;
  if (a[path] < b[path]) return -1 * asc;
  return 0;
};

class UserRanking extends React.Component {

  state = {
    users: [],
  };

  async componentDidMount() {
    try {
      const users = await api.get('/users/ranking');

      this.setState({ users: users.data });
    } catch (e) {
      // TODO invent something
    }
  }

  render() {
    const { classes, user } = this.props;
    const { users } = this.state;

    console.log(users);

    const columns = [
      {
        name: 'name',
        key: 'username',
        render: (el, k, props) => <Link to={urls.viewUser.replace(':id', el._id)}><span className={user.username === el.username ? classes.me : ''}>{el.username}</span></Link>,
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
        key: 'totalCoeff',
        sort: 'auto',
      },
      {
        name: 'moy. pariés',
        render: (el, k, props) => <span>{Math.round(el.totalCoeff / el.pronos * 100) / 100}</span>
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

    const usersData = users.map(e => ({ ...e.user, ...e }));

    return (
      <div className={classes.root}>
        <Title>Classement pour {'TODO'}</Title>
        <SimpleTable columns={columns} data={usersData} className={classes.table} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(UserRanking));
