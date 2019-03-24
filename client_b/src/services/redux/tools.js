const mapStateToProps = state => ({
  user: state.userReducer.user,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => {
    console.log('USER', user);
    dispatch({ type: 'UPDATE_USER', user });
  },
});

export { mapDispatchToProps, mapStateToProps };