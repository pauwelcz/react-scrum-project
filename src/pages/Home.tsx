import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import example from '../images/example_image.png';

const useStyles = makeStyles((theme) => ({
    link: { 
        textDecoration: 'none',
        color: theme.palette.primary.contrastText,
    },
    typography: {
        color: theme.palette.primary.contrastText,
        textAlign: 'left',
    },
    media: {
        display: 'flex',
        height: 300,
        width: '60%',
    },
}));

const Home: FC = () => {
    const classes = useStyles();

    return (
        <Card >      
            <CardContent>
                <Typography variant="body1" paragraph={true} className={classes.typography}>
                
                    We would like to introduce you to our website with which
                    you can conveniently create a SCRUM table so that
                    you have an overview when developing your projects.
                
                    If you are interested, please continue to the <Link className={classes.link} to='/my-projects'>MY PROJECTS</Link> page.
                
                </Typography>
                <div style={{ display:'flex', justifyContent:'center' }}>
                <CardMedia 
                    className={classes.media}
                    image={example}
                    title="Example project"
                />
                </div>
                <Typography variant="body2" paragraph={true} className={classes.typography}>
                    Authors: Sedlář Pavel, Daša Kušniráková, Adam Radvan
                </Typography>
            </CardContent>                
        </Card>
    );
};

export default Home;
