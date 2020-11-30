import React, { FC, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ReactMarkdown from 'react-markdown';

import { categoriesCollection, useLoggedInUser } from '../utils/firebase';

/**
 * Stranka pro vytvareni kategorie
 */
const CategoryForm: FC = () => {
  const location = useLocation<{category_id: string, project: string, name: string }>();

  const [name, setName] = useState(location.state.name === undefined ? '' : location.state.name);
  const [color, setColor] = useState('');
  const [error, setError] = useState<string>();

  const { push } = useHistory();
  const user = useLoggedInUser();
  // Vicemene prevadim type "unknown" do stringu, aby jsem mohl dale pracovat s id projektu
  const project = location.state.project
  const category_id = location.state.category_id;

  /**
   * Ulozeni kategorie
   */
  const handleSubmit = async () => {
    if (category_id === undefined) {
      try {
        await categoriesCollection.add({
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
    } else {
      try {
        await categoriesCollection.doc(category_id).set({
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
    }
  };

  /**
   * Zmena textu u tlacitka
   */
  const buttonName = () => {
    if (category_id === undefined) {
      return 'Create category';
    } 
    return 'Update category';
  }

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
        <TextField
          label='Color'
          name='color'
          fullWidth
          multiline
          margin='normal'
          variant='outlined'
          value={color}
          onChange={e => setColor(e.target.value)}
        />

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
          {buttonName()}
        </Button>
      </CardActions>
    </Card>
  );
};

export default CategoryForm;
