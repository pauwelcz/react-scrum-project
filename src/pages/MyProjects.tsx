import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import {Project, projectsCollection, useLoggedInUser } from '../utils/firebase';
import Grid from '@material-ui/core/Grid';

// Homepage is out tic-tac-toc game
const MyProjects: FC = () => {
    
    const user = useLoggedInUser();

    const [error, setError] = useState<string>();
    const [projects, setProjects] = useState<Project[]>([]);
    useEffect(() => {
    // Call .onSnapshot() to listen to changes
    projectsCollection.onSnapshot(
        snapshot => {
        // Access .docs property of snapshot
        setProjects(snapshot.docs.map(doc => doc.data()));
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
            <Grid key={i} xs={12} sm={6} item>
                <Typography>
                    {i}
                </Typography>
            </Grid>
        ))}
        <Link to='/project'>
            <Button variant='contained'>Add new project</Button>
        </Link>
    </div>
    );
};

export default MyProjects;
