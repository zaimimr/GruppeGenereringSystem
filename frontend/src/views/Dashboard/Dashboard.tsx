import { CardActionArea, Grid, Typography } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import PlaceIcon from '@material-ui/icons/Place';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import { Skeleton } from '@material-ui/lab';
import Button from 'components/Button';
import Paper from 'components/Paper';
import TextField from 'components/TextField';
import { useEvents } from 'context/EventContext';
import dateFormat from 'dateformat';
import Fuse from 'fuse.js';
import { Failure, Loading, Success } from 'lemons';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Event } from 'utils/types';

export default function Dashboard() {
  const { control, watch } = useForm();
  const [submitFormLazy, setSubmitFormLazy] = React.useState(Loading());
  const history = useHistory();
  const [events] = useEvents();
  const searchFilter = watch('dashboardSearchField');

  const options = {
    includeScore: true,
    keys: ['title'],
  };

  React.useEffect(() => {
    if (events) {
      if (events.length === 0) {
        setSubmitFormLazy(Failure(events));
      } else {
        setSubmitFormLazy(Success(events));
      }
    } else {
      setSubmitFormLazy(Loading());
    }
  }, [events]);

  return (
    <>
      <Typography gutterBottom variant='h4'>
        Dashbord
      </Typography>
      <Grid container direction={'row-reverse'} justify={'space-between'} spacing={4}>
        <Grid container direction='column' item md={4}>
          <Grid item>
            <Paper>
              <Grid container item spacing={4}>
                <Grid item xs={12}>
                  <TextField control={control} error={null} fullWidth id='dashboard-search-field' label='Søk på tittel' name='dashboardSearchField' />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth label='Opprett et arrangement' onClick={() => history.push('/create')} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Grid container direction='column' item md={8} spacing={4}>
          {submitFormLazy.dispatch(
            () => null,
            () => (
              <Skeleton height={120} variant='rect' width={'100%'} />
            ),
            () => (
              <Typography color='error'>Ingen arrangementer funnet</Typography>
            ),
            () => (
              <>
                {events.length !== 0 &&
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  new Fuse(events, options).search(searchFilter || ' ').map((event: any) => <DashboardCard event={event.item} key={event.item.id} />)}
              </>
            ),
          )}
        </Grid>
      </Grid>
    </>
  );
}

const DashboardCard = ({ event }: { event: Event }) => {
  const history = useHistory();
  return (
    <Grid container item>
      <CardActionArea onClick={() => history.push(`/event/${event.id}`)}>
        <Paper>
          <Typography gutterBottom variant='h2'>
            {event.title}
          </Typography>
          <Grid container direction='row' item xs={12}>
            <Grid container item sm={9} spacing={2} xs={12}>
              <Grid item xs={12}>
                <Typography variant='body1'>{event.ingress}</Typography>
              </Grid>
              <IconText icon={<PlaceIcon />} text={event.place} xs={12} />
            </Grid>
            <Grid container item sm={3} spacing={2} xs={12}>
              <IconText icon={<EventIcon />} text={dateFormat(event.time, 'dd.mm.yyyy')} />
              <IconText icon={<WatchLaterIcon />} text={dateFormat(event.time, 'HH:MM')} />
            </Grid>
          </Grid>
        </Paper>
      </CardActionArea>
    </Grid>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IconText = ({ icon, text, xs = 6 }: { icon: React.ReactNode; text: string; xs?: any }) => {
  return (
    <Grid
      container
      item
      sm={12}
      spacing={2}
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
      xs={xs}>
      <Grid item>{icon}</Grid>
      <Grid item>
        <Typography>{text}</Typography>
      </Grid>
    </Grid>
  );
};
