import store from './reducer';
import api from '../api';

const mapStateToProps = state => ({
  user: state.userReducer.user,
  ready: state.readyReducer.ready,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => {
    dispatch({ type: 'UPDATE_USER', user });
  },
  madeProno: (match, local, guest, coeff) => {
    dispatch({ type: 'MADE_PRONO', infos: { match, local, guest, coeff } });
  },
  updateReady: ready => {
    dispatch({ type: 'UPDATE_READY', ready });
  },
  getMatch: async matchId => {
    const st = store.getStore();

    console.log(st);

    if (matchId in st.matches) {
      return st.matches[matchId];
    } else {
      const missingMatch = await api.get('/match/get/' + matchId);
      dispatch({ type: 'NEW_MATCH', match: missingMatch.data });
      return missingMatch.data;
    }
  },
});

export { mapDispatchToProps, mapStateToProps };