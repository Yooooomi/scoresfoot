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
    display: 'flex',
    flexDirection: 'row',
  },
  sider: {
    display: 'flex',
    flex: 2,
    background: theme.palette.primary.main,
  },
  content: {
    display: 'flex',
    flex: 8,
    padding: '50px 100px',
    width: '100%',
    position: 'relative',
  },
  scoresfoot: {
    fontSize: '1.4em',
  }

});