import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from '../style';

import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

import { withRouter, Link } from 'react-router-dom';
import api from '../../../../services/api';
import urls from '../../../../services/urls';

class Register extends React.Component {

  state = {
    username: '',
    password: '',
  }

  register = async e => {
    e.preventDefault();
    try {
      await api.post('/register', {
        username: this.state.username,
        password: this.state.password,
      });
      window.message('success', 'Successfully registered');
      this.props.history.push(urls.account.login);
    } catch (e) {
      window.message('error', 'Could not connect');
    }
  }

  update = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { classes, className } = this.props;

    return (
      <form className={className} onSubmit={this.register}>
        <Input className={classes.input} placeholder={'username'} value={this.state.username} onChange={this.update} name={'username'} />
        <Input className={classes.input} placeholder={'password'} value={this.state.password} onChange={this.update} name={'password'} type={'password'} />

        <Button className={classes.button} type={'submit'}>Register</Button>
        <Link className={classes.or} to={urls.account.login}>or login</Link>
      </form>
    );
  }
}

export default withRouter(withStyles(style)(Register));
