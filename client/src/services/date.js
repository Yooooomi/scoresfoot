export const months = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

export function timeDiff(date1, date2) {
  return (date2.getTime() - date1.getTime()) / 1000;
}

export function timeDiffString(date1, date2) {
  let diff = timeDiff(date1, date2);
  const value = {
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  };
  value.day = Math.floor(diff / (60 * 60 * 24));
  diff -= value.day * (60 * 60 * 24);
  value.hour = Math.floor(diff / (60 * 60));
  diff -= value.hour * (60 * 60);
  value.minute = Math.floor(diff / (60));
  diff -= value.minute * (60);
  value.second = Math.floor(diff);
  return `${value.day} jours, ${value.hour} heures, ${value.minute} minutes et ${value.second} secondes`;
}

export function describe(date) {
  return ({
    minutes: date.getMinutes(),
    hours: date.getHours(),
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
  });
}

export default timeDiffString;