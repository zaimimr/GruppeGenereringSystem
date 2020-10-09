import { Grid, List, ListItem, Typography } from '@material-ui/core';
import Button from 'components/Button';
import LoadingScreen from 'components/LoadingScreen';
import Paper from 'components/Paper';
import TextField from 'components/TextField';
import { useSetOriginalGroups, useSetParticipants } from 'context/EventContext';
import { Failure, Initial, Loading } from 'lemons';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { generateGroups } from 'utils/axios';
import Table from 'views/Filter/components/Table';

export type FilterProps = { title: string };

type findParticipantType = { id: string };

function Filter({ title }: FilterProps) {
  const [participants] = useSetParticipants();
  const [, setOriginGroups] = useSetOriginalGroups();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [joinedParticipants, setJoinedParticipants] = React.useState<any>([]);

  const { errors, handleSubmit, control, getValues } = useForm();

  const history = useHistory();
  const { eventId }: { eventId: string } = useParams();
  const SocketURL = `${process.env.REACT_APP_SOCKET_URL}/connect/${eventId}?access_token=token`;
  const { lastMessage } = useWebSocket(SocketURL);
  // eslint-disable-next-line new-cap
  const [submitFormLazy, setSubmitFormLazy] = React.useState(Initial());

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
      minimumPerGroup: formData.minimumPerGroup,
      maximumPerGroup: formData.maximumPerGroup,
    };
    // eslint-disable-next-line new-cap
    setSubmitFormLazy(Loading());
    generateGroups(data)
      .then((response) => {
        setOriginGroups(response.data);
        history.push(`/${eventId}/present`);
      })
      .catch((err) => {
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
          <LoadingScreen message={'Genererer grupper...'} />
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
                    error={errors.minimumPerGroup}
                    id='filter_minimumPerGroup'
                    label='Min per gruppe'
                    name='minimumPerGroup'
                    required='Påkrevd'
                    rules={{
                      min: {
                        value: 1,
                        message: 'Må være større enn 0',
                      },
                    }}
                  />
                  <FilterItems
                    control={control}
                    error={errors.maximumPerGroup}
                    id='filter_maximumPerGroup'
                    label='Max per gruppe'
                    name='maximumPerGroup'
                    required='Påkrevd'
                    rules={{
                      min: {
                        value: 1,
                        message: 'Må være større enn 0',
                      },
                      validate: (value: number) => value >= getValues('minimumPerGroup') || 'Max må være større eller lik Min',
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
