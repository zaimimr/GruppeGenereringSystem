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
import LoadingScreen from 'components/LoadingScreen';
import Paper from 'components/Paper';
import { IParticipants, useSetCsvGroups, useSetParticipants } from 'context/EventContext';
import { Failure, Initial, Loading } from 'lemons';
import React from 'react';
import { useModal } from 'react-modal-hook';
import { useHistory, useParams } from 'react-router-dom';
import { sendInvitation } from 'utils/axios';
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
  const history = useHistory();
  const { eventId }: { eventId: string } = useParams();
  const classes = useStyles();
  const [csvGroups, setCsvGroups] = useSetCsvGroups();
  const [, setParticipants] = useSetParticipants();
  const [groupKey, setGroupKey] = React.useState(0);
  // eslint-disable-next-line new-cap
  const [submitFormLazy, setSubmitFormLazy] = React.useState(Initial());

  const [showModal, hideModal] = useModal(
    () => (
      <Dialog aria-labelledby='modal' fullWidth maxWidth={'xs'} onClose={hideModal} open>
        <DialogTitle id='modal-title'>{'Ønsker du å slette gruppe ' + csvGroups[groupKey]?.groupName + '?'}</DialogTitle>
        <DialogActions>
          <Grid container direction={'row-reverse'} justify={'space-between'} spacing={4}>
            <Grid item md={5} xs={12}>
              <Button
                fullWidth
                label='Slett gruppe'
                onClick={() => {
                  setCsvGroups([...csvGroups.slice(0, groupKey), ...csvGroups.slice(groupKey + 1, csvGroups.length)]);
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
    [csvGroups, groupKey],
  );

  const submit = () => {
    // eslint-disable-next-line new-cap
    setSubmitFormLazy(Loading());
    sendInvitation(csvGroups, eventId)
      .then(({ data }: { data: { participants: IParticipants[] } }) => {
        setParticipants(data.participants);
        history.push(`/${eventId}/filter`);
      })
      // eslint-disable-next-line
      .catch((err: any) => {
        // eslint-disable-next-line
        console.error(err);
        // eslint-disable-next-line new-cap
        setSubmitFormLazy(Failure(err.response.statusText));
      });
  };

  return (
    <>
      {submitFormLazy.dispatch(
        () => null,
        () => (
          <LoadingScreen message={'Sender mail til deltagerne...'} />
        ),
        (err) => (
          <div>
            <Typography color='error' variant='h1'>
              En feil har skjedd: {err}
            </Typography>
          </div>
        ),
        () => null,
      )}
      <Typography gutterBottom variant='h4'>
        {title}
      </Typography>
      <Grid container direction={'row-reverse'} justify={'space-between'} spacing={4}>
        <Grid container direction={'column'} item md={3} spacing={4}>
          <Grid item>
            <Paper>
              <Grid container item spacing={4}>
                <Grid item xs={12}>
                  <Button fullWidth label='Send Invitasjon' onClick={submit} />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth label='Gå tilbake' link onClick={() => null} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            {csvGroups.length !== 0 && (
              <Paper>
                <Typography gutterBottom variant='h5'>
                  Grupper
                </Typography>
                <List disablePadding>
                  {csvGroups?.map((group: { groupName: string }, key: number) => (
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
