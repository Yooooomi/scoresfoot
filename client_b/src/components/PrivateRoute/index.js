import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import urls from '../../services/urls';
import { connect } from 'react-redux';
import { mapStateToProps } from '../../services/redux/tools';

const PrivateRoute = props => {
  if (!props.user) {
    return <Redirect to={urls.account.login} />;
  } else {
    return <Route {...props} />;
  }
};

export default connect(mapStateToProps, null)(PrivateRoute);