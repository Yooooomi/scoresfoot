CREATE TABLE competitions (
  id SERIAL PRIMARY KEY,

  name varchar(255),
  start date
);

CREATE TABLE steps (
  id SERIAL PRIMARY KEY,
  competition_id INTEGER REFERENCES competitions(id),

  name varchar(255)
);

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,

  name varchar(255),
  logo varchar(255)
);

CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  step_id INTEGER REFERENCES steps(id),

  local INTEGER REFERENCES teams(id),
  guest INTEGER REFERENCES teams(id),

  local_score INTEGER DEFAULT -1,
  guest_score INTEGER DEFAULT -1,

  date DATE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  username varchar(255) UNIQUE,
  password varchar(255)
);

CREATE TABLE pronos (
  user_id INTEGER REFERENCES users(id),
  match_id INTEGER REFERENCES matches(id),

  local_bet INTEGER DEFAULT -1,
  guest_bet INTEGER DEFAULT -1,

  PRIMARY KEY (user_id, match_id)
);