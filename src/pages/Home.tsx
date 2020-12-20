import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import React, { FC } from 'react';
import example from '../images/example_image.png';

const useStyles = makeStyles((theme) => ({
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
                    you can conveniently create a SCRUM board so that
                    you have an overview when developing your projects, also with your colleagues.
                </Typography>
                <Typography variant="body1" paragraph={true} className={classes.typography}>
                    If you are interested, please register or log in (if you are not logged in) and then continue to the MY PROJECTS page for creating your SCRUM boards.
                
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
