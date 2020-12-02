import { Box, Grid, Typography } from '@material-ui/core';
import Button from 'components/Button';
import LoadingScreen from 'components/LoadingScreen';
import Paper from 'components/Paper';
import { useSetCsvGroups, useSetOriginalGroups, useSetParticipants } from 'context/EventContext';
import useSnackbar from 'context/SnakbarContext';
import { Failure, Initial, Loading, Success } from 'lemons';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useHistory, useParams } from 'react-router-dom';
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
/**
 * PresentGroup
 * @category Views
 * @subcategory PresentGroup
 * @return {React.Component} <PresentGroup /> component
 * ""
 * @example
 *
 * return (
 *   <PresentGroup />
 * )
 */
function PresentGroup() {
  const [, setCsvGroups] = useSetCsvGroups();
  const [, setParticipants] = useSetParticipants();
  const [originalGroups, setOriginalGroups] = useSetOriginalGroups();

  // eslint-disable-next-line
  const [groups, setGroups] = React.useState<IPresentData['generatedGroups']>(cloneDeep(originalGroups?.generatedGroups));
  const history = useHistory();

  const { eventId }: { eventId: string } = useParams();

  const { showSnackbar } = useSnackbar();

  // eslint-disable-next-line new-cap
  const [submitFormLazy, setSubmitFormLazy] = React.useState(Initial());

  const onSubmit = () => {
    // eslint-disable-next-line new-cap
    setSubmitFormLazy(Loading());
    sendGroups({
      event: eventId,
      finalData: {
        isCriteria: originalGroups.isCriteria,
        generatedGroups: groups,
      },
    })
      .then((data) => {
        showSnackbar('success', 'Alle gruppene er nå sendt på mail til koordinator og deltagerne');
        // eslint-disable-next-line new-cap
        setSubmitFormLazy(Success(data));
        setCsvGroups([]);
        setParticipants([]);
        setOriginalGroups();
        history.push('/');
      })
      .catch((err) => {
        showSnackbar('error', err.response.data);
        // eslint-disable-next-line new-cap
        setSubmitFormLazy(Failure(err.response.data));
      });
  };

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
        Ferdig genererte grupper
      </Typography>
      <Typography>For å tilpasse gruppene kan du dra en deltager mellom gruppene.</Typography>
      <Typography gutterBottom>For å tilbakestille gruppene til slik de var, klikk på tilbakestill knappen</Typography>
      <Grid container direction={'row-reverse'} justify={'space-between'} spacing={4} xs={12}>
        <Grid container direction={'column'} item sm={4} spacing={4} xs={12}>
          <Grid item xs={12}>
            <Paper>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography color={originalGroups?.isCriteria ? 'textPrimary' : 'error'} gutterBottom variant='body1'>
                    {originalGroups?.isCriteria ? 'Kriterier oppfyllt' : 'Kriterier ikke oppfyllt'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth label='Godkjenn' onClick={() => onSubmit()} />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    label='Tilbakestill'
                    onClick={() => {
                      showSnackbar('success', 'Gruppene er tilbakestillt');
                      setGroups(cloneDeep(originalGroups?.generatedGroups));
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper>
              <Box display='flex' flexDirection='column'>
                <Typography variant='h2'>Filtere</Typography>
                {originalGroups?.filters.map((filter: IFilterField, index: number) => (
                  <React.Fragment key={index}>
                    <Typography variant='body1'>
                      {filter?.name || 'Generell'} min: {filter.minimum === 0 ? 'Ikke satt' : filter.minimum}
                    </Typography>
                    <Typography variant='body1'>
                      {filter?.name || 'Generell'} max: {filter.maximum === 0 ? 'Ikke satt' : filter.maximum}
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
