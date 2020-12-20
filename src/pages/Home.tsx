import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import example from '../images/example_image.jpg';

const useStyles = makeStyles((theme) => ({
    link: { textDecoration: 'none' },
    typography: {
        color: theme.palette.primary.contrastText,
        textAlign: 'left',
    }
}));

const Home: FC = () => {
    const classes = useStyles();

    return (
        <div>
            <Typography variant="body1" paragraph={true} className={classes.typography}>
                
                    We would like to introduce you to our website with which
                    you can conveniently create a SCRUM table so that
                    you have an overview when developing your projects.
                
                    If you are interested, please continue to the <Link className={classes.link} to='/my-projects'>MY PROJECTS</Link> page.
                
            </Typography>
            <img src={example} alt="example" />
            <Typography variant="body2" paragraph={true} className={classes.typography}>
                Authors: Sedlář Pavel, Daša Kušniráková, Adam Radvan
        </Typography>
        </div>
    );
};

export default Home;
