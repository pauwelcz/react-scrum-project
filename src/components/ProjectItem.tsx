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


const useStyles = makeStyles(() => ({
  preview: {
    overflow: "hidden",
    textAlign: 'left',
    fontSize: "65%",
    height: "10em",
  }
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
  const onDelete = () => {
    tasks.map(task => tasksCollection.doc(task.id).delete());
    categories.map(cat => categoriesCollection.doc(cat.id).delete());
    projectsCollection.doc(project.id).delete();
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h5' color='textSecondary'>
          {project.name}
        </Typography>
        <Typography color='textSecondary'>
          {`Project owner: ${project.by.email}`}
        </Typography>
        <Typography color='textSecondary'>
          {`Last update by: ${project.by.email}`}
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

            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
        )}
      </CardActions>
    </Card>
  );

}

export default ProjectItem;