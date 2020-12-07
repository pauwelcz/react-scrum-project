import React, { FC, useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Link } from 'react-router-dom';
import { Chip, makeStyles, Theme } from '@material-ui/core';

import { categoriesCollection, Category, Task } from '../utils/firebase';

type ColorProp = {
    color: string,
}

const useStyles = makeStyles<Theme, ColorProp>({
    colorPrimary: {
        backgroundColor: ({ color }) => color,
    },
});

type TaskProps = {
    task: Task,
    category: string[]
}


  
const BoardCard: FC<TaskProps> = ({ task, category }) => {
    // override css property of Chip, otherwise only 'primary'|'secondary' is allowed
    //const classes = useStyles({ color: category?.color ?? 'primary' });
  /**
   * Ziskani pole kategorii pro zobrazeni
   */
    const [error, setError] = useState<string>();

    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        categoriesCollection.onSnapshot(
        snapshot => {
            const categoriesFromFS: Category[] = snapshot.docs.map(doc => {
            const cat: Category = doc.data();
            const id: string = doc.id;
            return { ...cat, id: id }
            });
            setCategories(categoriesFromFS.filter(cat => cat.project === task.project));
        },
        err => setError(err.message),
        );
    }, []);

    return (
        <Card elevation={10}>

            <CardContent>
                <Typography variant="h6">{task.name}</Typography>
                {task.category.map((cat, i) => (
                    <Chip 
                    size="small" 
                    label={categories.find(item => item.id === cat)?.name} 
                    style={{backgroundColor: categories.find(item => item.id === cat)?.color }} 
                    />
                ))}
                {/* <Typography variant="caption" align="left">{task.by.email}</Typography> 
                <Chip size="medium" label={category?.name ?? 'Category'} className={classes.colorPrimary} />*/}
            </CardContent>

            <CardActions>
                <Link to={{
                    pathname: '/task',
                    state: {
                        "taskId": task.id,
                        "project": task.project,
                        "phase": task.phase,
                        "note": task.note,
                        "name": task.name,
                        "category": task.category,
                    }
                }}>
                    <IconButton>
                        <MoreHorizIcon />
                    </IconButton>
                </Link>
            </CardActions>
        </Card>
    )
}

export default BoardCard;