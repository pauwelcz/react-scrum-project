import { Card, CardActions, CardContent, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useHistory, useLocation } from 'react-router-dom';
import { Project, ProjectReference, projectsCollection, useLoggedInUser } from '../utils/firebase';
import * as FirestoreService from '../utils/firestore';


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
  },
  preview: {
    textAlign: 'left',
    fontSize: "65%",
  }
}));

export type ProjectFormStateProps = {
  id: string,
  name: string,
  note: string,
  users: string[],
}

const ProjectForm: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation<ProjectFormStateProps>();

  const user = useLoggedInUser();
  const [name, setName] = useState(location.state.name ?? '');
  const [note, setNote] = useState(location.state.note ?? '');

  const handleProjectSubmit = async () => {
    if (user) {
      const projectDoc: ProjectReference = location.state.id ? projectsCollection.doc(location.state.id) : projectsCollection.doc();
      const projectToSave: Project = { id: projectDoc.id, name, note, users: [user.uid], by: { uid: user.uid, email: user.email } };
      await FirestoreService.saveProject(projectToSave, user);
      history.push('/my-projects');
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Grid item lg={6}>
            <Typography variant='h4' gutterBottom>
              {location.state.id ? 'Update project' : 'Create project'}
            </Typography>
          </Grid>
          <Grid container spacing={6} direction="row">
            <Grid item lg={6}>
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
              <ReactMarkdown children={note} className={classes.preview} />
            </Grid>
          </Grid>
        </CardContent>

        <CardActions>
          <Button className={classes.button} onClick={handleProjectSubmit}>
            {location.state.id ? 'Update project' : 'Create project'}
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
