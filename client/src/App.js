import React, { Component } from 'react';
import './App.css';
import { MuiThemeProvider } from '@material-ui/core';
import theme from './theme/theme';
import Layout from './components/Layout';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import urls from './services/urls';
import PrivateRoute from './components/PrivateRoute';
import Me from './scenes/Account/Me';
import Auth from './scenes/Account/Auth';
import Notification from './components/Notification';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './services/redux/tools';
import api from './services/api';
import AddMatch from './scenes/Admin/AddMatch';
import Prono from './scenes/Prono';
import UpdateMatch from './scenes/Admin/UpdateMatch';
import Pronos from './scenes/Pronos';
import Popup from './components/Popup';
import ModifyMatch from './scenes/Admin/ModifyMatch';
import Team from './scenes/Teams/Team';
import Ranking from './scenes/Teams/Ranking';
import UserRanking from './scenes/Users/Ranking';
import ViewUser from './scenes/Users/ViewUser';

class App extends Component {
  async componentDidMount() {
    try {
      const user = await api.get('/me');
      console.log('DATA', user.data);
      this.props.updateUser(user.data);
    } catch (e) {
      // Nothing happens, user just not logged
    }
    this.props.updateReady(true);
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <Notification />
            <Layout>
              <Popup />
              <Switch>
                <Route exact path={urls.account.login} component={Auth} />
                <Route exact path={urls.account.register} component={Auth} />
                <PrivateRoute exact path={urls.prono} component={Prono} />
                <PrivateRoute exact path={urls.home} component={Me} />
                <PrivateRoute exact path={urls.addMatch} component={AddMatch} />
                <PrivateRoute exact path={urls.updateMatch} component={UpdateMatch} />
                <PrivateRoute exact path={urls.myPronos} component={Pronos} />
                <PrivateRoute exact path={urls.modifyMatches} component={ModifyMatch} />
                <PrivateRoute exact path={urls.team} component={Team} />
                <PrivateRoute exact path={urls.teamRanking} component={Ranking} />
                <PrivateRoute exact path={urls.userRanking} component={UserRanking} />
                <PrivateRoute exact path={urls.viewUser} component={ViewUser} />
                <PrivateRoute exact path={'*'} />
              </Switch>
            </Layout>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
