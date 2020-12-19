import { Card, CardActions, CardContent, FormControl, makeStyles, TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip/Chip';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useHistory, useLocation } from 'react-router-dom';
import useFetchCategoriesForProject from '../hooks/useFetchCategoriesForProject';
import { Category, Task, TaskReference, tasksCollection, useLoggedInUser } from '../utils/firebase';
import * as FirestoreService from '../utils/firestore';



const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    fullWidth: 'true',
    display: 'flex',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    variant: 'text',
    size: 'large',
    color: theme.palette.primary.main,
  },
  preview: {
    textAlign: 'left',
    fontSize: "65%",
  },
  categories: {
    marginLeft: '10px',
  },
  chip: {
    margin: theme.spacing(0.5)
  }
}));

export type TaskStateProps = {
  taskId: string,
  project: string,
  category: string[],
  name: string,
  note: string,
  phase: string
}

const TaskForm: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation<TaskStateProps>();
  const projectId = location.state.project;
  const taskId = location.state.taskId;

  const user = useLoggedInUser();
  const categories: Category[] = useFetchCategoriesForProject(projectId);

  const [name, setName] = useState<string>(location.state.name ?? '');
  const [note, setNote] = useState<string>(location.state.note ?? '');
  const [phase, setPhase] = useState<string>(location.state.phase ?? 'TO DO');
  const [categoryIds, setCategoryIds] = useState<string[]>(location.state.category ?? []);


  /**
   * Select/unselect category
   */
  const handleTaskCategories = (catId: string) => {
    // category is not yet selected => insert into selected categories
    if (categoryIds.find(id => id === catId) === undefined) {
      setCategoryIds(oldIds => [...oldIds, catId])
    } else {
      // else remove it from selected categories
      setCategoryIds(selectedCategories => selectedCategories.filter(cat => cat !== catId))

    }
  }

  const changeChipColor = (cat: Category) => {
    if (categoryIds.find(item => item === cat.id) !== undefined) {
      return cat.color;
    }
    return "#dfe6e9";
  }


  const handleTaskSubmit = async () => {
    if (user) {
      const taskDoc: TaskReference = taskId ? tasksCollection.doc(taskId) : tasksCollection.doc();
      const taskToSave: Task = { id: taskDoc.id, name, note, phase, category: categoryIds, project: projectId, by: { uid: user.uid, email: user.email } };
      await FirestoreService.saveTask(taskToSave, user);
      history.push('/project-scrum', projectId);
    }
  };

  const handleTaskDelete = async () => {
    if (taskId) {
      FirestoreService.deleteTask(taskId);
      history.push('/project-scrum', projectId);
    }
  };


  return (
    <Card>
      <CardContent>
        <Grid item lg={6} direction="row">
          <Typography variant='h4' gutterBottom>
            {taskId ? 'Update task' : 'Create task'}
          </Typography>
        </Grid>
        <Grid container spacing={6} direction="row">
          <Grid item lg={6} direction="column" alignContent="flex-start">
            <TextField
              label='Task name'
              name='name'
              fullWidth
              margin='normal'
              variant='outlined'
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Phase</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={phase}
                onChange={e => setPhase(e.target.value as string)}
              >
                <MenuItem value={'TO DO'}>TO DO</MenuItem>
                <MenuItem value={'IN PROGRESS'}>IN PROGRESS</MenuItem>
                <MenuItem value={'TESTING'}>TESTING</MenuItem>
                <MenuItem value={'DONE'}>DONE</MenuItem>
              </Select>
            </FormControl>

            <FormControl margin="normal" fullWidth className={classes.categories}>
              <Typography variant='caption' color='textSecondary' align="left">
                Categories
              </Typography>
              <div>
                {categories.map((cat, i) => (
                  <Chip
                    size="small"
                    label={cat.name}
                    clickable
                    onClick={() => { handleTaskCategories(cat.id) }}
                    className={classes.chip}
                    style={{ backgroundColor: `${changeChipColor(cat)}` }}
                  />
                ))}
              </div>
            </FormControl>

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
        <Button className={classes.button} onClick={() => handleTaskSubmit()}>
          {taskId ? 'Update task' : 'Create task'}
        </Button>

        {(taskId) && <Button className={classes.button} onClick={() => handleTaskDelete()}>
          Delete task
          </Button>}

        <Button className={classes.button} onClick={() => history.goBack()}>
          Back
          </Button>
      </CardActions>
    </Card>
  );
};

export default TaskForm;
