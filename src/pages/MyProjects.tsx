import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import {Project, projectsCollection, useLoggedInUser } from '../utils/firebase';
import Grid from '@material-ui/core/Grid';
import ProjectItem from '../components/ProjectItem';

// Homepage is out tic-tac-toc game
const MyProjects: FC = () => {
    const user = useLoggedInUser();

    const [error, setError] = useState<string>();
    /**
     * Ziskani pole projektu
     */
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsID, setID] = useState<string[]>([]);
    useEffect(() => {
    projectsCollection.onSnapshot(
        snapshot => {
            setProjects(snapshot.docs.map(doc => doc.data()));
            setID(snapshot.docs.map(doc => doc.id));
        },
        err => setError(err.message),
    );
    }, []);

    return (
    <div>
        <Typography variant="h4">
            My projects
        </Typography>

        {projects.map((r, i) => (
            <Grid key={i} item>
                <ProjectItem note={r.note} name={r.name} project_id={projectsID[i]} author={r.by.email}/>
            </Grid>
        ))}
        <Link to={{
            pathname: '/project',
            state: ''
        }}> 
            <Button variant='contained'>Add new project</Button>
        </Link>
    </div>
    );
};

export default MyProjects;
