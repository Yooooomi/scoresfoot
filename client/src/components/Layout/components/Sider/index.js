import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { Link } from 'react-router-dom';
import { List, ListItem, Paper, Input, Grid, ListSubheader, ListItemIcon, ListItemText } from '@material-ui/core';
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
  {
    label: 'Account',
    links: [
      { name: 'My account', link: urls.home, Icon: Account, log: LogState.NEEDLOG },
    ],
  },
  {
    label: 'Rankings',
    links: [
      { name: 'Classement', link: urls.teamRanking, Icon: Ranking, log: LogState.NEEDLOG },
      { name: 'Classement Joueurs', link: urls.userRanking, Icon: Ranking, log: LogState.NEEDLOG },
    ],
  },
  {
    label: 'Pronostics',
    links: [
      { name: 'Pronostic', link: '/prono', Icon: Pronostic, log: LogState.NEEDLOG },
      { name: 'My pronos', link: urls.myPronos, Icon: MyPronos, log: LogState.NEEDLOG },
    ],
  },
  {
    label: 'Admin',
    links: [
      { name: 'Add match', link: '/add_match', Icon: AddMatch, log: LogState.NEEDLOG, admin: true },
      { name: 'Update match', link: urls.updateMatch, Icon: UpdateMatch, log: LogState.NEEDLOG, admin: true },
      { name: 'Modify match', link: urls.modifyMatches, Icon: Edit, log: LogState.NEEDLOG, admin: true },
    ],
  },
];

class Sider extends React.Component {
  goto = url => {
    const { history } = this.props;

    history.push(url);
  }

  render() {
    const { classes } = this.props;
    return (
      <div square className={classes.root}>
        {
          modules.map((e, k) => {
            const logged = this.props.user ? LogState.NEEDLOG : LogState.NEEDNOTLOG;
            const admin = (logged === LogState.NEEDLOG && this.props.user.admin);
            const { pathname } = this.props.location;

            return (
              <List subheader={
                <ListSubheader style={{ color: 'lightgrey' }}>
                  {e.label}
                </ListSubheader>
              }>
                {
                  e.links.map(link => {
                    if (((link.admin && admin) || !link.admin) && (
                      link.log === LogState.WHATEVER ||
                      link.log === logged
                    ))
                      return (
                        <ListItem button onClick={() => this.goto(link.link)}>
                          <ListItemIcon>
                            <link.Icon className={classes.icon}/>
                          </ListItemIcon>
                          <ListItemText primary={link.name} />
                          {/* <Link key={k} to={link.link} className={classes.link}>
                          <div className={cl(classes.linkContainer, pathname === link.link ? classes.linkContainerHighlighted : '')}>
                            <div item xs={2} className={classes.icon}>
                            </div>
                            <div item xs={10} className={classes.text}>
                              {e.name}
                            </div>
                          </div>
                        </Link> */}
                        </ListItem>
                      );
                    return null;
                  })
                }
              </List>
            );
          })
        }
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Sider)));
