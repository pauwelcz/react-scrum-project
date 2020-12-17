import { Grid, Paper, Typography } from "@material-ui/core"
import React from "react"
import { Category, Task } from "../utils/firebase"
import BoardCard from "./BoardCard"
import { Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'

type BoardColumnProps = {
    title: string,
    tasks: Task[],
    categories: Category[],
}

type BoardColumnContentStylesProps = {
  isDraggingOver: boolean
}

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

export const BoardColumn: React.FC<BoardColumnProps> = (props) => {
  return (
    <div>
      <ColumnWrapper>
        <Paper>
          <Grid container spacing={2} direction="column" justify="center" alignItems="center"
          style={{display: 'inline-block'}}>
            <Grid item>
              <Typography variant="h6">{props.title}</Typography>
            </Grid>

            <Droppable droppableId={props.title}>
              {(provided, snapshot) => (
                <ColumnContent
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                {props.tasks.map((task, i) => (
                    <Grid container item direction="column" style={{display: 'inline-block'}}>
                      <BoardCard task={task} category={task.category} index={i} key={task.id}/>
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
