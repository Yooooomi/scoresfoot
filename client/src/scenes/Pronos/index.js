import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../services/redux/tools';
import InlineTeam from '../../components/InlineTeam';
import { Grid, Paper } from '@material-ui/core';
import Title from '../../components/Title';

class Pronos extends React.Component {

  render() {
    const { classes, user } = this.props;
    return (
      <div className={classes.root}>
        <Title>Vos pronos</Title>
        {
          user.pronos.map(e => (
            <Paper key={e._id} className={classes.paper}>
              <Grid container alignItems={'center'}>
                <Grid item xs={4}>
                  <InlineTeam team={e.match.local} />
                </Grid>
                <Grid item xs={2}>{e.local} - {e.guest}</Grid>
                <Grid item xs={4}>
                  <InlineTeam right team={e.match.local} />
                </Grid>
                <Grid item xs={2}>Coeff: {e.coeff}<br />Gain max. {e.coeff * 3}</Grid>
              </Grid>
            </Paper>
          ))
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Pronos));
