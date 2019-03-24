import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { Link } from 'react-router-dom';
import { List, ListItem } from '@material-ui/core';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../../../services/redux/tools';

const LogState = {
  WHATEVER: 0,
  NEEDLOG: 1,
  NEEDNOTLOG: 2,
};

const modules = [
  { name: 'My account', link: '/me', log: LogState.NEEDLOG },
  { name: 'Pronostic', link: '/prono', log: LogState.NEEDLOG },
  { name: 'My pronos', link: '/my_pronos', log: LogState.NEEDLOG },
  { name: 'Add match', link: '/add_match', log: LogState.NEEDLOG, admin: true },
];

class Sider extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <List>
          {
            modules.map((e, k) => {
              const logged = this.props.user ? LogState.NEEDLOG : LogState.NEEDNOTLOG;
              const admin = (logged === LogState.NEEDLOG && this.props.user.admin);

              if (((e.admin && admin) || !e.admin) && (
                e.log === LogState.WHATEVER ||
                e.log === logged
              ))
                return (
                  <Link key={k} to={e.link} className={classes.link}>
                    <ListItem className={classes.container}>
                      {e.name}
                    </ListItem>
                  </Link>
                );
              return null;
            })
          }
        </List>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Sider));
