export default theme => ({
  root: {
    color: 'white',
    background: 'white',
  },
  header: {
    height: theme.sizes.header.height,
    background: theme.palette.secondary.main,
    lineHeight: theme.sizes.header.height,
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
    flex: 10,
    padding: '25px',
    width: '100%',
    position: 'relative',
  },
});