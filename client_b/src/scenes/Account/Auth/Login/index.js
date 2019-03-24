import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from '../style';

import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

import api from '../../../../services/api';
import { withRouter, Link } from 'react-router-dom';
import urls from '../../../../services/urls';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../../../services/redux/tools';

class Login extends React.Component {

  state = {
    username: '',
    password: '',
  }

  login = async e => {
    e.preventDefault();
    try {
      const user = await api.post('/login', {
        username: this.state.username,
        password: this.state.password,
      });
      console.log(user.data);
      this.props.updateUser(user.data);
      window.message('success', 'Successfully connected');
      this.props.history.push(urls.home);
    } catch (e) {
      window.message('error', 'Could not connect');
    }
  }

  update = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { classes, className } = this.props;

    return (
      <form className={className} onSubmit={this.login}>
        <Input className={classes.input} placeholder={'username'} value={this.state.username} onChange={this.update} name={'username'} />
        <Input className={classes.input} placeholder={'password'} value={this.state.password} onChange={this.update} name={'password'} type={'password'} />

        <Button className={classes.button} type={'submit'}>Login</Button>
        <Link className={classes.or} to={urls.account.register}>or register</Link>
      </form>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(style)(Login)));
