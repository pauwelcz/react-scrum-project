import { Chip, Grid, makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import React, { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Category, Task } from '../utils/firebase';


const useStyles = makeStyles(() => ({
  preview: {
    overflow: "hidden",
    textAlign: 'left',
    fontSize: "60%",
    height: "3.7em",
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

type BoardCardProps = {
  task: Task,
  allCategories: Category[],
  index: number,
}

const BoardCard: FC<BoardCardProps> = ({ task, allCategories, index }) => {
  const classes = useStyles();


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
              "order": task.order,
            }
          }}>
            <Card elevation={10}>
              <CardContent>
                <Grid container item spacing={2} direction="column">
                  <Grid item>
                    <Typography variant="h6">{task.name}</Typography>
                  </Grid>
                  <Grid container item justify="center">
                    {task.category.map((cat, i) => (
                      <Chip
                        key={i}
                        size="small"
                        label={allCategories.find(item => item.id === cat)?.name}
                        style={{
                          backgroundColor: allCategories.find(item => item.id === cat)?.color,
                          color: 'black',
                          margin: 2,
                          padding: 5,
                          maxWidth: "90%",
                        }}
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