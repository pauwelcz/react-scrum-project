import { Checkbox, Chip, Divider, Fab, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListSubheader } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import React, { FC, useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Link, useLocation } from 'react-router-dom';
import { BoardColumn } from '../components/BoardColumn';
import DialogOpennerWrapper from '../components/DialogPopper';
import { useFetchCategoriesForProject } from '../hooks/useFetchCategoriesForProject';
import useFetchProject from '../hooks/useFetchProject';
import useFetchTasksForProject from '../hooks/useFetchTasksForProject';
import { categoriesCollection, Category, Project, Task, tasksCollection, useLoggedInUser } from '../utils/firebase';


const useStyles = makeStyles(theme => ({
  card: { height: '100%' },
  listRoot: {
    width: '100%',
    minWidth: 120,
    backgroundColor: theme.palette.background.paper,
  },
  fabStyle: {
    width: "90%",
    height: "3em",
    background: "#d6eaff",
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  link: {
    textDecoration: "none",
  }
}));

const filterTasksByPhase = (tasks: Task[], phase: string) => {
  return tasks.filter(task => task.phase === phase).sort((a, b) => a.order > b.order ? 1 : -1)
};

const ProjectScrum: FC = () => {
  const classes = useStyles();
  const location = useLocation<string>();
  const projectId = location.state ?? '';

  const user = useLoggedInUser();
  const tasks = useFetchTasksForProject(location.state);
  const categories: Category[] = useFetchCategoriesForProject(projectId);
  const project: Project | undefined = useFetchProject(projectId);

  const [checked, setChecked] = useState<Record<string, number>>({});

  // tasks filtered with checkboxes
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  useEffect(() => setFilteredTasks(tasks), [tasks]);


  /**
   * Funkce pro mazani kategorie
   */
  const handleDeleteCategory = (categoryId: string | undefined) => {
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
    }
  };

  // Handle drag & drop
  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result

    // Do nothing if item is dropped outside the list
    if (!destination) {
      return
    }

    // Do nothing if the item is dropped into the same place
    if (destination.droppableId === source.droppableId) {
      const sourceToChange = tasks.filter(task => task.project === projectId && task.phase === source.droppableId && task.order === source.index + 1)[0];
      const destinationToChange = tasks.filter(task => task.project === projectId && task.phase === destination.droppableId && task.order === destination.index + 1)[0];
      /**
       * V podstate vymenim hodnoty, funguje
       */
      try {
        // tasksCollection.doc(sourceToChange.id).update({ order: destinationToChange.order });
        if (source.index > destination.index) {
          //alert(`${destinationToChange.order}, ${sourceToChange.order}`)
          const sourceTasksToUpdate = tasks.filter(task => task.project === projectId && task.phase === source.droppableId && task.order >= destinationToChange.order && task.order < sourceToChange.order)
          sourceTasksToUpdate.forEach(task => {
            //alert(`Upravuji ${task.name} na pozici ${task.order + 1 }`)
            tasksCollection.doc(task.id).update({ order: task.order + 1 });
          })
          tasksCollection.doc(sourceToChange.id).update({ order: destinationToChange.order });
          //alert(`Upravuji ${sourceToChange.name} na pozici ${destinationToChange.order}`)
          // nejprve upravim index tasku
        } else if (destination.index > source.index) {
          const sourceTasksToUpdate = tasks.filter(task => task.project === projectId && task.phase === source.droppableId && task.order > sourceToChange.order && task.order <= destinationToChange.order)
          sourceTasksToUpdate.forEach(task => {
            //alert(`Upravuji ${task.name} na pozici ${task.order - 1 }`)
            tasksCollection.doc(task.id).update({ order: task.order - 1 });
          })
          tasksCollection.doc(sourceToChange.id).update({ order: destinationToChange.order });
          //alert(`Upravuji ${sourceToChange.name} na pozici ${destinationToChange.order}`)
          //alert(`${sourceToChange.name}, ${sourceToChange.order}, ${destinationToChange.order}`)
          //alert("jedu z vrchu dolu")
        }
      } catch (err) {
        console.log(err.message);
      }
    } else {
      /**
       * Je potreba zmenit indexy jak v source tak v destination
       */
      /**
       * Upravim source
       */
      const sourceTasksToUpdate = tasks.filter(task => task.project === projectId && task.phase === source.droppableId && task.order > source.index + 1)
      sourceTasksToUpdate.forEach(task => {
        //alert(`Upravuji ${task.name}, na pozici ${task.order - 1} ve ${task.phase}`)
        tasksCollection.doc(task.id).update({ order: task.order - 1 });
      })
      /**
       * Upravim destination
       */
      const destinationTasksToUpdate = tasks.filter(task => task.project === projectId && task.phase === destination.droppableId && task.order > destination.index)
      destinationTasksToUpdate.forEach(task => {
        //alert(`Upravuji ${task.name}, na pozici ${task.order + 1} ve ${task.phase}`)
        tasksCollection.doc(task.id).update({ order: task.order + 1 });
      })

      //alert(sourceToChange.order)
      let taskToChange = tasks.find(task => task.id === draggableId);
      if (taskToChange) {
        taskToChange.phase = destination.droppableId;
        try {
          //alert(`Upravuji ${taskToChange.name}, na pozici ${destination.index + 1} ve ${destination.droppableId}`)
          tasksCollection.doc(taskToChange.id).update({ phase: destination.droppableId, order: destination.index + 1 });
        } catch (err) {
          console.log(err.message);
        }
      }
    }
  }

  return (
    <div>
      <Grid container direction="row" justify="space-evenly" alignItems="flex-start" spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <List className={classes.listRoot}>
            <ListSubheader>
              <Grid container item spacing={2} direction="column">
                <Grid item>
                  <Link className={classes.link} to={{
                        pathname: '/task',
                        state: {
                          "project": location.state
                        }
                      }}>
                      <Fab variant="extended" aria-label="add task" className={classes.fabStyle}>
                        <AddCircleOutlinedIcon className={classes.extendedIcon} />
                        <Typography>Add task</Typography>
                      </Fab>
                    </Link>
                </Grid>

                <Grid item>
                  <Link className={classes.link} to={{
                    pathname: '/category',
                    state: {
                      "project": location.state
                    }
                  }}>
                    <Fab variant="extended" aria-label="add category" 
                        className={classes.fabStyle}>
                      <AddCircleOutlinedIcon className={classes.extendedIcon} />
                      <Typography>Add category</Typography>
                    </Fab>
                  </Link>
                </Grid>
                <Grid item>
                  {user && project && user.uid === project.by.uid && <Link className={classes.link} to={{
                    pathname: '/manage-users',
                    state: {
                      "projectId": location.state,
                      "owner": {
                        "uid": user.uid,
                        "email": user.email
                      }
                    }
                  }}>
                    <Fab variant="extended" aria-label="add users" className={classes.fabStyle}>
                      <PersonAddOutlinedIcon className={classes.extendedIcon} />
                      <Typography>Manage users</Typography>
                    </Fab>
                  </Link>
                  }
                </Grid>
              </Grid>

              <Grid item>
                <Typography variant="h6" color="textPrimary" style={{ marginTop: 40 }}>CATEGORIES</Typography>
                <Divider variant="middle" />
              </Grid>
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

                  <Chip
                    size="small"
                    label={category.name}
                    style={{
                      backgroundColor: category.color,
                      marginLeft: -25,
                      color: 'black',
                      margin: 2,
                      padding: 5,
                      maxWidth: "65%",
                    }}
                  />

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
                    <DialogOpennerWrapper
                      message={<Typography>This action will permanently delete category: <b>{category.name}</b></Typography>}
                      deleteCallback={() => handleDeleteCategory(category.id)}
                      openComponent={
                        (openCallback) => (
                          <IconButton edge="end" onClick={() => openCallback()}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Grid>

        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container item xs={12} sm={12} md={9} spacing={1}>
            <Grid item xs={12} sm={6} md={3}>
              <BoardColumn title={"TO DO"} tasks={filterTasksByPhase(filteredTasks, "TO DO")} categories={categories} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <BoardColumn title={"IN PROGRESS"} tasks={filterTasksByPhase(filteredTasks, "IN PROGRESS")} categories={categories} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <BoardColumn title={"TESTING"} tasks={filterTasksByPhase(filteredTasks, "TESTING")} categories={categories} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <BoardColumn title={"DONE"} tasks={filterTasksByPhase(filteredTasks, "DONE")} categories={categories} />
            </Grid>
          </Grid>
        </DragDropContext>
      </Grid>
    </div>
  );
};

export default ProjectScrum;
