import { Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React, { FC, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BoardColumn } from '../components/BoardColumn';
import { categoriesCollection, Category, Task, tasksCollection } from '../utils/firebase';

const useStyles = makeStyles(theme => ({
  card: { height: '100%' },
  listRoot: {
    width: '100%',
    minWidth: 120,
    backgroundColor: theme.palette.background.paper,
  },
  fabStyle: {
    minWidth: 350,
    margin: theme.spacing(5),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));


const ProjectScrum: FC = () => {
  const classes = useStyles();
  const [checked, setChecked] = useState<Record<string, number>>({});

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCategoryToDelete(null);
  }

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
  }, [location.state]);

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
  }, [location.state]);

  /**
   * Funkce pro mazani kategorie
   */
  const deleteCategory = (categoryId: string | undefined) => {
    if (!categoryId) return;
    /**
     * Nejprve musim prepsat u tasku s danou kategorii polozku category na prazdny retezec
     */
    for (const task of tasks) {
      const updatedCategory = task.category.filter(item => item !== categoryId)
      tasksCollection.doc(task.id).update({
        category: updatedCategory
      });
    }

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
      let newTasks: Task[] = []
      for (const task of tasks) {
        for (const categoryId of task.category) {
          if (categoryId in newChecked && newChecked[categoryId] === 1) {
            newTasks.push(task)
            break;
          }
        }
      }

      setFilteredTasks(newTasks)
      //(newChecked)
      //setFilteredTasks(tasks.filter(task => task.category in newChecked && newChecked[task.category] === 1));
    }
  };


  return (
    <div>
      <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={2}>
        <Grid item xs={12} sm={3}>
          <List className={classes.listRoot}>
            <ListSubheader>
              <Typography variant="h6">Categories</Typography>
              <Link to={{
                pathname: '/category',
                state: {
                  "project": location.state
                }
              }}>
                <IconButton edge="end">
                  <AddCircleOutlinedIcon />
                </IconButton>
              </Link>
              <Divider variant="middle" />
            </ListSubheader>
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

                  <ListItemSecondaryAction>
                    <Link to={{
                      pathname: '/category',
                      state: {
                        "categoryId": category.id,
                        "project": location.state,
                        "name": category.name,
                        "color": category.color,
                      }
                    }}>
                      <IconButton edge="end">
                        <EditIcon />
                      </IconButton>
                    </Link>
                    <IconButton edge="end" onClick={() => {
                      setCategoryToDelete(category);
                      handleOpenDialog();
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>

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

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogTitle id="alert-dialog-delete-category">{"Data deletion warning"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-delete-category-description">
            This action will permanently delete category: <b>{categoryToDelete?.name}</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            deleteCategory(categoryToDelete?.id);
            handleCloseDialog();
          }}
            color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>


      <Link to={{
        pathname: '/task',
        state: {
          "project": location.state
        }
      }}>
        <Fab size="large" variant="extended" color="primary" aria-label="add" className={classes.fabStyle}>
          <AddCircleOutlinedIcon className={classes.extendedIcon} />
          <Typography variant="h6">Add task</Typography>
        </Fab>
      </Link>

    </div>
  );
};

export default ProjectScrum;
