import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { Project, projectsCollection, useLoggedInUser } from '../utils/firebase';
import Grid from '@material-ui/core/Grid';
import ProjectItem from '../components/ProjectItem';

/**
 * Zobrazeni "seznamu projektu"
 * prozatim nastaveno, ze se zobrazi projekty vsech
 */
const MyProjects: FC = () => {
    const user = useLoggedInUser();

    const [error, setError] = useState<string>();

    /**
     * Ziskani pole projektu (nevim jiste, jestli existuje jednodussi zpusob)
     */
    const [projects, setProjects] = useState<Project[]>([]);
    useEffect(() => {
        projectsCollection.onSnapshot(
            snapshot => {
                const projectsFromFS: Project[] = snapshot.docs.map(doc => {
                    const project: Project = doc.data();
                    const id: string = doc.id;
                    return { ...project, id: id }
                });
                setProjects(projectsFromFS);
            },
            err => setError(err.message),
        );
    }, []);

    return (
        <div>
            <Typography variant="h4">
                My projects
        </Typography>

            <Grid container spacing={1}>
                {projects.map((project, i) => (
                    <Grid key={i} xs={12} item>
                        {/**
                     * Predavam komponente hodnoty hlavne pro zachovani id projektu, ktere
                     * se vyuziva pri vytvareni kategorii a tasku v komponente (prace s databazi)
                     */}
                        <ProjectItem note={project.note} name={project.name} id={project.id} by={project.by} />
                    </Grid>
                ))}
            </Grid>
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
