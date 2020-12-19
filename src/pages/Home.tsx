import Typography from '@material-ui/core/Typography';
import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import example from '../images/example_image.jpg'

const useStyles = makeStyles(theme => ({
    link: { textDecoration: 'none' },
}));
// Homepage is out tic-tac-toc game
const Home: FC = () => {
    const classes = useStyles();

    return(
    <div>
        <Typography variant="body1" paragraph={true}>
            We would like to introduce you to our website with which you can conveniently create a SCRUM table so that you have an overview when developing your projects. If you are interested, please continue to the <Link className={classes.link} to='/my-projects'>my projects</Link> page.
        </Typography>
        <img src={example} alt="Example image" />
        <Typography variant="body2" paragraph={true}>
           Authors: Sedlář Pavel, Adam Radvan, Daša Kušniráková
        </Typography>
    </div>
    );
};

export default Home;
