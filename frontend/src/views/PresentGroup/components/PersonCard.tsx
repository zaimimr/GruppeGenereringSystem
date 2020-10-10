import { Grid, Typography } from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { ItemTypes } from 'utils/constants';
import { IParticipants } from 'utils/types';
export type PersonCardProps = {
  participant: IParticipants;
  groupNumber: number;
  // eslint-disable-next-line
  groups: any;
  // eslint-disable-next-line
  setGroups: any;
};

function PersonCard({ participant, groupNumber, groups, setGroups }: PersonCardProps) {
  const fromGroupNumber = groupNumber;
  const [{ isDragging }, drag] = useDrag({
    item: { participant, fromGroupNumber, type: ItemTypes.CARD },
    end: (item: { participant: IParticipants; fromGroupNumber: number } | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        if (dropResult.toGroupNumber !== fromGroupNumber) {
          const copyOfGroup = cloneDeep(groups);
          const groupWithoutRemovedUser = copyOfGroup[item.fromGroupNumber].filter((user: IParticipants) => user.id !== item.participant.id);
          copyOfGroup[dropResult.toGroupNumber].push({
            id: item.participant.id,
            name: item.participant.name,
            email: item.participant.email,
            group: item.participant.group,
          });
          copyOfGroup[item.fromGroupNumber] = groupWithoutRemovedUser;
          setGroups(copyOfGroup);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: Boolean(monitor.isDragging()),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'pointer' }}>
      <Grid container>
        <Grid item xs={12}>
          <Typography noWrap variant='subtitle1'>
            {participant.name}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default PersonCard;
