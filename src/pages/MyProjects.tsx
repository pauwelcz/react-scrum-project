import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { Project, projectsCollection, useLoggedInUser } from '../utils/firebase';
import Grid from '@material-ui/core/Grid';
import ProjectItem from '../components/ProjectItem';
import Container from '@material-ui/core/Container';
import useFetchProjectsForUsers from '../hooks/useFetchProjectsForUser';

const MyProjects: FC = () => {
    const user = useLoggedInUser();
    const projects: Project[] = useFetchProjectsForUsers(user?.uid ?? '');

    return (
        <Container maxWidth='md'>
            <Typography variant="h4">My projects </Typography>
            <Grid container spacing={2}>
                {projects.map((project, i) => (
                    <Grid key={i} xs={12} item>
                        <ProjectItem
                            note={project.note}
                            name={project.name}
                            id={project.id}
                            by={project.by}
                            users={project.users} />
                    </Grid>
                ))}
            </Grid>

            <Link to={{
                pathname: '/project',
                state: ''
            }}>
                <Button variant='contained'>Add new project</Button>
            </Link>
        </Container>
    );
};

export default MyProjects;
