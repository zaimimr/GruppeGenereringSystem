import { Box, Grid, Typography } from '@material-ui/core';
import Button from 'components/Button';
import LoadingScreen from 'components/LoadingScreen';
import Paper from 'components/Paper';
import TextField from 'components/TextField';
import { useSetOriginalGroups } from 'context/EventContext';
import { Failure, Initial, Loading, Success } from 'lemons';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { sendGroups } from 'utils/axios';
import { IPresentData } from 'utils/types';
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
  const [groups, setGroups] = React.useState<IPresentData['generatedGroups']>(cloneDeep(originalGroups.generatedGroups));

  const { errors, handleSubmit, control } = useForm();

  const { eventId }: { eventId: string } = useParams();

  // eslint-disable-next-line new-cap
  const [submitFormLazy, setSubmitFormLazy] = React.useState(Initial());

  const onSubmit = handleSubmit((formData) => {
    // eslint-disable-next-line new-cap
    setSubmitFormLazy(Loading());
    sendGroups({
      event: eventId,
      coordinatorEmail: formData.koordinator_email,
      finalData: {
        isCriteria: originalGroups.isCriteria,
        generatedGroups: groups,
      },
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
        () => (
          <div>
            <Typography variant='h1'>Gruppen er sendt</Typography>
          </div>
        ),
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
                    <Typography color={originalGroups.isCriteria ? 'textPrimary' : 'error'} gutterBottom variant='body1'>
                      {originalGroups.isCriteria ? 'Kriterier oppfyllt' : 'Kriterier ikke oppfyllt'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth label='Godkjenn' onClick={() => null} type='submit' />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      label='Tilbakestill'
                      onClick={() => {
                        setGroups(cloneDeep(originalGroups.generatedGroups));
                      }}
                    />
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
