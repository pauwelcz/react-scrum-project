import { Grid, Paper, Typography } from "@material-ui/core"
import React from "react"
import { Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { Category, Task } from "../utils/firebase"
import BoardCard from "./BoardCard"


const ColumnWrapper = styled.div`
  flex: 1;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 5px;
`
const ColumnContent = styled.div<BoardColumnContentStylesProps>`
  background-color: ${props => props.isDraggingOver ? '#ebebeb' : null};
  border-radius: 5px;
`

type BoardColumnContentStylesProps = {
  isDraggingOver: boolean
}

type BoardColumnProps = {
  title: string,
  tasks: Task[],
  categories: Category[],
}

export const BoardColumn: React.FC<BoardColumnProps> = (props) => {
  return (
    <div>
      <ColumnWrapper>
        <Paper elevation={0}>
          <Grid container spacing={2} direction="column" justify="center" alignItems="center"
            style={{ display: 'inline-block' }}>
            <Grid item>
              <Typography variant="h6">{props.title}</Typography>
            </Grid>

            <Droppable droppableId={props.title} key={props.title}>
              {(provided, snapshot) => (
                <ColumnContent
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {props.tasks.map((task, i) => (
                    <Grid container item direction="column" key={task.id} style={{ display: 'inline-block' }}>
                      <BoardCard task={task} allCategories={props.categories} index={i} />
                    </Grid>
                  ))}
                  {provided.placeholder}
                </ColumnContent>
              )}
            </Droppable>
          </Grid>
        </Paper>
      </ColumnWrapper>
    </div>
  )
}
