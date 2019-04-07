import { createMuiTheme } from '@material-ui/core/styles/';

export default createMuiTheme({
  palette: {
    primary: { main: '#2B445A', light: '#4195e0' },
    secondary: { main: '#5A5A66' },
    success: { main: 'rgb(119, 216, 67)' },
    error: { main: 'rgb(255, 81, 81)' }
  },
  sizes: {
    header: {
      height: '7vh',
    }
  }
});