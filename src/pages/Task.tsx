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
import { Checkbox, FormLabel, makeStyles } from '@material-ui/core';
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
  const category: never[] = []
  // const [category, setCategory] = useState('');
  const [error, setError] = useState<string>();

  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: false,
  });

  const classes = useStyles();


  const { push } = useHistory();

  const user = useLoggedInUser();

  let location = useLocation();
  const project = "" + location.state

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPhase(event.target.value as string);
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

  const { gilad, jason, antoine } = state;

  /**
   * Zobrazeni kategorii
   */
  const [categories, setCategories] = useState<Category[]>([]);
    // Pomoci tohoto ziskam idcka
    useEffect(() => {
    // Call .onSnapshot() to listen to changes
    categoriesCollection.onSnapshot(
        snapshot => {
            // Access .docs property of snapshot
            setCategories(snapshot.docs.map(doc => doc.data()));
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
            onChange={handleChange}
          >
            <MenuItem value={'TO DO'}>TO DO</MenuItem>
            <MenuItem value={'IN PROGRESS'}>IN PROGRESS</MenuItem>
            <MenuItem value={'TESTING'}>TESTING</MenuItem>
            <MenuItem value={'DONE'}>DONE</MenuItem>
          </Select>
        </FormControl>
        <Typography>
          Tady budu davat k dispozici kategorie
        </Typography>
        {categories.filter(category => category.project === project).map((r, i) => (
            <Grid key={i} item>
                {r.name}
            </Grid>
        ))}
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
