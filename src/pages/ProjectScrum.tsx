import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, { FC, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { CardActions, CardContent, IconButton, Paper } from '@material-ui/core';
import List from '@material-ui/core/List/List';
import ListSubheader from '@material-ui/core/ListSubheader/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import ListItem from '@material-ui/core/ListItem/ListItem';
import { categoriesCollection, Category, Task, tasksCollection } from '../utils/firebase';
import Card from '@material-ui/core/Card/Card';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';

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
            tasksCollection.doc(tasksID[i]).set({
                category: "",
                by: r.by,
                phase: r.phase,
                project: r.project,
                name: r.name,
                note: r.note
            });
        });

        categoriesCollection.doc(category_id).delete();
    }

    return (
        <div>
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <Paper>                    
                    <Typography variant="h6">
                        TO DO
                    </Typography>
                </Paper>

            </Grid>
            <Grid item xs={6}>
                <Paper>
                    <Typography variant="h6">
                        IN PROGRESS
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper>
                    <Typography variant="h6">
                        TESTING
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper>
                    <Typography variant="h6">
                        DONE
                    </Typography>
                    
                
                </Paper>
                
            </Grid>
        </Grid>

            <Typography>
                Prostor pro trello
            </Typography>

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
                        <IconButton onClick={() => alert('Update')}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteCategory(categoriesID[i])}>
                            <DeleteIcon />
                        </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
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
                        <IconButton onClick={() => alert('Update')}>
                            <EditIcon />
                        </IconButton>
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
                state: location.state
            }}>
                <Button variant='contained'>
                    Add category
                </Button>
            </Link>

                <Link to={{
                    pathname: '/task',
                    state: location.state
                }}>
                <Button variant='contained'>
                    Add task
                </Button>
            </Link>
        </div>
    );
};

export default ProjectScrum;
