import { createMuiTheme } from '@material-ui/core/styles/';

const shadow = '0px 0px 10px 0px rgba(0,0,0,0.09)';

export default createMuiTheme({
  palette: {
    primary: { main: '#2C3E4E', light: '#4195e0' },
    secondary: { main: '#5A5A66' },
    success: { main: 'rgb(119, 216, 67)' },
    error: { main: 'rgb(255, 81, 81)' }
  },
  sizes: {
    header: {
      height: '7vh',
    },
  },
  shadows: [...Array(25).keys()].map(e => shadow),
  shape: {
    borderRadius: '0px',
  },
});