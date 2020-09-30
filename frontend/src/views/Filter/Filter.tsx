import { Grid, List, ListItem, Typography } from '@material-ui/core';
import Button from 'components/Button';
import Paper from 'components/Paper';
import TextField from 'components/TextField';
import { useSetParticipants } from 'context/EventContext';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import Table from 'views/Filter/components/Table';

export type FilterProps = { title: string };

type findParticipantType = { id: string };

function Filter({ title }: FilterProps) {
  const [participants] = useSetParticipants();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [joinedParticipants, setJoinedParticipants] = React.useState<any>([]);

  const { errors, handleSubmit, control, getValues } = useForm();

  const history = useHistory();
  const { eventId }: { eventId: string } = useParams();
  const SocketURL = process.env.REACT_APP_SOCKET_URL + '/connect/' + eventId + '?access_token=token';
  const { lastMessage } = useWebSocket(SocketURL);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isParticipantRegistered = joinedParticipants.find(({ id }: findParticipantType) => id === lastMessage?.data);
    if (!isParticipantRegistered) {
      const participant = participants.find(({ id }: findParticipantType) => id === lastMessage?.data);
      if (participant) {
        setJoinedParticipants([...joinedParticipants, participant]);
      }
    }
    // eslint-disable-next-line
  }, [lastMessage]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (formData: any) => {
    const data = {
      participants: joinedParticipants,
      filter: formData,
    };
    // eslint-disable-next-line
    console.log(data);
  };

  return (
    <>
      <Typography gutterBottom variant='h4'>
        {title}
      </Typography>
      <Grid container direction={'row-reverse'} justify={'space-between'} spacing={4}>
        <Grid container direction={'column'} item md={4} spacing={4}>
          <Grid item>
            <Paper>
              <Grid container item spacing={4}>
                <Grid container item justify='center' spacing={2} xs={12}>
                  <Grid item>
                    <Typography align={'right'} color='secondary'>
                      {joinedParticipants?.length + '/' + participants?.length}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography>har blitt med</Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth label='Generer grupper' onClick={handleSubmit(onSubmit)} type='submit' />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth label='Gå tilbake' link onClick={() => history.push(`/${eventId}`)} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <Typography gutterBottom variant='h5'>
                Filter
              </Typography>
              <List disablePadding>
                <form autoComplete='off' noValidate>
                  <FilterItems
                    control={control}
                    error={errors.max_per_group}
                    id='filter_max_per_group'
                    label='Max per gruppe'
                    name='max_per_group'
                    required='Påkrevd'
                    rules={{
                      min: {
                        value: 1,
                        message: 'Må være større enn 0',
                      },
                      validate: (value: number) => value >= getValues('min_per_group') || 'Max må være større eller lik Min',
                    }}
                  />
                  <FilterItems
                    control={control}
                    error={errors.min_per_group}
                    id='filter_min_per_group'
                    label='Min per gruppe'
                    name='min_per_group'
                    required='Påkrevd'
                    rules={{
                      min: {
                        value: 1,
                        message: 'Må være større enn 0',
                      },
                    }}
                  />
                </form>
              </List>
            </Paper>
          </Grid>
        </Grid>
        <Grid item md={8} xs={12}>
          <Table participantList={joinedParticipants} />
        </Grid>
      </Grid>
    </>
  );
}

type IFilterItems = {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: any;
};

const FilterItems = ({ id, name, label, type = 'number', control, error, required = undefined, rules }: IFilterItems) => {
  return (
    <ListItem>
      <TextField control={control} error={error} fullWidth id={id} label={label} name={name} required={required} rules={rules} type={type} />
    </ListItem>
  );
};

export default Filter;
