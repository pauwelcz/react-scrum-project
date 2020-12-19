import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import useFetchCategoriesForProject from '../hooks/useFetchCategoriesForProject';
import useFetchTasksForProject from '../hooks/useFetchTasksForProject';
import { categoriesCollection, Category, projectsCollection, Task, tasksCollection, User } from '../utils/firebase';


export type ScrumProps = {
  name: string;
  note: string;
  by: User;
  projectId: string;
}

const ScrumCard: FC<ScrumProps> = ({ note, name, projectId: projectId, by }) => {
  const categories: Category[] = useFetchCategoriesForProject(projectId);
  const tasks: Task[] = useFetchTasksForProject(projectId);
  /**
   * Delete iteratively because for collection delete, we would need to implement Cloud Functions
   */
  const onDelete = () => {
    tasks.map(task => tasksCollection.doc(task.id).delete());
    categories.map(cat => categoriesCollection.doc(cat.id).delete());
    projectsCollection.doc(projectId).delete();
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h5' color='textSecondary'>
          {name}
        </Typography>
        <Typography color='textSecondary'>
          {by.email}
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
          state: projectId
        }}>
          <Button variant='contained'>
            Show SCRUM
                    </Button>
        </Link>
        <Link to={{
          pathname: '/project',
          state: {
            projectId: projectId,
            name,
            note
          }

        }}>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Link>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

}

export default ScrumCard;