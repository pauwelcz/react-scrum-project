import { Card, CardActions, CardContent, FormControl, FormControlLabel, makeStyles, Radio, RadioGroup, TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip/Chip';
import Grid from '@material-ui/core/Grid';
import React, { FC, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useHistory, useLocation } from 'react-router-dom';
import DialogOpennerWrapper from '../components/DialogPopper';
import useFetchCategoriesForProject from '../hooks/useFetchCategoriesForProject';
import { Category, Task, TaskReference, tasksCollection, useLoggedInUser } from '../utils/firebase';
import * as FirestoreService from '../utils/firestore';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1.5),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    variant: 'text',
    size: 'large',
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
  },
}));

export type TaskStateProps = {
  taskId: string,
  project: string,
  category: string[],
  name: string,
  note: string,
  phase: string,
  order: number
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


  const handleCategoriesSelection = (catId: string) => {
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
      try {

        let taskOrder = taskId ? location.state.order : tasks.filter(task => task.project === projectId && task.phase === phase).length + 1;

        if (location.state.phase !== phase) {
          let taskOrderOriginal = taskOrder; // ulozeni puvodniho task orderu
          taskOrder = tasks.filter(task => task.project === projectId && task.phase === phase).length + 1;
          /**
           * Pri presunu do jine faze je potreba take updatnout poradi prvku, ktere za nimi, tudis dekrementovat o 1
           */
          const tasksToUpdate = tasks.filter(task => task.project === projectId && task.phase === location.state.phase && task.order > taskOrderOriginal)
          tasksToUpdate.forEach(task => {
            tasksCollection.doc(task.id).update({ order: task.order - 1 });
          })
        }

        const taskDoc: TaskReference = taskId ? tasksCollection.doc(taskId) : tasksCollection.doc();
        const taskToSave: Task = { id: taskDoc.id, name, note, phase, category: categoryIds, project: projectId, order: taskOrder, by: { uid: user.uid, email: user.email } };
        await FirestoreService.saveTask(taskToSave, user);
        history.push('/project-scrum', projectId);
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const handleTaskDelete = (id: string | undefined) => {
    if (!id) return;
    try {
      /**
       * Pri presunu do jine faze je potreba take updatnout poradi prvku, ktere za nimi, tudis dekrementovat o 1
       */
      let taskOrder = id ? location.state.order : tasks.filter(task => task.project === projectId && task.phase === phase).length + 1;
      const tasksToUpdate = tasks.filter(task => task.project === projectId && task.phase === location.state.phase && task.order > taskOrder)
      tasksToUpdate.map((task, i) => tasksCollection.doc(task.id).update({ order: task.order - 1 }))
    } catch (err) {
      console.log(`[Task delete] Error occurred ${err.message}`);
    }
    FirestoreService.deleteTask(id);
    history.push('/project-scrum', projectId);
  };

  /**
   * Zobrazeni tasku
   */
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    tasksCollection.onSnapshot(
      snapshot => {
        const taskFromFS: Task[] = snapshot.docs.map(doc => {
          const task: Task = doc.data();
          const id: string = doc.id;
          return { ...task, id: id }
        });
        setTasks(taskFromFS);
      },
      err => console.log(err.message),
    );
  }, []);

  return (
    <Card>
      <CardContent>
        <Grid item lg={6}>
          <Typography variant='h4' gutterBottom>
            {taskId ? 'Update task' : 'Create task'}
          </Typography>
        </Grid>
        <Grid container spacing={6} direction="row">
          <Grid item lg={6}>
            <TextField
              label='Task name'
              name='name'
              fullWidth
              margin='normal'
              variant='outlined'
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <FormControl className={classes.formControl} component="fieldset" fullWidth>
              <Typography variant='caption' color='textSecondary' align="left">
                Phase
              </Typography>
              <RadioGroup row
                aria-label="phase"
                name="phase-radio-group"
                value={phase}
                onChange={e => setPhase(e.target.value as string)}
              >
              <Grid container justify="center">
                <FormControlLabel value='TO DO' control={<Radio color="primary" />} label='TO DO' />
                <FormControlLabel value='IN PROGRESS' control={<Radio color="primary" />} label='IN PROGRESS' />
                <FormControlLabel value='TESTING' control={<Radio color="primary" />} label='TESTING' />
                <FormControlLabel value='DONE' control={<Radio color="primary" />} label='DONE' />
              </Grid>
              </RadioGroup>
            </FormControl>

            <FormControl margin="normal" fullWidth className={classes.categories}>
              <Typography variant='caption' color='textSecondary' align="left">
                Categories
              </Typography>
              <div>
                {categories.map((cat, i) => (
                  <Chip
                    key={i}
                    size="small"
                    label={cat.name}
                    clickable
                    onClick={() => handleCategoriesSelection(cat.id)}
                    className={classes.chip}
                    style={{
                      backgroundColor:`${changeChipColor(cat)}`,
                      color: 'black',
                      margin: 2,
                      padding: 5,
                      maxWidth: "50%",
                    }}
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
        <Button className={classes.button} onClick={handleTaskSubmit}>
          {taskId ? 'Update task' : 'Create task'}
        </Button>

        {(taskId) && <DialogOpennerWrapper
          message={<Typography>This action will permanently delete task: <b>{name}</b></Typography>}
          deleteCallback={() => handleTaskDelete(taskId)}
          openComponent={
            (openCallback) => (
              <Button className={classes.button} onClick={() => openCallback()}>
                Delete task
              </Button>
            )}
        />}

        <Button className={classes.button} onClick={() => history.goBack()}>
          Back
        </Button>
      </CardActions>
    </Card>
  );
};

export default TaskForm;
