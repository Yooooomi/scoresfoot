const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const bodyparser = require('body-parser');
const app = express();
const cookies = require('cookie-session');

const allowedCORS = [
  'scoresfoot.yooooomi.com',
  'https://scoresfoot.yooooomi.com',
  'http://localhost:3000',
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedCORS.indexOf(origin) > -1)
    res.setHeader('Access-Control-Allow-Origin', origin);

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, Authorization, ' +
    'x-id, Content-Length, X-Requested-With'
  );
  res.header('Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS');

  next();
});

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use(cookies({
  domain: process.env['PRODUCTION'] ? '.yooooomi.com' : '', // '' for localhost
  name: 'session',
  keys: ['salutatous', 'cdiablox9'],
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));

app.use(require('./routes/accounts')(passport));
app.use(require('./routes/match')());
app.use(require('./routes/prono')());
app.use(require('./routes/teams')());
app.use(require('./routes/users')());

app.get('/api/hello', (req, res) => {
  res.status(200).send('Hello, world!');
});

app.listen(8081, () => console.log('Listening on 8081'));

module.exports = app;