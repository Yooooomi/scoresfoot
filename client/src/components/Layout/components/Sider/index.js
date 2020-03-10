import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { Link } from 'react-router-dom';
import { List, ListItem, Paper, Input, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../../../services/redux/tools';
import urls from '../../../../services/urls';
import SearchBar from './components/SearchBar';
import cl from 'classnames';
import { withRouter } from 'react-router-dom';

import Account from '@material-ui/icons/AccountCircleOutlined';
import Ranking from '@material-ui/icons/ListOutlined';
import Pronostic from '@material-ui/icons/InputOutlined';
import MyPronos from '@material-ui/icons/BookOutlined';
import AddMatch from '@material-ui/icons/AddOutlined';
import UpdateMatch from '@material-ui/icons/UpdateOutlined';
import Edit from '@material-ui/icons/EditOutlined';

const LogState = {
  WHATEVER: 0,
  NEEDLOG: 1,
  NEEDNOTLOG: 2,
};

const modules = [
  { name: 'My account', link: urls.home, Icon: Account, log: LogState.NEEDLOG },
  { name: 'Classement', link: urls.teamRanking, Icon: Ranking, log: LogState.NEEDLOG },
  { name: 'Classement Joueurs', link: urls.userRanking, Icon: Ranking, log: LogState.NEEDLOG },
  { name: 'Pronostic', link: '/prono', Icon: Pronostic, log: LogState.NEEDLOG },
  { name: 'My pronos', link: urls.myPronos, Icon: MyPronos, log: LogState.NEEDLOG },
  { name: 'Add match', link: '/add_match', Icon: AddMatch, log: LogState.NEEDLOG, admin: true },
  { name: 'Update match', link: urls.updateMatch, Icon: UpdateMatch, log: LogState.NEEDLOG, admin: true },
  { name: 'Modify match', link: urls.modifyMatches, Icon: Edit, log: LogState.NEEDLOG, admin: true },
];

class Sider extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper square className={classes.root}>
        <SearchBar className={classes.search} />
        {
          modules.map((e, k) => {
            const logged = this.props.user ? LogState.NEEDLOG : LogState.NEEDNOTLOG;
            const admin = (logged === LogState.NEEDLOG && this.props.user.admin);
            const highlighted = this.props.location.pathname === e.link;

            if (((e.admin && admin) || !e.admin) && (
              e.log === LogState.WHATEVER ||
              e.log === logged
            ))
              return (
                <Link key={k} to={e.link} className={classes.link}>
                  <div className={cl(classes.linkContainer, highlighted ? classes.linkContainerHighlighted : '')}>
                    <div item xs={2} className={classes.icon}>
                      <e.Icon />
                    </div>
                    <div item xs={10} className={classes.text}>
                      {e.name}
                    </div>
                  </div>
                </Link>
              );
            return null;
          })
        }
      </Paper>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Sider)));
