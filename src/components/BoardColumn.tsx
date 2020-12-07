import { Grid, Paper, Typography } from "@material-ui/core"
import React from "react"
import { Category, Task } from "../utils/firebase"
import BoardCard from "./BoardCard"


type BoardColumnProps = {
    title: string,
    tasks: Task[],
    categories: Category[],
}

export const BoardColumn: React.FC<BoardColumnProps> = (props) => {
    return (
        <div>
            <Paper>
                <Grid container spacing={2} direction="column" justify="center" alignItems="center">
                    <Grid item>
                        <Typography variant="h6">{props.title}</Typography>
                    </Grid>
                    {
                        props.tasks.map(task => (
                            <Grid container item direction="column">
                                <BoardCard task={task} category={task.category} />
                            </Grid>
                        ))
                    }
                </Grid>
            </Paper>
        </div>
    )
}
