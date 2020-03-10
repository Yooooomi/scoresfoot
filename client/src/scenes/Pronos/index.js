import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../services/redux/tools';
import InlineTeam from '../../components/InlineTeam';
import { Grid, Paper } from '@material-ui/core';
import Title from '../../components/Title';
import { getPronoPoints } from '../../services/match';
import cl from 'classnames';

class Pronos extends React.Component {

  render() {
    const { classes, user } = this.props;
    return (
      <div className={classes.root}>
        <Title>Vos pronos</Title>
        {
          user.pronos.map(e => {
            const multiplier = getPronoPoints(e);
            let className = '';
            if (e.match.local_score !== -1)
              if (multiplier === 3) className = 'win';
              else if (multiplier === 1) className = '';
              else className = 'loss';
            return (
              <Paper key={e.match_id} className={cl(classes.paper, classes[className])}>
                <Grid container alignItems={'center'} justify={'space-between'}>
                  <Grid item xs={3}>
                    <InlineTeam team={e.match.local} />
                  </Grid>
                  <Grid item xs={2}>
                    <span className={classes.pronoScore}>{e.local_score} - {e.guest_score}</span>
                    {
                      e.match.local_score !== -1 && <div><br />{e.match.local_score} - {e.match.guest_score}</div>
                    }
                  </Grid>
                  <Grid item xs={3}>
                    <InlineTeam right team={e.match.guest} />
                  </Grid>
                  <Grid item xs={2}>Coeff: {e.coeff}<br />
                    {
                      e.match.local_score !== -1 ? (
                        <span>Gains: {getPronoPoints(e)}</span>
                      ) : (
                        <span>Gain max. {e.coeff * 3}</span>
                      )
                    }
                  </Grid>
                </Grid>
              </Paper>
            )
          })
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Pronos));
