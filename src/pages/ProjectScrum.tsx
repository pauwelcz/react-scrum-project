import Button from '@material-ui/core/Button';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const ProjectScrum: FC = () => {

    return (
        <>
            <Link to='/category' >
                <Button>
                    Add category
                </Button>
            </Link>

            <Link to='/task' >
                <Button>
                    Add task
                </Button>
            </Link>
        </>
    );
};

export default ProjectScrum;
