import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

const ProjectScrum: FC = () => {
    return (
        <>
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
        </>
    );
};

export default ProjectScrum;
