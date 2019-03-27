export default theme => ({
  root: {
    padding: '50px 25px',
    position: 'relative',
    background: theme.palette.primary.main,
    width: '100%',
  },
  container: {
    position: 'relative',
    width: '100%',
    '&:hover': {
      background: 'lightgrey',
    }
  },
  link: {
    width: '100%',
    color: 'white',
  }
});