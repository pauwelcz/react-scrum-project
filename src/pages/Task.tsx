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
import Grid from '@material-ui/core/Grid/Grid';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


const TaskForm: FC = () => {
  const [name, setName] = useState('');
  const [phase, setPhase] = useState('TO DO');
  const [error, setError] = useState<string>();
  const [category, setCategory] = useState('');

  const classes = useStyles();


  const { push } = useHistory();

  const user = useLoggedInUser();

  let location = useLocation();
  const project = "" + location.state

  const handleChangePhase = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPhase(event.target.value as string);
  };

  const handleChangeCategory = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCategory(event.target.value as string);
  };

  const handleSubmit = async () => {
    try {
      // TODO: Change this so reviews are saved under specific id
      // Call .add() and pass new Record as an argument
      // After awaiting previous call we can redirect back to /about page
      await tasksCollection.add({
        name,
        category,
        phase,
        project,
        by: {
          uid: user?.uid ?? '',
          email: user?.email ?? '',
        },
      });

      push('/project-scrum', "" + location.state);
    } catch (err) {
      setError(err.what);
    }
  };

  /**
   * Zobrazeni kategorii
   */
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesId, setCategoriesID] = useState<string[]>([]);
    // Pomoci tohoto ziskam idcka
    useEffect(() => {
    categoriesCollection.onSnapshot(
        snapshot => {
            setCategories(snapshot.docs.map(doc => doc.data()));
            setCategoriesID(snapshot.docs.map(doc => doc.id));

        },
        err => setError(err.message),
    );
    }, []);

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
                {categories.filter(category => category.project === project).map((r, i) => (
                    <FormControlLabel value={categoriesId[i]} control={<Radio />} label={r.name} />
                ))}         
              </RadioGroup>
        </FormControl>

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
          Create task
        </Button>
      </CardActions>
    </Card>
  );
};

export default TaskForm;
