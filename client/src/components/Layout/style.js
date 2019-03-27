export default theme => ({
  root: {
    color: 'black',
    background: '#F2F2F2',
  },
  header: {
    height: theme.sizes.header.height,
    background: 'white',
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
    padding: '100px',
    width: '100%',
    position: 'relative',
  },
});