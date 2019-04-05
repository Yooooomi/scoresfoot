const Knex = require('knex')
const connection = require('../knexfile')
const { Model } = require('objection')

const knexConnection = Knex(connection)

Model.knex(knexConnection)

class Competition extends Model {
  static get tableName() {
    return 'competitions';
  }

  static get relationMappings() {
    return {
      steps: {
        relation: Model.HasManyRelation,
        modelClass: Step,
        join: {
          from: 'steps.competition_id',
          to: 'competitions.id',
        }
      }
    };
  }

}

class Step extends Model {
  static get tableName() {
    return 'steps';
  }

  static get relationMappings() {
    return {
      matches: {
        relation: Model.HasManyRelation,
        modelClass: Match,
        join: {
          from: 'matches.step_id',
          to: 'steps.id',
        }
      }
    };
  }

}

class Match extends Model {
  static get tableName() {
    return 'matches';
  }

  static get relationMappings() {
    return {
      local: {
        relation: Model.BelongsToOneRelation,
        modelClass: Team,
        join: {
          from: 'matches.local_team_id',
          to: 'teams.id',
        }
      },
      guest: {
        relation: Model.BelongsToOneRelation,
        modelClass: Team,
        join: {
          from: 'matches.guest_team_id',
          to: 'teams.id',
        }
      }
    };
  }
}

class Team extends Model {
  static get tableName() {
    return 'teams';
  }

  static get relationMappings() {
    return {
      matches: {
        relation: Model.HasManyRelation,
        modelClass: Match,
        join: {
          from: 'matches.local_team_id',
          to: 'teams.id',
        }
      }
    };
  }
}

class Prono extends Model {
  static get tableName() {
    return 'pronos';
  }

  static get relationMappings() {
    return {
      match: {
        relation: Model.HasOneRelation,
        modelClass: Match,
        join: {
          from: 'pronos.match_id',
          to: 'matches.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'pronos.user_id',
          to: 'users.id',
        }
      }
    };
  }

}

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    return {
      pronos: {
        relation: Model.HasManyRelation,
        modelClass: Prono,
        join: {
          from: 'pronos.user_id',
          to: 'users.id',
        }
      }
    };
  }
}

module.exports = {
  User,
  Prono,
  Competition,
  Step,
  Match,
  Team,
};
