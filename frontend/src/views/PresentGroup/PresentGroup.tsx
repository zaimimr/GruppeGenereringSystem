import { Box, Grid, Typography } from '@material-ui/core';
import Button from 'components/Button';
import LoadingScreen from 'components/LoadingScreen';
import Paper from 'components/Paper';
import TextField from 'components/TextField';
import { useSetOriginalGroups } from 'context/EventContext';
import { Failure, Initial, Loading, Success } from 'lemons';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { sendGroups } from 'utils/axios';
import GroupCard from 'views/PresentGroup/components/GroupCard';

export type ParticipantType = {
  id: number;
  name: string;
};

export type GroupFilterType = {
  minimumPerGroup: number;
  maximumPerGroup: number;
};

type PresentGroupsProps = {
  title: string;
};

function PresentGroup({ title }: PresentGroupsProps) {
  const [originalGroups] = useSetOriginalGroups();
  // TODO
  // Get this information from Context
  const [groupFilter] = React.useState<GroupFilterType>({
    minimumPerGroup: 2,
    maximumPerGroup: 3,
  });
  // eslint-disable-next-line
  const [groups, setGroups] = React.useState<any>(originalGroups.groups);

  const { errors, handleSubmit, control } = useForm();

  const { eventId }: { eventId: string } = useParams();

  // eslint-disable-next-line new-cap
  const [submitFormLazy, setSubmitFormLazy] = React.useState(Initial());

  const onSubmit = handleSubmit((formData) => {
    // eslint-disable-next-line new-cap
    setSubmitFormLazy(Loading());
    sendGroups({
      event: eventId,
      emailCoordinator: formData.koordinator_email,
      groups: groups,
    })
      .then((data) => {
        // eslint-disable-next-line
        console.log(data);
        // eslint-disable-next-line new-cap
        setSubmitFormLazy(Success(data));
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.error(err.response);
        // eslint-disable-next-line new-cap
        setSubmitFormLazy(Failure(err.response.statusText));
      });
  });

  return (
    <>
      {submitFormLazy.dispatch(
        () => null,
        () => (
          <LoadingScreen message={'Sender ut eposter...'} />
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
      <Typography gutterBottom variant='h1'>
        {title}
      </Typography>
      <Grid container spacing={4}>
        <Grid container item spacing={4} xs={8}>
          <DndProvider backend={HTML5Backend}>
            {/* eslint-disable-next-line */}
            {groups?.map((group: any, index: number) => {
              return (
                <Grid item key={index} sm={4} xs={12}>
                  <GroupCard groupNumber={index} groups={groups} participants={group} setGroups={setGroups} />
                </Grid>
              );
            })}
          </DndProvider>
        </Grid>
        <Grid container item spacing={4} xs={4}>
          <Grid item>
            <Paper>
              <form autoComplete='off' noValidate onSubmit={onSubmit}>
                <Grid container item spacing={4}>
                  <Grid item xs={12}>
                    <Typography color={originalGroups.criteriaSucceed ? 'textPrimary' : 'error'} gutterBottom variant='body1'>
                      {originalGroups.criteriaSucceed ? 'Kriterier oppfyllt' : 'Kriterier ikke oppfyllt'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth label='Godkjenn' onClick={() => null} type='submit' />
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth label='Tilbakestill' onClick={() => setGroups(originalGroups.groups)} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      control={control}
                      error={errors.koordinator_email}
                      id={'koordinator_email_text_field'}
                      label={'Din E-post'}
                      name={'koordinator_email'}
                      required='Påkrevd'
                      rules={{
                        // eslint-disable-next-line
                        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      }}
                    />
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper>
              <Box display='flex' flexDirection='column'>
                <Typography variant='h2'>Filtere</Typography>
                <Typography variant='body1'>Min per gruppe : {groupFilter.minimumPerGroup}</Typography>
                <Typography variant='body1'>Max per gruppe : {groupFilter.maximumPerGroup}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default PresentGroup;
