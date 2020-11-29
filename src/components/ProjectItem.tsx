import React, { FC } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { categoriesCollection, Category, Project, projectsCollection, Task, tasksCollection, useLoggedInUser } from '../utils/firebase';
import ReactMarkdown from 'react-markdown';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';

const useStyles = makeStyles(theme => ({
  card: { height: '100%' },
  stars: { marginBottom: theme.spacing(2) },
  link: { textDecoration: 'none' },
}));

export type Props = {
    name: string;
    note?: string;
    author: string | null;
    project_id: string;
}
const ProjectItem: FC<Props> = ({note, name, project_id, author}) => {
    const [error, setError] = useState<string>();

    /**
     * Ziskani ID tasku
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
     * Ziskani ID kategorie
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
     * Funkce pro mazani projektu
     */
    const deleteProject = () => {
        /**
         * Nejprve smazu tasky
         * Pote smazu kategorie
         * Pote smazu projekt
         */
        tasks.filter(item => item.project === project_id).map((r, i) => {
            tasksCollection.doc(tasksID[i]).delete();
        });

        categories.filter(item => item.project === project_id).map((r, i) => {
            categoriesCollection.doc(categoriesID[i]).delete();
        });

        projectsCollection.doc(project_id).delete();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant='h5' color='textSecondary'>
                    {name}
                </Typography>
                <Typography color='textSecondary'>
                    {author}
                </Typography>
                {note && (
                    <ReactMarkdown>
                        {note}
                    </ReactMarkdown>
                )}     
                
            </CardContent>
            <CardActions>   
                <Link to={{
                    pathname: '/project-scrum',
                    state: project_id
                }}>
                    <Button  variant='contained'>
                        Show SCRUM    
                    </Button>   
                </Link>
                <Link to={{
                    pathname: '/project',
                    state: project_id
                    
                }}>       
                    <IconButton>
                        <EditIcon />
                    </IconButton>
                </Link>
                <IconButton onClick={() => deleteProject()}>
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
        
}

export default ProjectItem;