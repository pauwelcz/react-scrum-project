import { FC, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ReactMarkdown from 'react-markdown';


import { categoriesCollection, Category, tasksCollection, useLoggedInUser } from '../utils/firebase';
import { Checkbox, FormLabel, makeStyles, Radio, RadioGroup } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  taskButtons: {
    variant: 'text',
    size: 'large',
    color: theme.palette.primary.main,
  }
}));

/**
 * Stranka pro vytvareni tasku
 */
const TaskForm: FC = () => {
  const location = useLocation<{task_id: string, project: string, category: string, name: string, note: string, phase: string}>();

  const [name, setName] = useState(location.state.name === undefined ? '' : location.state.name);
  const [note, setNote] = useState(location.state.note === undefined ? '' : location.state.note);
  const [phase, setPhase] = useState(location.state.phase === undefined ? 'TO DO' : location.state.phase);
  const [error, setError] = useState<string>();
  const [category, setCategory] = useState(location.state.category === undefined ? '' : location.state.category);

  const classes = useStyles();

  const { push } = useHistory();
  const history = useHistory();

  const user = useLoggedInUser();

  const task_id = location.state.task_id;
  const project_id = location.state.project;

  const handleChangePhase = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPhase(event.target.value as string);
  };

  const handleChangeCategory = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCategory(event.target.value as string);
  };

  /**
   * Ulozeni tasku
   */
  const handleSubmit = async () => {
    if (task_id === undefined) { 
      try {
        await tasksCollection.add({
          name,
          category,
          phase,
          "project": project_id,
          by: {
            uid: user?.uid ?? '',
            email: user?.email ?? '',
          },
          note,
        });
  
        push('/project-scrum', project_id);
      } catch (err) {
        setError(err.what);
      }
    } else {
      try {
        await tasksCollection.doc(task_id).set({
          name,
          category,
          phase,
          "project": project_id,
          by: {
            uid: user?.uid ?? '',
            email: user?.email ?? '',
          },
          note,
        });
  
        push('/project-scrum', project_id);
      } catch (err) {
        
        setError(err.what);
      }
    }
    
  };

  /**
   * Zobrazeni kategorii
   */
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesId, setCategoriesID] = useState<string[]>([]);
    useEffect(() => {
    categoriesCollection.onSnapshot(
        snapshot => {
            setCategories(snapshot.docs.map(doc => doc.data()));
            setCategoriesID(snapshot.docs.map(doc => doc.id));

        },
        err => setError(err.message),
    );
    }, []);

  /**
   * Zmena textu u tlacitka
   */
  const buttonName = () => {
    if (task_id === undefined) {
      return 'Create task';
    } 
    return 'Update task';
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h4' gutterBottom>
          Add task:
        </Typography>
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

        <FormControl component="fieldset">
              <FormLabel component="legend">Categories</FormLabel>
              <RadioGroup aria-label="gender" name="gender1" value={category} onChange={handleChangeCategory}>
                {categories.filter(category => category.project === project_id).map((r, i) => (
                    <FormControlLabel value={categoriesId[i]} control={<Radio />} label={r.name} />
                ))}         
              </RadioGroup>
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
        <Button className={classes.taskButtons} onClick={handleSubmit}>{buttonName()}</Button>
        <Button className={classes.taskButtons} onClick={() => history.goBack()}>Back</Button>
      </CardActions>
    </Card>
  );
};

export default TaskForm;
