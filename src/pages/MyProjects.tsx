import { Fab } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import ProjectItem from '../components/ProjectItem';
import useFetchProjectsForUsers from '../hooks/useFetchProjectsForUser';
import { Project, useLoggedInUser } from '../utils/firebase';

const useStyles = makeStyles(theme => ({
  fabStyle: {
    minWidth: 350,
    margin: theme.spacing(5),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const MyProjects: FC = () => {
  const classes = useStyles();
    const user = useLoggedInUser();
    const projects: Project[] = useFetchProjectsForUsers(user?.uid ?? '');

    return (
        <Container maxWidth='md'>
          <Grid container direction="column">

              <Grid item>
                <Link to={{ pathname: '/project', state: '' }} style={{ textDecoration: 'none' }}>
                  {/* <Button variant='contained'>Add new project</Button> */}
                  <Fab size="large" variant="extended" color="primary"
                    aria-label="add project" className={classes.fabStyle}>
                    <AddCircleOutlinedIcon className={classes.extendedIcon} />
                    <Typography variant="h6">Add project</Typography>
                  </Fab>
                </Link>
              </Grid>

              <Grid container item spacing={2}>
                {projects.map((project, i) => (
                    <Grid item key={i} xs={12}>
                      <ProjectItem project={project} />
                    </Grid>
                ))}
              </Grid>
            </Grid>
      </Container>
  );
};

export default MyProjects;
