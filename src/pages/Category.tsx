import React, { FC, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ReactMarkdown from 'react-markdown';

import { categoriesCollection, useLoggedInUser } from '../utils/firebase';

const CategoryForm: FC = () => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  // const [project, setProject] = useState<string>(''); // potom vymazat
  const [error, setError] = useState<string>();

  const { push } = useHistory();
  let location = useLocation();
  const user = useLoggedInUser();
  const project = "" + location.state
  const handleSubmit = async () => {
    try {
      // TODO: Change this so reviews are saved under specific id
      // Call .add() and pass new Record as an argument
      // After awaiting previous call we can redirect back to /about page
      await categoriesCollection.add({
        name,
        color,
        project,
        by: {
          uid: user?.uid ?? '',
          email: user?.email ?? '',
        },
      });

      // Do project scrum poslu zaroven i location state
      push('/project-scrum', "" + location.state);
    } catch (err) {
      setError(err.what);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant='h4' gutterBottom>
          Add category:
        </Typography>
        <TextField
          label='Category name'
          name='name'
          fullWidth
          margin='normal'
          variant='outlined'
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          label='Color'
          name='color'
          fullWidth
          multiline
          margin='normal'
          variant='outlined'
          value={color}
          onChange={e => setColor(e.target.value)}
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
          color='primary'
          onClick={handleSubmit}
        >
          Create category
        </Button>
      </CardActions>
    </Card>
  );
};

export default CategoryForm;
