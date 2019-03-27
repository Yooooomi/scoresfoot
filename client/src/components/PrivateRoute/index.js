import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import urls from '../../services/urls';
import { connect } from 'react-redux';
import { mapStateToProps } from '../../services/redux/tools';

const PrivateRoute = props => {
  if (!props.user && props.ready) {
    return <Redirect to={urls.account.login} />;
  } else if (props.user && props.ready) {
    return <Route {...props} />;
  } else {
    return null;
  }
};

export default connect(mapStateToProps, null)(PrivateRoute);