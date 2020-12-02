import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, { FC, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { CardActions, CardContent, IconButton, Paper } from '@material-ui/core';
import { categoriesCollection, Category, Task, tasksCollection } from '../utils/firebase';
import Card from '@material-ui/core/Card/Card';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip/Chip';
import { BoardColumn } from '../components/BoardColumn';

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
        tasks.filter(item => item.category === category_id).map((r, i) => {
            tasksCollection.doc(tasksID[i]).update({
                category: ""
            });
        });

        categoriesCollection.doc(category_id).delete();
    }

    const filterTasksByPhase = (phase: string) => {
        return tasks.filter(item => item.phase === phase && item.project === location.state).map(function(task, i) {
            return [task, tasksID[i]];
          })
    }


    return (
        <div>
        <Grid container spacing={1}>
            <Grid item  sm={3}>
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
                Prostor pro trello
            </Typography>
            <Grid container spacing={1}>
                {tasks.filter(task => task.project === location.state).map((r, i) => (
                    <Grid xs={4} item>
                        <Paper elevation={3} square> 
                            <Typography variant="h6">
                                {r.name}
                            </Typography>
                            <Typography variant="caption" align="left">
                                {r.by.email}
                            </Typography>
                            <Chip 
                                size="small"
                                label ="Kategorie"
                                color="primary"
                            />
                        </Paper>
                    </Grid>
                ))}
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
                                <EditIcon />
                            </IconButton>
                        </Link>
                        <IconButton onClick={() => deleteCategory(categoriesID[i])}>
                            <DeleteIcon />
                        </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
            ))}

            {}
            </Grid>
            <Typography>
                Tasks:
            </Typography>
            <Grid container spacing={1}>

            {tasks.filter(task => task.project === location.state).map((r, i) => (
                <Grid key={i} xs={4} item>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography>
                                {r.name}
                            </Typography>
                            <Typography>
                                {r.phase}
                            </Typography>


                        </CardContent>
                        <CardActions>
                            <Link to={{
                                pathname: '/task',
                                state: {
                                    "task_id": tasksID[i],
                                    "project": location.state,
                                    "phase": r.phase,
                                    "note": r.note,
                                    "name": r.name,
                                    "category": r.category,
                                }
                            }}>
                                <IconButton>
                                    <EditIcon />
                                </IconButton>
                            </Link>
                        <IconButton onClick={() => tasksCollection.doc(tasksID[i]).delete()}>
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
