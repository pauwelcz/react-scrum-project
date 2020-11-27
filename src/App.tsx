import React, { FC } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
} from 'react-router-dom';

import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core';

import './App.css';

import Login from './pages/Login';
import Notfound from './pages/NotFound';
import Home from './pages/Home';
import { signOut, useLoggedInUser } from './utils/firebase';

// MUI theme override
const ourTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#9B61FF',
    },
    secondary: {
      main: '#FFF861',
    },
  },
});

const useStyles = makeStyles(theme => ({
  menuButton: { marginRight: theme.spacing(2) },
  link: { textDecoration: 'none' },
}));

const App: FC = () => {
  // Styles
  const classes = useStyles();

  // Login state
  const user = useLoggedInUser();

  return (
    <MuiThemeProvider theme={ourTheme}>
      <Router>
        <AppBar color='primary' position='static' variant='outlined'>
          {/* Navigation rendered on all pages */}
          <Toolbar>
            <Link className={classes.link} to='/'>
              <Button className={classes.menuButton}>Home</Button>
            </Link>
            {user === null && (
              <Link className={classes.link} to='/login'>
                <Button className={classes.menuButton}>Login</Button>
              </Link>
            )}
          </Toolbar>
        </AppBar>

        {user === null && <Redirect to='/login' />}
        
        <main className='App'>
          <Container maxWidth='sm'>
            {/* Wait for user session */}
            {user === undefined ? (
              <CircularProgress />
            ) : (
              <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/login' exact component={Login} />
                <Route component={Notfound} />
              </Switch>
            )}
          </Container>
        </main>
      </Router>
    </MuiThemeProvider>
  );
};

export default App;
