import { Grid, Paper, Typography } from "@material-ui/core"
import React from "react"
import { Task } from "../utils/firebase"
import BoardCard from "./BoardCard"


type Props = {
    title: string,
    items: (Task | string)[][],
  }

const getTask = (item: (Task | string)[]) => {
    return item[0] as Task;
}

const getId = (item: (Task | string)[]) => {
    return item[1] as string;
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
            {props.items.map((item: (Task | string)[], index: number) => 
            <Grid container item direction="column">
                <BoardCard key={index} name={getTask(item).name} note={getTask(item).note} project={getTask(item).project} 
                            by={getTask(item).by} category={getTask(item).category} phase={getTask(item).phase} id={getId(item)}/>
            </Grid>)
            }
            </Grid>
            </Paper>
        </div>
  )
}
