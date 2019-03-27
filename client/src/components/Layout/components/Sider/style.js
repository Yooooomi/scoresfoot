export default theme => ({
  root: {
    padding: '50px 0',
    position: 'relative',
    background: theme.palette.primary.main,
    width: '100%',
  },
  container: {
    position: 'relative',
    width: '100%',
    transition: 'all 250ms',
    '&:hover': {
    transition: 'all 250ms',
    background: 'rgba(0.1, 0.1, 0.1, 0.1)',
    }
  },
  link: {
    width: '100%',
    color: 'white',
  },
});