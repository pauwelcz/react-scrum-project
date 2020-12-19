import React, { FC, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Card, CardContent, CardActions } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { ColorPalette } from 'material-ui-color';
import { PALLETE } from '../utils/constants';

import { categoriesCollection, CategoryReference, useLoggedInUser } from '../utils/firebase';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core';

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
  const location = useLocation<{ categoryId: string, project: string, name: string, color: string }>();

  const [name, setName] = useState(location.state.name ?? 'No name');
  const [color, setColor] = useState(location.state.color ?? PALLETE.lightblue);
  const [error, setError] = useState<string>();

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
      const categoryDoc: CategoryReference = categoryId ? categoriesCollection.doc(categoryId) : categoriesCollection.doc();

      await categoryDoc.set({
        id: categoryDoc.id,
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
      console.log(`[Category submit] Error occurred ${err.message}`);
      setError(err.what);
    }
  };


  return (
    <Container maxWidth='sm'>
      <Card>
        <CardContent>
          <Typography variant='h4' gutterBottom>
            {categoryId ? 'Update category' : 'Create category'}
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
                onChange={e => setName(e.target.value)}
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
                size="small"
                label={name}
                style={{ backgroundColor: color }}
              />
            </Grid>
            {error && (
              <Typography variant='subtitle2' align='left' color='error' paragraph>
                <b>{error}</b>
              </Typography>
            )}
          </Grid>
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
    </Container>
  );
};

export default CategoryForm;
