import { Box, Dialog, DialogActions, DialogTitle, Grid, makeStyles, Typography } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PeopleIcon from '@material-ui/icons/People';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import Button from 'components/Button';
import LoadingScreen from 'components/LoadingScreen';
import Paper from 'components/Paper';
import { useEvents } from 'context/EventContext';
import useSnackbar from 'context/SnakbarContext';
import dateFormat from 'dateformat';
import { Failure, Initial, LazyResult, Loading, Success } from 'lemons';
import React, { useEffect } from 'react';
import { useModal } from 'react-modal-hook';
import { useHistory, useParams } from 'react-router-dom';
import { deleteEvent, getEvents } from 'utils/axios';
import { Event as IEvent, IEventData } from 'utils/types';

const useStyles = makeStyles((theme) => ({
  icons: {
    marginRight: theme.spacing(2),
  },
  gutterBottom: {
    marginBottom: theme.spacing(1),
  },
}));

function Event() {
  const classes = useStyles();
  const { eventId }: { eventId: string } = useParams();
  const [submitFormLazy, setSubmitFormLazy] = React.useState<LazyResult<Error, IEventData>>(Initial());
  const history = useHistory();
  const { showSnackbar } = useSnackbar();
  const [events, setEvents] = useEvents();

  useEffect(() => {
    setSubmitFormLazy(Loading());
    if (events && events.length !== 0) {
      const newEvent = events.find((event: IEvent) => event.id === eventId);
      if (!newEvent) {
        setSubmitFormLazy(Failure(Error('Arrangementet finnes ikke')));
      } else {
        const dateFormated = dateFormat(newEvent.time, 'dd.mm.yyyy');
        const timeFormated = dateFormat(newEvent.time, 'HH:mm');
        const event = {
          title: newEvent.title,
          ingress: newEvent.ingress,
          description: newEvent.description,
          date: dateFormated,
          time: timeFormated,
          place: newEvent.place,
          filters: [
            {
              minimum: newEvent.minimumPerGroup,
              maximum: newEvent.maximumPerGroup,
            },
          ],
        };
        setSubmitFormLazy(Success(event));
      }
    }
    // eslint-disable-next-line
  }, [events, eventId]);

  const [showModal, hideModal] = useModal(
    () => (
      <Dialog aria-labelledby='modal' fullWidth maxWidth={'xs'} onClose={hideModal} open>
        <DialogTitle id='modal-title'>{'Ønsker du å slette arrangementet?'}</DialogTitle>
        <DialogActions>
          <Grid container direction={'row-reverse'} justify={'space-between'} spacing={4}>
            <Grid item md={5} xs={12}>
              <Button
                fullWidth
                label='Slett arrangement'
                onClick={() => {
                  deleteEvent(eventId)
                    .then(() => {
                      getEvents().then((res: { data: Event[] }) => {
                        setEvents(res.data);
                      });
                      showSnackbar('success', 'Arrangementet ble slettet');
                      history.push('/');
                    })
                    .catch((err) => {
                      showSnackbar('error', err.response?.message);
                    });
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
    [],
  );

  return (
    <>
      {submitFormLazy.dispatch(
        () => null,
        () => (
          <LoadingScreen message='Henter arrangement...' />
        ),
        () => (
          <Typography variant='h1'>Arrangementet er ikke funnet</Typography>
        ),
        (event) => (
          <>
            <Typography variant='h1'>{event.title}</Typography>
            <Grid container direction={'row-reverse'} justify={'space-between'} spacing={4}>
              <Grid container direction={'column'} item sm={4} spacing={4} xs={12}>
                <Grid item>
                  <Paper>
                    <Box className={classes.gutterBottom} display='flex'>
                      <EventIcon className={classes.icons} />
                      <Typography variant='subtitle1'>{event.date}</Typography>
                    </Box>
                    <Box className={classes.gutterBottom} display='flex'>
                      <WatchLaterIcon className={classes.icons} />
                      <Typography variant='subtitle1'>{event.time}</Typography>
                    </Box>
                    <Box className={classes.gutterBottom} display='flex'>
                      <LocationOnIcon className={classes.icons} />
                      <Typography variant='subtitle1'>{event.place}</Typography>
                    </Box>
                    <Box className={classes.gutterBottom} display='flex' pr={2}>
                      <PeopleIcon className={classes.icons} />
                      <Typography variant='subtitle1'>{`Minimum: ${event.filters[0].minimum}  Maksimum: ${event.filters[0].maximum}`}</Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper>
                    <Grid container spacing={4}>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          label='Start arrangementet'
                          onClick={() => {
                            history.push(`/event/${eventId}/invite`);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button fullWidth label='Endre arrangementet' onClick={() => null} />
                      </Grid>
                      <Grid item xs={12}>
                        <Button fullWidth label='Slett arrangement' link onClick={showModal} />
                      </Grid>
                      <Grid item xs={12}>
                        <Button fullWidth label='Gå til dashboard' link onClick={() => history.push('/')} />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
              <Grid container direction={'column'} item sm={8} spacing={4} xs={12}>
                <Grid item>
                  <Paper>
                    <Typography variant='h2'>{event.ingress}</Typography>
                    <Typography variant='body1'>{event.description}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </>
        ),
      )}
    </>
  );
}

export default Event;
