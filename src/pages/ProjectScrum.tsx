import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, { FC, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { CardActions, CardContent, IconButton } from '@material-ui/core';
import { categoriesCollection, Category, Task, tasksCollection } from '../utils/firebase';
import Card from '@material-ui/core/Card/Card';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import { BoardColumn } from '../components/BoardColumn';
// import { Category as CategoryIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  card: { height: '100%' },
}));

const ProjectScrum: FC = () => {
  const classes = useStyles();

  let location = useLocation();

  const [error, setError] = useState<string>();

  /**
   * Ziskani pole kategorii pro zobrazeni
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

  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    tasksCollection.onSnapshot(
      snapshot => {
        const tasksFromFS: Task[] = snapshot.docs.map(doc => {
          const task: Task = doc.data();
          const id: string = doc.id;
          return { ...task, id: id }
        });
        setTasks(tasksFromFS);
      },
      err => setError(err.message),
    );
  }, []);

  /**
   * Funkce pro mazani kategorie
   */
  const deleteCategory = (categoryId: string | undefined) => {
    if (!categoryId) return;
    /**
     * Nejprve musim prepsat u tasku s danou kategorii polozku category na prazdny retezec
     */
    tasks.filter(item => item.category === categoryId).forEach((task, i) => {
      tasksCollection.doc(task.id).update({
        category: ""
      });
    });

    categoriesCollection.doc(categoryId).delete();
  }

  const filterTasksByPhase = (phase: string) => {
    return tasks.filter(task => task.phase === phase && task.project === location.state)
  };

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item sm={3}>
          <BoardColumn title={"TO DO"} tasks={filterTasksByPhase("TO DO")} categories={categories} />
        </Grid>
        <Grid item sm={3}>
          <BoardColumn title={"IN PROGRESS"} tasks={filterTasksByPhase("IN PROGRESS")} categories={categories} />
        </Grid>
        <Grid item sm={3}>
          <BoardColumn title={"TESTING"} tasks={filterTasksByPhase("TESTING")} categories={categories} />
        </Grid>
        <Grid item sm={3}>
          <BoardColumn title={"DONE"} tasks={filterTasksByPhase("DONE")} categories={categories} />
        </Grid>
      </Grid>

      <Typography>
        Categories:
      </Typography>

      <Grid container spacing={1}>
        {categories.filter(category => category.project === location.state).map((cat, i) => (
          <Grid key={i} xs={4} item>
            <Card className={classes.card}>
              <CardContent>
                <Typography>
                  {cat.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={{
                  pathname: '/category',
                  state: {
                    "categoryId": cat.id,
                    "project": location.state,
                    "name": cat.name,
                    "color": cat.color,
                  }
                }}>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </Link>
                <IconButton onClick={() => deleteCategory(cat.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Link to={{
        pathname: '/category',
        state: {
          "project": location.state
        }
      }}>
        <Button variant='contained'>
          Add category
        </Button>
      </Link>

      <Link to={{
        pathname: '/task',
        state: {
          "project": location.state
        }
      }}>
        <Button variant='contained'>
          Add task
        </Button>
      </Link>
    </div>
  );
};

export default ProjectScrum;
