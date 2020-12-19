import React, { FC } from 'react';
import { BrowserRouter as Router, Link, Redirect, Route, Switch, } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, createMuiTheme, MuiThemeProvider, } from '@material-ui/core';

import './App.css';

import Login from './pages/Login';
import Notfound from './pages/NotFound';
import Home from './pages/Home';
import MyProjects from './pages/MyProjects';
import { signOut, useLoggedInUser } from './utils/firebase';
import ProjectForm from './pages/Project';
import ProjectScrum from './pages/ProjectScrum';
import CategoryForm from './pages/Category';
import TaskForm from './pages/Task';
import ManageUsersForm from './pages/ManageUsers';

// MUI theme override
const ourTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#9B61FF',
    },
    secondary: {
      main: '#F5A442',
    },
  },
});

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
    variant: 'outlined',
    color: 'secondary',
  },
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
        <AppBar color='primary' position='sticky' variant='outlined'>
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
            {user && (
              <>
                <Link className={classes.link} to='/my-projects'>
                  <Button className={classes.menuButton}>My Projects</Button>
                </Link>
                <Button className={classes.menuButton} onClick={signOut}>
                  Logout
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        {user === null && <Redirect to='/login' />}

        <main className='App'>
          <Container maxWidth='lg'>
            {/* Wait for user session */}
            {user === undefined ? (
              <CircularProgress />
            ) : (
                <Switch>
                  <Route path='/' exact component={Home} />
                  <Route path='/login' exact component={Login} />
                  <Route path='/my-projects' exact component={MyProjects} />
                  <Route path='/project' exact component={ProjectForm} />
                  <Route path='/category' exact component={CategoryForm} />
                  <Route path='/task' exact component={TaskForm} />
                  <Route path='/manage-users' exact component={ManageUsersForm} />
                  <Route path='/project-scrum' exact component={ProjectScrum} />
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
