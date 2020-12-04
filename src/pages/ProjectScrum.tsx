import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, { FC, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { CardActions, CardContent, Checkbox, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { categoriesCollection, Category, Task, tasksCollection } from '../utils/firebase';
import Card from '@material-ui/core/Card/Card';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import { BoardColumn } from '../components/BoardColumn';

const useStyles = makeStyles(theme => ({
  card: { height: '100%' },
  listRoot: {
    width: '100%',
    minWidth: 120,
    backgroundColor: theme.palette.background.paper,
  }
}));


const ProjectScrum: FC = () => {
  const classes = useStyles();
  const [checked, setChecked] = useState<Record<string, number>>({});
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
        setCategories(categoriesFromFS.filter(cat => cat.project === location.state));
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
        const tasksOfProject = tasksFromFS.filter(task => task.project === location.state);
        setTasks(tasksOfProject);
        setFilteredTasks(tasksOfProject);
        setChecked({});
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

  // tasks filtered with checkboxes
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const filterTasksByPhase = (phase: string) => {
    return filteredTasks.filter(task => task.phase === phase)
  };

  const handleCheckboxToggle = (category: Category) => () => {
    const currentValue: number = checked[category.id] ?? -1;
    const newChecked: Record<string, number> = { ...checked };

    newChecked[category.id] = currentValue === -1 ? 1 : -1;

    setChecked(newChecked);

    if (Object.entries(newChecked).filter((check: [string, number]) => check[1] === 1).length === 0) {
      setFilteredTasks(tasks); // all checkboxes are unchecked -> display all tasks
    } else {
      setFilteredTasks(tasks.filter(task => task.category in newChecked && newChecked[task.category] === 1));
    }
  };


  return (
    <div>
      <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={2}>
        <Grid item xs={12} sm={3}>
          <List className={classes.listRoot}>
            {categories.map((category: Category) => {
              const labelId = `checkbox-list-label-${category.name}`;

              return (
                <ListItem key={category.id} role={undefined} dense button onClick={handleCheckboxToggle(category)}>
                  <ListItemIcon>
                    <Checkbox
                      color="primary"
                      edge="start"
                      checked={checked[category.id] === 1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={<Typography color="textPrimary">{category.name}</Typography>} />
                </ListItem>
              );
            })}
          </List>
        </Grid>

        <Grid container item xs={12} sm={9} spacing={1}>
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
      </Grid>

      <Typography variant="h3">
        Categories:
      </Typography>

      <Grid container spacing={1}>
        {categories.map((cat, i) => (
          <Grid item key={i} xs={2} >
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
