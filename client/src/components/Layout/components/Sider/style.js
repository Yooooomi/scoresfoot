export default theme => ({
  root: {
    padding: '18px 0',
    position: 'relative',
    background: theme.palette.primary.main,
    width: '100%',
  },
  link: {
    width: '100%',
    color: 'white',
  },
  search: {
    width: 'calc(100% - 30px)',
    margin: 'auto',
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
    padding: '10px 0',
  },
  linkContainerHighlighted: {
    background: theme.palette.primary.light,
    '&:hover': {
      background: theme.palette.primary.light,
    }
  },
  icon: {
    display: 'flex',
    flex: 2,
    width: '20%',
    justifyContent: 'center',
  },
  text: {
    display: 'flex',
    flex: 10,
    width: '80%',
  }
});