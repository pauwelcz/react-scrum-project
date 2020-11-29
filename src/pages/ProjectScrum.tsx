import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';

const ProjectScrum: FC = () => {
    return (
        <div>
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <Paper>                    
                    <Typography variant="h6">
                        TO DO
                    </Typography>
                </Paper>

            </Grid>
            <Grid item xs={6}>
                <Paper>
                    <Typography variant="h6">
                        IN PROGRESS
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper>
                    <Typography variant="h6">
                        TESTING
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper>
                    <Typography variant="h6">
                        DONE
                    </Typography>
                    
                
                </Paper>
                
            </Grid>
        </Grid>

            <Typography>
                Prostor pro trello
            </Typography>
            <Link to='/category' >
                <Button variant='contained'>
                    Add category
                </Button>
            </Link>

            <Link to='/task' >
                <Button variant='contained'>
                    Add task
                </Button>
            </Link>
        </div>
    );
};

export default ProjectScrum;
