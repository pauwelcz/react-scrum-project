import React, { FC, useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Draggable } from 'react-beautiful-dnd'
import { Chip, Grid, makeStyles } from '@material-ui/core';
import styled from 'styled-components';

import { categoriesCollection, Category, Task } from '../utils/firebase';

const useStyles = makeStyles(theme => ({
    preview: {
      overflow: "hidden",
      textAlign: 'left',
      fontSize: "60%",
      height: "3.5em",
    },
}));

type CardStylesProps = {
  isDragging: boolean
}

const CardElement = styled.div<CardStylesProps>`
  padding: 8px;
  background-color: ${(props) => props.isDragging ? '#ebebeb' : '#fff'};
  border-radius: 4px;
  transition: background-color .25s ease-out;

  &:hover {
    background-color: #f7fafc;
  }

  & + & {
    margin-top: 4px;
  }
`

type TaskProps = {
    task: Task,
    category: string[],
    index: number,
}

  
const BoardCard: FC<TaskProps> = ({ task, category, index }) => {
  /**
   * Ziskani pole kategorii pro zobrazeni
   */
    const [error, setError] = useState<string>();
    const [categories, setCategories] = useState<Category[]>([]);
    const classes = useStyles();

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
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <CardElement
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        isDragging={snapshot.isDragging}
        >
        <Link style={{ textDecoration: 'none' }} to={{
            pathname: '/task',
            state: {
              "taskId": task.id,
              "project": task.project,
              "phase": task.phase,
              "note": task.note,
              "name": task.name,
              "category": task.category,
            }}}>
          <Card elevation={10}>
            <CardContent>
              <Grid container item spacing={2} direction="column">
                <Grid item>
                  <Typography variant="h6">{task.name}</Typography>
                </Grid>
                <Grid container item justify="center">
                  {task.category.map((cat, i) => (
                    <Chip 
                      size="small" 
                      label={categories.find(item => item.id === cat)?.name} 
                      style={{backgroundColor: categories.find(item => item.id === cat)?.color }} 
                    />
                  ))}
                </Grid>
                  {task.note && (
                    <ReactMarkdown className={classes.preview}>
                      {task.note}
                    </ReactMarkdown>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Link>
        </CardElement>
      )}
    </Draggable>
  )
}

export default BoardCard;