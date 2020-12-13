import React, { FC, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Card, CardContent, CardActions } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ReactMarkdown from 'react-markdown';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import { ProjectReference, projectsCollection, useLoggedInUser } from '../utils/firebase';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    fullWidth: 'true',
    display: 'flex',
  },
  button: {
    variant: 'text',
    size: 'large',
    color: theme.palette.primary.main,
  },
  preview: {
    textAlign: 'left',
    fontSize: "65%",
  }
}));


const ProjectForm: FC = () => {

  const { push } = useHistory();
  const history = useHistory();
  const classes = useStyles();
  const user = useLoggedInUser();
  const location = useLocation<{ projectId: string, name: string, note: string }>();
  const projectId = location.state.projectId;

  const [name, setName] = useState(location.state.name ?? '');
  const [note, setNote] = useState(location.state.note ?? '');
  const [error, setError] = useState<string>();

  const handleProjectSubmit = async () => {
    try {
      const projectDoc: ProjectReference = projectId ? projectsCollection.doc(projectId) : projectsCollection.doc();
      await projectDoc.set({
        id: projectDoc.id,
        name,
        note,
        by: {
          uid: user?.uid ?? '',
          email: user?.email ?? '',
        },
      });

      push('/my-projects');
    } catch (err) {
      console.log(`[Project submit] Error occurred ${err.message}`);
      setError(err.what);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Grid item lg={6} direction="row">
            <Typography variant='h4' gutterBottom>
              {projectId ? 'Update project' : 'Create project'}
            </Typography>
          </Grid>
          <Grid container spacing={6} direction="row">
            <Grid item lg={6} direction="column" alignContent="flex-start">
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
            </Grid>
            <Grid container item lg={6} direction="column" alignItems="flex-start">
              <Typography variant='caption' color='textSecondary'>
                Note preview
              </Typography>
              <ReactMarkdown children={note} className={classes.preview}/>
              {error && (
                <Typography variant='subtitle2' align='left' color='error' paragraph>
                  <b>{error}</b>
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>

        <CardActions>
          <Button className={classes.button} onClick={handleProjectSubmit}>
            {projectId ? 'Update project' : 'Create project'}
          </Button>

          <Button className={classes.button} onClick={() => history.goBack()}>
          Back
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default ProjectForm;
