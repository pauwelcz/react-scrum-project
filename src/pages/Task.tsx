import React from 'react';
import ReactMarkdown from 'react-markdown';

import { FC, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { categoriesCollection, Category, Task, TaskReference, tasksCollection, useLoggedInUser } from '../utils/firebase';

import { Card, CardContent, CardActions } from '@material-ui/core';
import { Typography, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { FormControl, makeStyles, Radio, RadioGroup } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Chip from '@material-ui/core/Chip/Chip';

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

/**
 * Stranka pro vytvareni tasku
 */
const TaskForm: FC = () => {
  const location = useLocation<{ taskId: string, project: string, category: string[], name: string, note: string, phase: string, order: number }>();

  const [name, setName] = useState(location.state.name === undefined ? '' : location.state.name);
  const [note, setNote] = useState(location.state.note === undefined ? '' : location.state.note);
  const [phase, setPhase] = useState(location.state.phase === undefined ? 'TO DO' : location.state.phase);
  const [error, setError] = useState<string>();
  /**
   * Vkladani kategorii do pole
   */
  const [category, setCategory] = useState<string[]>(location.state.category === undefined ? [] : location.state.category);
  const handleTaskCategories = (category_item: string) => {
    // nasla se kategorie
    if (category.find(item => item === category_item) !== undefined) {
      try {
        setCategory(category.filter(item => item !== category_item))
      } catch (err) {
        setError(err.what);
      }
    } else {
      try {
        setCategory(category => [...category, category_item])
      } catch (err) {
        setError(err.what);
      }
    }
  }

  const changeChipColor = (category_item: Category) => {
    if (category.find(item => item === category_item.id) !== undefined) {
      return category_item.color;
    }
    return "#dfe6e9";
  }

  const classes = useStyles();

  const { push } = useHistory();
  const history = useHistory();

  const user = useLoggedInUser();

  const taskId = location.state.taskId;
  const projectId = location.state.project;

  const handleChangePhase = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPhase(event.target.value as string);
  };

  /**
   * Ulozeni tasku
   */
  const handleTaskSubmit = async () => {
    try {
      const taskDoc: TaskReference = taskId ? tasksCollection.doc(taskId) : tasksCollection.doc();

      let taskOrder = taskId ?  location.state.order : tasks.filter(task => task.project === projectId && task.phase === phase).length + 1; 

      if (location.state.phase !== phase) {
        let taskOrderOriginal = taskOrder; // ulozeni puvodniho task orderu
        taskOrder = tasks.filter(task => task.project === projectId && task.phase === phase).length + 1;
        /**
         * Pri presunu do jine faze je potreba take updatnout poradi prvku, ktere za nimi, tudis dekrementovat o 1
         */
        const tasksToUpdate = tasks.filter(task => task.project === projectId && task.phase === location.state.phase && task.order > taskOrderOriginal)
        tasksToUpdate.map((task, i) => {
          tasksCollection.doc(task.id).update({ order: task.order - 1 });
        })
      }

      await taskDoc.set({
        id: taskDoc.id,
        name,
        category,
        phase,
        project: projectId,
        by: {
          uid: user?.uid ?? '',
          email: user?.email ?? '',
        },
        note,
        order: taskOrder,
      });

      push('/project-scrum', projectId);
    } catch (err) {

      setError(err.what);
    }
  };

  const handleTaskDelete = async () => {
    try {
      /**
       * Pri presunu do jine faze je potreba take updatnout poradi prvku, ktere za nimi, tudis dekrementovat o 1
       */
      let taskOrder = taskId ?  location.state.order : tasks.filter(task => task.project === projectId && task.phase === phase).length + 1;
      const tasksToUpdate = tasks.filter(task => task.project === projectId && task.phase === location.state.phase && task.order > taskOrder)
      tasksToUpdate.map((task, i) => {
        tasksCollection.doc(task.id).update({ order: task.order - 1 });
      })
      await tasksCollection.doc(taskId).delete();
      push('/project-scrum', projectId);
    } catch (err) {
      console.log(`[Task submit] Error occurred ${err.message}`);
      setError(err.what);
    }
  };

  /**
   * Zobrazeni kategorii
   */
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    categoriesCollection.onSnapshot(
      snapshot => {
        const categoriesFromFS: Category[] = snapshot.docs.map(doc => {
          const cat: Category = doc.data();
          const id: string = doc.id;
          return { ...cat, id: id }
        });
        setCategories(categoriesFromFS);
      },
      err => setError(err.message),
    );
  }, []);

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
      err => setError(err.message),
    );
  }, []);
  
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
                onChange={handleChangePhase}
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
            {categories.filter(category => category.project === projectId).map((cat, i) => (
              <Chip
                size="small"
                label={cat.name}
                clickable
                onClick={() => {handleTaskCategories(cat.id)}}
                className={classes.chip}
                style={{backgroundColor: `${changeChipColor(cat)}`}} 
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

            {error && (
              <Typography variant='subtitle2' align='left' color='error' paragraph>
                <b>{error}</b>
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>

      <CardActions>
        <Button className={classes.button} onClick={handleTaskSubmit}>
          {taskId ? 'Update task' : 'Create task'}
        </Button>

        {(taskId) && <Button className={classes.button} onClick={handleTaskDelete}>
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
