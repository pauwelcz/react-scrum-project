import React, { FC, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
// import ReactMarkdown from 'react-markdown';
import { ColorPalette } from 'material-ui-color';


import { categoriesCollection, useLoggedInUser } from '../utils/firebase';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  button: {
    variant: 'text',
    size: 'large',
    color: theme.palette.primary.main,
  }
}));

/**
 * Stranka pro vytvareni kategorie
 */
const CategoryForm: FC = () => {
  const location = useLocation<{ categoryId: string, project: string, name: string, color: string }>();

  const [name, setName] = useState(location.state.name === undefined ? '' : location.state.name);
  const [color, setColor] = useState(location.state.color === undefined ? 'white' : location.state.color);
  const [error, setError] = useState<string>();

  const palette = {
    red: '#ff0000',
    blue: '#0000ff',
    green: '#00ff00',
    yellow: 'yellow',
    cyan: 'cyan',
    lime: 'lime',
    gray: 'gray',
    orange: 'orange',
    lightpurple: '#dd33fa',
    white: 'white',
    pink: 'pink',
    lightblue: 'lightblue',
  };

  const { push } = useHistory();
  const history = useHistory();
  const classes = useStyles();
  const user = useLoggedInUser();
  // Vicemene prevadim type "unknown" do stringu, aby jsem mohl dale pracovat s id projektu
  const project = location.state.project
  const categoryId = location.state.categoryId;

  /**
   * Ulozeni kategorie
   */
  const handleCategorySubmit = async () => {
    try {
      await categoriesCollection.doc(categoryId).set({
        id: categoryId,
        name,
        color,
        project,
        by: {
          uid: user?.uid ?? '',
          email: user?.email ?? '',
        },
      });

      push('/project-scrum', project);
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

        <Typography>
          Category color:
        </Typography>
        <ColorPalette palette={palette} onSelect={(e) => setColor(palette[e])} />

        <Chip
          size="small"
          label={name}
          style={{ backgroundColor: color, fontWeight: "bold" }}
        />
        {error && (
          <Typography variant='subtitle2' align='left' color='error' paragraph>
            <b>{error}</b>
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <Button className={classes.button} onClick={handleCategorySubmit}>
          {categoryId ? 'Update category' : 'Create category'}
        </Button>
        <Button className={classes.button} onClick={() => history.goBack()}>
          Back
        </Button>
      </CardActions>
    </Card>
  );
};

export default CategoryForm;
