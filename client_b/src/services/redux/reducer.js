import { createStore, combineReducers } from 'redux';

const initialUser = {};

const userReducer = (state = initialUser, action) => {
  switch (action.type) {
  case 'UPDATE_USER':
    return { ...state, user: action.user };
  default:
    return state;
  }
};

const rootReducer = combineReducers({
  userReducer: userReducer
});

const store = createStore(rootReducer);

export default store;