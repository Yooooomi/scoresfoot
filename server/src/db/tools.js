const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const sequelize = new Sequelize('postgresql://timothee:licorne@127.0.0.1:5432/scoresfoot');

class User extends Model { }
User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, { sequelize, tableName: 'users', timestamps: false, underscored: true, freezeTableName: true });

class Team extends Model { }
Team.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, { sequelize, tableName: 'teams', timestamps: false, underscored: true, freezeTableName: true });

class Competition extends Model { }
Competition.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, { sequelize, tableName: 'competitions', timestamps: false, underscored: true, freezeTableName: true });

class Step extends Model { }
Step.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  competition_id: {
    type: Sequelize.INTEGER,
    references: {
      key: 'id',
      model: Competition,
    }
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, { sequelize, tableName: 'steps', timestamps: false, underscored: true, freezeTableName: true });

class Match extends Model { }
Match.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  step_id: {
    type: Sequelize.INTEGER,
    references: {
      key: 'id',
      model: Step,
    },
  },
  local_score: {
    type: Sequelize.INTEGER,
    defaultValue: -1,
  },
  local_score: {
    type: Sequelize.INTEGER,
    defaultValue: -1,
  },
  local: {
    type: Sequelize.INTEGER,
    references: {
      key: 'id',
      model: Team,
    },
  },
  guest: {
    type: Sequelize.INTEGER,
    references: {
      key: 'id',
      model: Team,
    },
  },
}, { sequelize, tableName: 'matches', timestamps: false, underscored: true, freezeTableName: true });

class Prono extends Model { }
Prono.init({
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      key: 'id',
      model: User,
    }
  },
  match_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      key: 'id',
      model: Match,
    }
  },
  local_bet: {
    type: Sequelize.INTEGER,
  },
  guest_bet: {
    type: Sequelize.INTEGER,
  },
}, { sequelize, tableName: 'pronos', timestamps: false, underscored: true, freezeTableName: true });
Prono.removeAttribute('id');

User.hasMany(Prono);
Prono.belongsTo(User);

Competition.hasMany(Step);
Step.belongsTo(Competition);

Step.hasMany(Match);
Match.belongsTo(Step);

Prono.hasOne(Match, { sourceKey: 'match_id', foreignKey: 'id' });

//User.create({ username: 'timothee', password: 'licorne' });

User.findAll({
  include: [
    { model: Prono, include: [{ model: Match }] },
  ]
}).then(console.log);
