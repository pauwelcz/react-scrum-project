import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React, { FC, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { categoriesCollection, Category, projectsCollection, Task, tasksCollection, User } from '../utils/firebase';


const useStyles = makeStyles(theme => ({
  card: { height: '100%' },
  stars: { marginBottom: theme.spacing(2) },
  link: { textDecoration: 'none' },
}));

type ScrumProps = {
  name: string;
  note?: string;
  by: User;
  projectId: string;
}
/**
 * Componenta pro zobrazeni jednoho projektu
 */
// TODO: Editace projektu (passnuti "note", "name" a "by"? kvuli defaultnim hodnotam)
const ScrumCard: FC<ScrumProps> = ({ note, name, projectId: projectId, by }) => {
  const [error, setError] = useState<string>();

  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    tasksCollection.onSnapshot(
      snapshot => {
        const tasksFromFS: Task[] = snapshot.docs.map(doc => {
          const task: Task = doc.data();
          const id: string = doc.id;
          return { ...task, id: id }
        });
        setTasks(tasksFromFS);
      },
      err => setError(err.message),
    );
  }, []);

  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    categoriesCollection.onSnapshot(
      snapshot => {
        const categoriesFromFS: Category[] = snapshot.docs.map(doc => {
          const cat: Category = doc.data();
          const id: string = doc.id;
          return { ...cat, id: id }
        });
        setCategories(categoriesFromFS);
      },
      err => setError(err.message),
    );
  }, []);


  const deleteProject = () => {
    /**
     * Nejprve smazu tasky
     * Pote smazu kategorie
     * Pote smazu projekt
     */
    tasks.filter(item => item.project === projectId).map((task, i) => {
      tasksCollection.doc(task.id).delete();
    });

    categories.filter(item => item.project === projectId).map((cat, i) => {
      categoriesCollection.doc(cat.id).delete();
    });

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
        <IconButton onClick={() => deleteProject()}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

}

export default ScrumCard;