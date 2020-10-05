import { Box, Grid, Typography } from '@material-ui/core';
import Button from 'components/Button';
import Paper from 'components/Paper';
import { useSetGroups } from 'context/PresentGroupContext';
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import GroupCard from './components/GroupCard';

export type ParticipantType = {
  id: number;
  name: string;
};

export type GroupFilterType = {
  minimumPerGroup: number;
  maximumPerGroup: number;
};

type PresentGroupsProps = {
  titleOfEvent: string;
};

function PresentGroup({ titleOfEvent }: PresentGroupsProps) {
  const [criteriaSucceed] = useState<boolean>(false);
  const { groups, originalGroups, setGroups } = useSetGroups();
  const [groupFilter] = useState<GroupFilterType>({
    minimumPerGroup: 2,
    maximumPerGroup: 3,
  });

  return (
    <>
      <Typography gutterBottom variant='h1'>
        {titleOfEvent}
      </Typography>
      <Grid container spacing={4}>
        <DndProvider backend={HTML5Backend}>
          <Grid item xs={9}>
            <Grid container spacing={4}>
              {groups.map((group: ParticipantType[], index: number) => {
                return (
                  <Grid item key={index} sm={4} spacing={4} xs={12}>
                    <GroupCard groupNumber={index} participants={group} />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </DndProvider>
        <Grid item xs={3}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper>
                <Box display='grid' gridGap='8px'>
                  <Typography color={criteriaSucceed ? 'textPrimary' : 'error'} gutterBottom variant='body1'>
                    {criteriaSucceed ? 'Kriterier oppfyllt' : 'Kriterier ikke oppfyllt'}
                  </Typography>
                  <Button label='Godkjenn grupper' onClick={() => null} />
                  <Button label='Tilbakestill grupper' onClick={() => setGroups(originalGroups)} />
                </Box>
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
      </Grid>
    </>
  );
}

export default PresentGroup;
