import React, { FC } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';

import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { Project, projectsCollection, useLoggedInUser } from '../utils/firebase';
import ReactMarkdown from 'react-markdown';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  card: { height: '100%' },
  stars: { marginBottom: theme.spacing(2) },
  link: { textDecoration: 'none' },
}));

const ProjectItem: FC<Project> = ({name, by, note}) => {
    return (
        <Card>
            <CardContent>
                <Typography variant='h5' color='textSecondary'>
                    {name}
                </Typography>
                <Typography color='textSecondary'>
                    {by.email}
                </Typography>
                <ReactMarkdown>
                    Tady bude markdown
                </ReactMarkdown>
            </CardContent>
            <CardActions>   
                <Link to='/project-scrum'>
                    <Button>
                        Show SCRUM    
                    </Button>   
                </Link>         
                <IconButton>
                    <EditIcon />
                </IconButton>
                <IconButton onClick={() => {alert('you deleted')}}>
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
        
}

export default ProjectItem;