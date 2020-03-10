export default theme => ({
  root: {
    width: '100%',
  },
  paper: {
    padding: '25px',
    marginBottom: '25px',
  },
  pronoScore: {
    fontSize: '1.4em',
  },
  win: {
    backgroundColor: theme.palette.success.main,
  },
  loss: {
    backgroundColor: theme.palette.error.main
  }
});