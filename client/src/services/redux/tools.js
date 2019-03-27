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
});

export { mapDispatchToProps, mapStateToProps };