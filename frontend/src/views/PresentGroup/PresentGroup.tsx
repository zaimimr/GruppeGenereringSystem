import { Box, Grid, Typography } from '@material-ui/core';
import Button from 'components/Button';
import LoadingScreen from 'components/LoadingScreen';
import Paper from 'components/Paper';
import TextField from 'components/TextField';
import { useSetOriginalGroups } from 'context/EventContext';
import useSnackbar from 'context/SnakbarContext';
import { Failure, Initial, Loading, Success } from 'lemons';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { sendGroups } from 'utils/axios';
import { IFilterField, IPresentData } from 'utils/types';
import { IParticipants } from 'utils/types';
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

  // eslint-disable-next-line
  const [groups, setGroups] = React.useState<IPresentData['generatedGroups']>(cloneDeep(originalGroups.generatedGroups));

  const { errors, handleSubmit, control } = useForm();

  const { eventId }: { eventId: string } = useParams();

  const { showSnackbar } = useSnackbar();

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
        showSnackbar('success', 'Alle gruppene er nå sendt på mail til koordinator og deltagerne');
        // eslint-disable-next-line new-cap
        setSubmitFormLazy(Success(data));
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.error(err.response);
        showSnackbar('error', err.response.data);
        // eslint-disable-next-line new-cap
        setSubmitFormLazy(Failure(err.response.data));
      });
  });

  return (
    <>
      {submitFormLazy.dispatch(
        () => null,
        () => (
          <LoadingScreen message={'Sender ut eposter...'} />
        ),
        () => null,
        () => null,
      )}
      <Typography gutterBottom variant='h1'>
        {title}
      </Typography>
      <Grid container direction={'row-reverse'} justify={'space-between'} spacing={4} xs={12}>
        <Grid container direction={'column'} item sm={4} spacing={4} xs={12}>
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
                        showSnackbar('success', 'Gruppene er tilbakestillt');
                        setGroups(cloneDeep(originalGroups.generatedGroups));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      control={control}
                      error={errors.koordinator_email}
                      fullWidth
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
                {originalGroups.filters.map((filter: IFilterField, index: number) => (
                  <React.Fragment key={index}>
                    <Typography variant='body1'>
                      {filter?.name || 'Generell'} min: {filter.minimum}
                    </Typography>
                    <Typography variant='body1'>
                      {filter?.name || 'Generell'} max: {filter.maximum}
                    </Typography>
                  </React.Fragment>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Grid container item sm={8} spacing={4} xs={12}>
          <DndProvider backend={HTML5Backend}>
            {groups?.map((group: IParticipants[], index: number) => {
              return (
                <Grid item key={index} md={4} sm={6} xs={12}>
                  <GroupCard groupNumber={index} groups={groups} participants={group} setGroups={setGroups} />
                </Grid>
              );
            })}
          </DndProvider>
        </Grid>
      </Grid>
    </>
  );
}

export default PresentGroup;
