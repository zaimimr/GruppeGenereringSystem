import {
  createStyles,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import Button from 'components/Button';
import Paper from 'components/Paper';
import { useSetGroups } from 'context/GroupsContext';
import React from 'react';
import { useModal } from 'react-modal-hook';
import MainCard from 'views/Invitation/components/MainCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      margin: 'auto 0',
    },
    dropZone: {
      paddingBottom: '10px',
    },
    listItem: {
      border: `1px solid ${theme.palette.text.primary}`,
      '&:first-child': {
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
      },
      '&:last-child': {
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
      },
    },
    listItemIcon: {
      marginLeft: 'auto',
      '&:hover': {
        cursor: 'pointer',
        color: theme.palette.error.dark,
      },
    },
  }),
);

export type InvitationProps = { title: string };

export type GroupType = {
  groupData: string[][];
  groupName: string;
  csvHeader: boolean;
  csvName: string;
  csvEmail: string;
};

function Invitation({ title }: InvitationProps) {
  const classes = useStyles();
  const [groups, setGroups] = useSetGroups();
  const [groupKey, setGroupKey] = React.useState(0);

  const [showModal, hideModal] = useModal(
    () => (
      <Dialog aria-labelledby='modal' fullWidth maxWidth={'xs'} onClose={hideModal} open>
        <DialogTitle id='modal-title'>{'Ønsker du å slette gruppe ' + groups[groupKey]?.groupName + '?'}</DialogTitle>
        <DialogActions>
          <Grid container direction={'row-reverse'} justify={'space-between'} spacing={4}>
            <Grid item md={5} xs={12}>
              <Button
                fullWidth
                label='Slett gruppe'
                onClick={() => {
                  setGroups([...groups.slice(0, groupKey), ...groups.slice(groupKey + 1, groups.length)]);
                  hideModal();
                }}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Button fullWidth label='Ikke slett' link onClick={hideModal} />
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    ),
    [groups, groupKey],
  );

  return (
    <>
      <Typography gutterBottom variant='h3'>
        {title}
      </Typography>
      <Grid container direction={'row-reverse'} justify={'space-between'} spacing={4}>
        <Grid container direction={'column'} item md={3} spacing={4}>
          <Grid item>
            <Paper>
              <Grid container item spacing={4}>
                <Grid item xs={12}>
                  <Button fullWidth label='Send Invitasjon' onClick={() => null} />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth label='Gå tilbake' link onClick={() => null} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            {groups.length !== 0 && (
              <Paper>
                <Typography gutterBottom variant='h5'>
                  Grupper
                </Typography>
                <List disablePadding>
                  {groups?.map((group: { groupName: string }, key: number) => (
                    <ListItem className={classes.listItem} key={key}>
                      <ListItemText primary={group.groupName} />
                      <ListItemIcon>
                        <DeleteOutline
                          className={classes.listItemIcon}
                          color={'error'}
                          onClick={() => {
                            setGroupKey(key);
                            showModal();
                          }}
                        />
                      </ListItemIcon>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>
        </Grid>
        <Grid item md={9} xs={12}>
          <MainCard />
        </Grid>
      </Grid>
    </>
  );
}

export default Invitation;
