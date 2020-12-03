import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, {FC, useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import {CardActions, CardContent, IconButton} from '@material-ui/core';
import {categoriesCollection, Category, Task, tasksCollection} from '../utils/firebase';
import Card from '@material-ui/core/Card/Card';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {makeStyles} from '@material-ui/core/styles';
import {BoardColumn} from '../components/BoardColumn';

const useStyles = makeStyles(theme => ({
  card: {height: '100%'},
}));

const ProjectScrum: FC = () => {
  const classes = useStyles();

  let location = useLocation();

  const [error, setError] = useState<string>();

  /**
   * Ziskani pole kategorii pro zobrazeni
   */
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesID, setCategoriesID] = useState<string[]>([]);

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
   * Ziskani pole tasku
   */
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksID, setTasksID] = useState<string[]>([]);
  useEffect(() => {
    tasksCollection.onSnapshot(
      snapshot => {
        setTasks(snapshot.docs.map(doc => doc.data()));
        setTasksID(snapshot.docs.map(doc => doc.id));
      },
      err => setError(err.message),
    );
  }, []);

  /**
   * Funkce pro mazani kategorie
   */
  const deleteCategory = (category_id: string) => {
    /**
     * Nejprve musim prepsat u tasku s danou kategorii polozku category na prazdny retezec
     */
    tasks.filter(item => item.category === category_id).forEach((r, i) => {
      tasksCollection.doc(tasksID[i]).update({
        category: ""
      });
    });

    categoriesCollection.doc(category_id).delete();
  }

  const filterTasksByPhase = (phase: string) => {
    return tasks.map(function (task, i) {
      return [task, tasksID[i]];
    }).filter(item => {
      const task = item[0] as Task;
      return task.phase === phase && task.project === location.state;
    })
  };

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item sm={3}>
          <BoardColumn title={"TO DO"} items={filterTasksByPhase("TO DO")}/>
        </Grid>
        <Grid item sm={3}>
          <BoardColumn title={"IN PROGRESS"} items={filterTasksByPhase("IN PROGRESS")}/>
        </Grid>
        <Grid item sm={3}>
          <BoardColumn title={"TESTING"} items={filterTasksByPhase("TESTING")}/>
        </Grid>
        <Grid item sm={3}>
          <BoardColumn title={"DONE"} items={filterTasksByPhase("DONE")}/>
        </Grid>
      </Grid>

      <Typography>
        Categories:
      </Typography>

      <Grid container spacing={1}>
        {categories.filter(category => category.project === location.state).map((r, i) => (
          <Grid key={i} xs={4} item>
            <Card className={classes.card}>
              <CardContent>
                <Typography>
                  {r.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={{
                  pathname: '/category',
                  state: {
                    "category_id": categoriesID[i],
                    "project": location.state,
                    "name": r.name,
                    "color": r.color,
                  }
                }}>
                  <IconButton>
                    <EditIcon/>
                  </IconButton>
                </Link>
                <IconButton onClick={() => deleteCategory(categoriesID[i])}>
                  <DeleteIcon/>
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
