import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import useFetchCategoriesForProject from '../hooks/useFetchCategoriesForProject';
import useFetchTasksForProject from '../hooks/useFetchTasksForProject';
import { categoriesCollection, Category, Project, projectsCollection, Task, tasksCollection, useLoggedInUser } from '../utils/firebase';
import DialogOpennerWrapper from './DialogPopper';


const useStyles = makeStyles((theme) => ({
  preview: {
    overflow: "hidden",
    textAlign: 'left',
    fontSize: "65%",
    maxHeight: "9em",
  },
  typography: {
    color: theme.palette.primary.contrastText,
  },
}));

export type ProjectItemProps = {
  project: Project
}

const ProjectItem: FC<ProjectItemProps> = ({ project }) => {
  const classes = useStyles();
  const user = useLoggedInUser();

  const categories: Category[] = useFetchCategoriesForProject(project.id);
  const tasks: Task[] = useFetchTasksForProject(project.id);
  /**
   * Delete iteratively because for collection delete, we would need to implement Cloud Functions
   */
  const onProjectDelete = () => {
    tasks.map(task => tasksCollection.doc(task.id).delete());
    categories.map(cat => categoriesCollection.doc(cat.id).delete());
    projectsCollection.doc(project.id).delete();
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h5' className={classes.typography}>
          {project.name}
        </Typography>
        <Typography className={classes.typography}>
          {`Project owner: ${project.by.email}`}
        </Typography>
        {project.note && (
          <ReactMarkdown className={classes.preview}>
            {project.note}
          </ReactMarkdown>
        )}

      </CardContent>
      <CardActions>
        <Link style={{ textDecoration: 'none' }} to={{
          pathname: '/project-scrum',
          state: project.id
        }}>
          <Button>
            Show SCRUM
          </Button>
        </Link>

        {(user?.uid === project.by.uid) && (
          <div>
            {/* ProjectFormStateProps */}
            <Link to={{
              pathname: '/project',
              state: {
                id: project.id,
                name: project.name,
                note: project.note,
                users: project.users,
              }
            }}>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Link>

            <DialogOpennerWrapper
              message={<Typography >This action will permanently delete project: <b>{project.name}</b></Typography>}
              deleteCallback={() => onProjectDelete()}
              openComponent={
                (openCallback) => (
                  <IconButton edge="end" onClick={() => openCallback()}>
                    <DeleteIcon />
                  </IconButton>
                )}
            />
          </div>
        )}
      </CardActions>
    </Card>
  );

}

export default ProjectItem;