import { Grid, Paper, Typography } from "@material-ui/core"
import React from "react"
import { Task } from "../utils/firebase"
import BoardCard from "./BoardCard"


type Props = {
    title: string,
    items: (Task | string)[][],
  }

export const BoardColumn: React.FC<Props> = (props) => {
    return(
        <div>
            <Paper>     
            <Grid container spacing={2} direction="column" justify="center" alignItems="center">
                <Grid item>
                    <Typography variant="h6">{props.title}</Typography>
                </Grid>
                {/* list of tasks */}
                {props.items.map((item) => {
                    const task = item[0] as Task;
                    const id = item[1] as string;
                    return  <Grid container item direction="column">
                                <BoardCard key={id} name={task.name} note={task.note} project={task.project} 
                                    by={task.by} category={task.category} phase={task.phase} id={id}/>
                            </Grid>})
                }
            </Grid>
            </Paper>
        </div>
  )
}
