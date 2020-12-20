import { Card, CardActions, CardContent, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { ColorPalette } from 'material-ui-color';
import React, { FC, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { PALLETE } from '../utils/constants';
import { categoriesCollection, Category, CategoryReference, useLoggedInUser } from '../utils/firebase';
import * as FirestoreService from '../utils/firestore';


const useStyles = makeStyles((theme) => ({
  button: {
    variant: 'text',
    size: 'large',
    color: theme.palette.primary.main,
  },
  sectionTitle: {
    marginLeft: '10px',
  },
}));


/**
 * Stranka pro vytvareni kategorie
 */
const CategoryForm: FC = () => {
  document.title = 'Category editor';
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation<{ categoryId: string, project: string, name: string, color: string }>();

  const [name, setName] = useState(location.state.name ?? 'No name');
  const [color, setColor] = useState(location.state.color ?? PALLETE.lightblue);

  const user = useLoggedInUser();

  const handleCategorySubmit = async () => {
    if (user) {
      const categoryDoc: CategoryReference = location.state.categoryId ? categoriesCollection.doc(location.state.categoryId) : categoriesCollection.doc();
      const categoryToSave: Category = { id: categoryDoc.id, name, color, project: location.state.project, by: { uid: user.uid, email: user.email } };
      await FirestoreService.saveCategory(categoryToSave, user);
      history.push('/project-scrum', location.state.project);
    }
  };

  return (
    <Container maxWidth='sm'>
      <Card>
        <CardContent>
          <Typography variant='h4' gutterBottom>
            {location.state.categoryId ? 'Update category' : 'Create category'}
          </Typography>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <TextField
                label='Category name'
                name='name'
                fullWidth
                margin='normal'
                variant='outlined'
                value={name}
                onChange={e => {
                  const newValue: string = e.target.value;
                  if (newValue.length < 30) {
                    setName(newValue)
                  }
                }
                }
              />
            </Grid>

            <Grid container item alignItems='flex-start' direction='column'>
              <Typography variant='caption' color='textSecondary' className={classes.sectionTitle}>
                Category color
              </Typography>

              <ColorPalette palette={PALLETE} onSelect={(e) => setColor(PALLETE[e])} />
            </Grid>

            <Grid item>
              <Chip
                size="medium"
                label={name}
                style={{ backgroundColor: color, minWidth: 100 }}
              />
            </Grid>
          </Grid>
        </CardContent>

        <CardActions>
          <Button className={classes.button} onClick={handleCategorySubmit}>
            {location.state.categoryId ? 'Update category' : 'Create category'}
          </Button>
          <Button className={classes.button} onClick={() => history.goBack()}>
            Back
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default CategoryForm;
