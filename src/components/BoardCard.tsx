import React, { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Link } from 'react-router-dom';
import { Chip } from '@material-ui/core';

import { User } from '../utils/firebase';

type Props = {
    name: string;
    note?: string;
    by: User;
    project: string;
    id: any;
    phase: string;
    category: string;
}


const BoardCard: FC<Props> = ({id, name, note, project, phase, by, category}) => {
    return (
        <Card elevation={10}> 
        <CardContent>
            <Typography variant="h6">{name}</Typography>
            {/* <Typography variant="caption" align="left">{by.email}</Typography> */}
            <Chip size="small" label="Kategorie" color="primary"/>
        </CardContent>
        <CardActions>
        <Link to={{
            pathname: '/task',
            state: {
                "task_id": id,
                "project": project,
                "phase": phase,
                "note": note,
                "name": name,
                "category": category,
            }}}>
            <IconButton>
                <MoreHorizIcon />
            </IconButton>
        </Link>
        </CardActions>
        </Card>
    )
}

export default BoardCard;