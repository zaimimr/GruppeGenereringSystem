import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { ItemTypes } from 'utils/constants';
export type PersonCardProps = {
  id: number;
  name: string;
  groupNumber: number;
  // eslint-disable-next-line
  groups: any;
  // eslint-disable-next-line
  setGroups: any;
};

function PersonCard({ id, name, groupNumber, groups, setGroups }: PersonCardProps) {
  const fromGroupNumber = groupNumber;
  const [{ isDragging }, drag] = useDrag({
    item: { id, name, fromGroupNumber, type: ItemTypes.CARD },
    end: (item: { id: number; name: string; fromGroupNumber: number } | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        if (dropResult.toGroupNumber !== fromGroupNumber) {
          const copyOfGroup = [...groups];
          const groupWithoutRemovedUser = copyOfGroup[item.fromGroupNumber].filter((user: { id: number; name: string }) => user.id !== item.id);
          copyOfGroup[dropResult.toGroupNumber].push({ id: item.id, name: item.name });
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
            {name}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default PersonCard;
