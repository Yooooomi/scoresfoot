import { createStore, combineReducers } from 'redux';

const initialUser = {};

const userReducer = (state = initialUser, action) => {
  switch (action.type) {
  case 'UPDATE_USER':
    return { ...state, user: action.user };
  case 'MADE_PRONO':
    state.user.todos.shift();
    state.user.pronos.push({
      local: action.infos.local, guest: action.infos.guest, match: action.infos.match, coeff: action.infos.coeff,
    });
    return {
      ...state, user: {
        ...state.user,
        todos: state.user.todos,
      }
    };
  default:
    return state;
  }
};

const initialReady = false;

const readyReducer = (state = initialReady, action) => {
  switch (action.type) {
  case 'UPDATE_READY':
    return { ...state, ready: action.ready };
  default:
    return state;
  }
};

const initialMatches = {};

const matchesReducer = (state = initialMatches, action) => {
  switch (action.type) {
  case 'ADD_MATCH':
    state.matches[action.match._id] = action.match;
    return { ...state };
  default:
    return state;
  }
};

const rootReducer = combineReducers({
  userReducer: userReducer,
  readyReducer: readyReducer,
  matchesReducer: matchesReducer,
});

const store = createStore(rootReducer);

export default store;