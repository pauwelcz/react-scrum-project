import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ReactMarkdown from 'react-markdown';

import { projectsCollection, useLoggedInUser } from '../utils/firebase';

const ProjectForm: FC = () => {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string>();

  const { push } = useHistory();

  const user = useLoggedInUser();

  const handleSubmit = async () => {
    try {
      // TODO: Change this so reviews are saved under specific id
      // Call .add() and pass new Record as an argument
      // After awaiting previous call we can redirect back to /about page
      await projectsCollection.add({
        name,
        note,
        by: {
          uid: user?.uid ?? '',
          email: user?.email ?? '',
        },
      });

      push('/my-projects');
    } catch (err) {
      setError(err.what);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant='h4' gutterBottom>
          Add project:
        </Typography>
        <TextField
          label='Project name'
          name='name'
          fullWidth
          margin='normal'
          variant='outlined'
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          label='Note'
          name='note'
          fullWidth
          multiline
          margin='normal'
          variant='outlined'
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <Typography variant='h5' gutterBottom>
            Preview note:
        </Typography>
        <ReactMarkdown children={note}/>
        
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
          color='primary'
          onClick={handleSubmit}
        >
          Create project
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProjectForm;
