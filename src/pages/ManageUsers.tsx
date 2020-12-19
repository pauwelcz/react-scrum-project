import React from 'react';
import ReactMarkdown from 'react-markdown';

import { FC, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { categoriesCollection, Category, Project, ProjectReference, projectsCollection, TaskReference, tasksCollection, useLoggedInUser, UserItem, usersColection } from '../utils/firebase';

import { Card, CardContent, CardActions, List, ListSubheader, IconButton, ListItem, ListItemIcon, Checkbox, ListItemText } from '@material-ui/core';
import { Typography, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { FormControl, makeStyles, Radio, RadioGroup } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Chip from '@material-ui/core/Chip/Chip';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 50,
    fullWidth: 'true',
    display: 'flex',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    variant: 'text',
    size: 'large',
    color: theme.palette.primary.main,
  },
  preview: {
    textAlign: 'left',
    fontSize: "65%",
  },
  categories: {
    marginLeft: '10px',
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  listRoot: {
    width: '100%',
    minWidth: 60,
    backgroundColor: theme.palette.background.paper,
  },
}));

export type ManageUsersFormProps = {
  owner: UserItem,
  projectId: string,
}

const ManageUsersForm: FC = () => {
  const classes = useStyles();
  const [error, setError] = useState<string>();

  const history = useHistory();
  const location = useLocation<ManageUsersFormProps>();

  // { id1: 1/-1,  id2: 1/-1  ... }
  const [checkedUsers, setCheckedUsers] = useState<Record<string, number>>({});


  /**
   * Fetch current project
   */
  const [project, setProject] = useState<Project>();
  useEffect(() => {
    projectsCollection.doc(location.state.projectId).onSnapshot(doc => {
      setProject(doc.data());
    },
      err => setError(err.message),
    );
  }, [location.state]);

  /**
   * Fetch all users
   */
  const [users, setUsers] = useState<UserItem[]>([]);
  useEffect(() => {
    usersColection.onSnapshot(
      snapshot => {
        const usersFromFS: UserItem[] = snapshot.docs.map(doc => {
          const user: UserItem = doc.data();
          return { ...user }
        });
        setUsers(usersFromFS);
      },
      err => setError(err.message),
    );
  }, [location.state]);

  /**
   * Prepopulate checkedUsers
   */
  useEffect(() => {
    const newChecked: Record<string, number> = { ...checkedUsers };
    project?.users.forEach(projectMemberId => {
      newChecked[projectMemberId] = 1;
    })
    setCheckedUsers(newChecked);
  }, [project, users, checkedUsers]);

  /**
   * Handle change in checkbox status
   */
  const handleCheckboxToggleUser = (user: UserItem) => () => {
    const currentValue: number = checkedUsers[user.uid] ?? -1;
    const newChecked: Record<string, number> = { ...checkedUsers };
    newChecked[user.uid] = currentValue === -1 ? 1 : -1;
    setCheckedUsers(newChecked);
  };

  /**
   * Handle form submit
   */
  const projectDoc: ProjectReference = location.state.projectId ? projectsCollection.doc(location.state.projectId) : projectsCollection.doc();
  const handleUsersSubmit = async () => {
    const newUsers = []
    // alert(JSON.stringify(checkedUser))
    for (const key in checkedUsers) {
      if (checkedUsers[key] === 1) newUsers.push(key)
    }
    // alert(JSON.stringify(checkedUsers))
    await projectDoc.update({
      users: newUsers
    });
  }


  return (
    <Card>
      <CardContent>
        <Typography variant='h4' gutterBottom>Project members</Typography>
        <List className={classes.listRoot}>
          {users.filter(item => item.uid !== location.state.owner.uid).map((user: UserItem) => {
            const labelId = `checkbox-list-label-${user.uid}`;
            return (
              <ListItem key={user.uid} role={undefined} dense button onClick={handleCheckboxToggleUser(user)}>
                <ListItemIcon>
                  <Checkbox
                    color="primary"
                    edge="start"
                    checked={checkedUsers[user.uid] === 1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={<Typography color="textPrimary">{user.email}</Typography>} />
              </ListItem>
            )
          })}
        </List>
      </CardContent>

      <CardActions>
        <Button className={classes.button} onClick={handleUsersSubmit}>
          Save changes
        </Button>

        <Button className={classes.button} onClick={() => history.goBack()}>
          Back
        </Button>
      </CardActions>
    </Card>
  );
};

export default ManageUsersForm;
