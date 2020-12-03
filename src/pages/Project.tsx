import React, { FC, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ReactMarkdown from 'react-markdown';

import { projectsCollection, useLoggedInUser, User } from '../utils/firebase';

const ProjectForm: FC = () => {

  const { push } = useHistory();
  const user = useLoggedInUser();
  const location = useLocation<{ projectId: string, name: string, note: string }>();
  const projectId = location.state.projectId;

  const [name, setName] = useState(location.state.name === undefined ? '' : location.state.name);
  const [note, setNote] = useState(location.state.note === undefined ? '' : location.state.note);
  const [error, setError] = useState<string>();

  /**
   * Podle toho, jaky je stav "projectId", funkce ulozi, nebo updatne novy projekt
   */
  // TODO: potreba zobrazeni puvodnich hodnot v textfieldu v pripade updatu
  const handleSubmitCreate = async () => {
    if (projectId === undefined) {
      try {
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
    } else {
      try {
        await projectsCollection.doc(projectId).set({
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
    }
  };

  /**
   * Zmena textu u tlacitka
   */
  const buttonName = () => {
    if (projectId === undefined) {
      return 'Create project';
    }
    return 'Update project';
  }

  return (
    <>
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
          <ReactMarkdown children={note} />

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
            onClick={handleSubmitCreate}
          >
            {buttonName()}
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default ProjectForm;
