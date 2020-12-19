import React, { FC } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { categoriesCollection, Category, Project, projectsCollection, Task, tasksCollection, useLoggedInUser, User } from '../utils/firebase';
import ReactMarkdown from 'react-markdown';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';

const useStyles = makeStyles(theme => ({
    preview: {
      overflow: "hidden",
      textAlign: 'left',
      fontSize: "65%",
      height: "10em",
    }
}));

export type ProjectItemProps = {
    id: string;
    name: string;
    note?: string;
    by: User;
    users: string[];
}
/**
 * Componenta pro zobrazeni jednoho projektu
 */
// TODO: Editace projektu (passnuti "note", "name" a "by"? kvuli defaultnim hodnotam)
const ProjectItem: FC<ProjectItemProps> = ({ note, name, id: projectId, by, users }) => {
    const user = useLoggedInUser();
    const [error, setError] = useState<string>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const classes = useStyles();

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
     * Ziskani ID kategorie
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

    /**
     * Funkce pro mazani projektu
     */
    const deleteProject = () => {
        /**
         * Nejprve smazu tasky
         * Pote smazu kategorie
         * Pote smazu projekt
         */
        tasks.filter(item => item.project === projectId).map((task, i) => {
            tasksCollection.doc(task.id).delete();
        });

        categories.filter(item => item.project === projectId).map((cat, i) => {
            categoriesCollection.doc(cat.id).delete();
        });

        projectsCollection.doc(projectId).delete();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant='h5' color='textSecondary'>
                    {name}
                </Typography>
                <Typography color='textSecondary'>
                    {`Last update by: ${by.email}`}
                </Typography>
                {note && (
                    <ReactMarkdown className={classes.preview}>
                        {note}
                    </ReactMarkdown>
                )}

            </CardContent>
            <CardActions>
                <Link style={{ textDecoration: 'none' }} to={{
                    pathname: '/project-scrum',
                    state: projectId
                }}>
                    <Button>
                        Show SCRUM
                    </Button>
                </Link>
                {(user?.uid === by.uid) && (
                    <>
                    <Link to={{
                        pathname: '/project',
                        state: {
                            projectId,
                            name,
                            note,
                            users
                        }

                    }}>
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                    </Link>
                    <IconButton onClick={() => deleteProject()}>
                        <DeleteIcon />
                    </IconButton>
                    </>
                )}
            </CardActions>
        </Card>
    );

}

export default ProjectItem;