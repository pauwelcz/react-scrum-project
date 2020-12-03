import { Grid, Paper, Typography } from "@material-ui/core"
import React from "react"
import { Task } from "../utils/firebase"
import BoardCard from "./BoardCard"


type BoardColumnProps = {
    title: string,
    tasks: Task[],
}

export const BoardColumn: React.FC<BoardColumnProps> = (props) => {
    return (
        <div>
            <Paper>
                <Grid container spacing={2} direction="column" justify="center" alignItems="center">
                    <Grid item>
                        <Typography variant="h6">{props.title}</Typography>
                    </Grid>
                    {/* list of tasks */}
                    {
                        props.tasks.map(task => {
                            return <Grid container item direction="column">
                                <BoardCard
                                    id={task.id}
                                    key={task.id}
                                    name={task.name}
                                    note={task.note}
                                    project={task.project}
                                    by={task.by}
                                    category={task.category}
                                    phase={task.phase}
                                />
                            </Grid>
                        })
                    }
                </Grid>
            </Paper>
        </div>
    )
}
