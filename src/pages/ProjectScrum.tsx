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
    const [categories, setCategories] = useState<Category[]>([]);
    // Pomoci tohoto ziskam idcka
    useEffect(() => {
    // Call .onSnapshot() to listen to changes
    categoriesCollection.onSnapshot(
        snapshot => {
            // Access .docs property of snapshot
            setCategories(snapshot.docs.map(doc => doc.data()));
        },
        err => setError(err.message),
    );
    }, []);
    
    const [tasks, setTasks] = useState<Task[]>([]);
    // Pomoci tohoto ziskam idcka
    useEffect(() => {
    // Call .onSnapshot() to listen to changes
    tasksCollection.onSnapshot(
        snapshot => {
            // Access .docs property of snapshot
            setTasks(snapshot.docs.map(doc => doc.data()));
        },
        err => setError(err.message),
    );
    }, []);

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
                        <IconButton onClick={() => alert('Delete')}>
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
                        <IconButton onClick={() => alert('Delete')}>
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
