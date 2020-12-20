import { Card, CardActions, CardContent, Checkbox, Container, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { FC, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useFetchAllUsers from '../hooks/useFetchAllUsers';
import useFetchProject from '../hooks/useFetchProject';
import { projectsCollection, UserItem } from '../utils/firebase';


const useStyles = makeStyles(theme => ({
  button: {
    variant: 'text',
    size: 'large',
  },
  listRoot: {
    width: '100%',
    minWidth: 60,
    backgroundColor: theme.palette.background.paper,
  },
}));

export type ManageUsersStateProps = {
  owner: UserItem,
  projectId: string,
}

const ManageUsersForm: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation<ManageUsersStateProps>();

  const project = useFetchProject(location.state.projectId);
  const users = useFetchAllUsers();
  const [checkedUsers, setCheckedUsers] = useState<Record<string, number>>({});

  /**
   * Prepopulate checkedUsers
   */
  useEffect(() => {
    const newChecked: Record<string, number> = {};
    project?.users.forEach(projectMemberId => {
      newChecked[projectMemberId] = 1;
    })
    setCheckedUsers((oldValue) => ({ ...oldValue, ...newChecked }));
  }, [project]);

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
  const handleUsersSubmit = async () => {
    if (location.state.projectId) {
      const newUsers = []
      for (const key in checkedUsers) {
        if (checkedUsers[key] === 1) newUsers.push(key)
      }
      await projectsCollection.doc(location.state.projectId).update({
        users: newUsers
      });
      history.push('/project-scrum', project?.id);
    }
  }

  return (
    <Container maxWidth="sm">
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
    </Container>
  );
};

export default ManageUsersForm;
