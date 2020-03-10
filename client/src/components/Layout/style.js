export default theme => ({
  root: {
    color: 'black',
    background: '#F2F2F2',
  },
  header: {
    textAlign: 'left',
    height: theme.sizes.header.height,
    background: 'white',
    lineHeight: theme.sizes.header.height,
    padding: '0px 25px',
  },
  container: {
    minHeight: '93vh',
    padding: '45px',
    paddingLeft: 'calc(280px + 45px)',
  },
  sider: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    width: '280px',
    background: theme.palette.primary.main,
  },
  scoresfoot: {
    height: theme.sizes.header.height,
    display: 'flex',
    alignItems: 'center',
    padding: '0px 25px',
    color: 'white',
    fontSize: '1.4em',
  }
});