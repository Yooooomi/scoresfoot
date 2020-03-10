export default theme => ({
  root: {
    padding: '25px 0px',
    position: 'relative',
    background: theme.palette.primary.main,
    width: '100%',
    textAlign: 'left',
    color: 'white',
  },
  link: {
    width: '100%',
    color: 'white',
  },
  linkContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
    transition: 'all 250ms',
    '&:hover': {
      transition: 'all 250ms',
      background: 'rgba(0.1, 0.1, 0.1, 0.1)',
    },
    textAlign: 'left',
    alignItems: 'center',
    padding: '10px 10px',
  },
  linkContainerHighlighted: {
    background: theme.palette.primary.light,
    '&:hover': {
      background: theme.palette.primary.light,
    }
  },
  icon: {
    color: 'white',
  },
});