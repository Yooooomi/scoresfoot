import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Button, DialogActions } from '@material-ui/core';

class Popup extends React.Component {

  state = {
    open: false,
    title: null,
    content: null,
  }

  onValidate = null;
  onCancel = null;

  openPopup = (title, content, onValidate = null, onCancel = null) => {
    this.setState({ open: true, title, content });
    this.onValidate = onValidate;
    this.onCancel = onCancel;
  }

  componentDidMount() {
    window.popup = this.openPopup;
  }

  handleClose = () => {
    this.onValidate = null;
    this.onCancel = null;
    this.setState({ open: false });
  }

  handleCancel = () => {
    if (this.onCancel) this.onCancel();
    this.handleClose();
  }

  handleValidate = () => {
    if (this.onValidate) this.onValidate();
    this.handleClose();
  }

  render() {
    const { classes } = this.props;

    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleCancel}
        className={classes.popup}
        maxWidth={'lg'}
      >
        <DialogTitle className={classes.title}>{this.state.title}</DialogTitle>
        <DialogContent className={classes.content}>
          {this.state.content}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleValidate} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(style)(Popup);