import React, { FC, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { Button, Container } from '@material-ui/core';
import { Typography, TextField } from '@material-ui/core';
import { ReactComponent as Logo } from './logo.svg';
import { signIn, signUp, useLoggedInUser } from '../utils/firebase';

const Login: FC = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  // Since firebase returns informative error messages we can show them directly
  const [error, setError] = useState<string>();

  const isLoggedIn = useLoggedInUser();

  if (isLoggedIn) {
    return <Redirect to='/' />;
  }

  return (
    <Container maxWidth='sm'>
      <Card>
        <CardContent>
          <Logo width={100} />
          <Typography variant='h5' component='h1'>
            Sign in
          </Typography>
          <Typography variant='subtitle1'>Use your Account</Typography>
          <TextField
            label='Email'
            type='email'
            name='email'
            fullWidth
            autoComplete='email'
            margin='normal'
            variant='outlined'
            value={user}
            onChange={e => setUser(e.target.value)}
          />
          <TextField
            label='Password'
            type='password'
            name='password'
            fullWidth
            margin='normal'
            variant='outlined'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && (
            <Typography variant='subtitle2' align='left' color='error' paragraph>
              <b>{error}</b>
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            variant='text'
            size='large'
            // Handling promise with async/await
            onClick={async () => {
              try {
                await signUp(user, password);
              } catch (err) {
                setError(err.message);
              }
            }}
          >
            Create account
          </Button>
          <Button
            variant='text'
            size='large'
            // Handling promise with chained handlers
            onClick={() => signIn(user, password).catch(err => setError(err.message))}
          >
            Login
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default Login;
