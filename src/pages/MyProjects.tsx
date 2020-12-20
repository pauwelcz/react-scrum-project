import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import ProjectItem from '../components/ProjectItem';
import useFetchProjectsForUsers from '../hooks/useFetchProjectsForUser';
import { Project, useLoggedInUser } from '../utils/firebase';

const MyProjects: FC = () => {
    const user = useLoggedInUser();
    const projects: Project[] = useFetchProjectsForUsers(user?.uid ?? '');

    return (
        <Container maxWidth='md'>
            <Typography variant="h4">My projects </Typography>
            <Grid container spacing={2}>
                {projects.map((project, i) => (
                    <Grid key={i} xs={12} item>
                        <ProjectItem project={project} />
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
