import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import example from '../images/example_image.jpg';

const useStyles = makeStyles(() => ({
    link: { textDecoration: 'none' },
}));

const Home: FC = () => {
    const classes = useStyles();

    return (
        <div>
            <Typography variant="body1" paragraph={true}>
                
                    We would like to introduce you to our website with which
                    you can conveniently create a SCRUM table so that
                    you have an overview when developing your projects.
                
                    If you are interested, please continue to the
                    <Link className={classes.link} to='/my-projects'>MY PROJECTS</Link> page.
                
            </Typography>
            <img src={example} alt="Example image" />
            <Typography variant="body2" paragraph={true}>
                Authors: Sedlář Pavel, Daša Kušniráková, Adam Radvan
        </Typography>
        </div>
    );
};

export default Home;
