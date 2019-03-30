import React from 'react';
import { Grid, Button, withStyles } from '@material-ui/core';
import InlineTeam from '../../../../../components/InlineTeam';
import style from './style';
import { describe } from '../../../../../services/date';

const doActionOnDate = (action, date, value) => {
  switch (action) {
  case 'day':
    date.setDate(date.getDate() + value); break;
  case 'hours':
    date.setHours(date.getHours() + value); break;
  case 'minutes':
    date.setMinutes(date.getMinutes() + value); break;
  default:
    return date;
  }
  return date;
};

const ModifyableMatch = props => {
  const { match, className, onChange } = props;

  const matchDate = new Date(match.date);

  const described = describe(matchDate);

  const modifyTime = (
    <Grid container alignItems={'center'} spacing={'24'} justify={'center'}>
      <Grid item xs={'auto'}>{described.day}<br />
        <Button onClick={() => onChange(doActionOnDate('day', matchDate, -5))}>-</Button>
        <Button onClick={() => onChange(doActionOnDate('day', matchDate, +5))}>+</Button>
      </Grid>
      <Grid item xs={'auto'}>{described.hours} heures <br />
        <Button onClick={() => onChange(doActionOnDate('hours', matchDate, -1))}>-</Button>
        <Button onClick={() => onChange(doActionOnDate('hours', matchDate, +1))}>+</Button>
      </Grid>
      <Grid item xs={'auto'}>:</Grid>
      <Grid item xs={'auto'}>{described.minutes} minutes<br />
        <Button onClick={() => onChange(doActionOnDate('minutes', matchDate, -5))}>-</Button>
        <Button onClick={() => onChange(doActionOnDate('minutes', matchDate, +5))}>+</Button>
      </Grid>
    </Grid>
  );

  return (
    <div className={className}>
      <Grid container alignItems={'center'}>
        <Grid item xs={3}>
          <InlineTeam team={match.local} />
        </Grid>
        <Grid item xs={6}>
          {
            modifyTime
          }
        </Grid>
        <Grid item xs={3}>
          <InlineTeam right team={match.guest} />
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(style)(ModifyableMatch);