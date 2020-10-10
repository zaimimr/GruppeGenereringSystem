import { Typography } from '@material-ui/core';
import Paper from 'components/Paper';
import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from 'utils/constants';
import { IParticipants } from 'utils/types';
import PersonCard from 'views/PresentGroup/components/PersonCard';

export type GroupCardProps = {
  groupNumber: number;
  participants: IParticipants[];
  groups: IParticipants[][];
  // eslint-disable-next-line
  setGroups: any;
};

function GroupCard({ groupNumber, participants, groups, setGroups }: GroupCardProps) {
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: () => ({ toGroupNumber: groupNumber }),
  });
  return (
    <Paper>
      <div ref={drop}>
        <Typography gutterBottom variant='h2'>
          Gruppe {groupNumber + 1} ({groups[groupNumber].length})
        </Typography>
        {participants?.map((participant: IParticipants, index: number) => {
          return <PersonCard groupNumber={groupNumber} groups={groups} key={index} participant={participant} setGroups={setGroups} />;
        })}
      </div>
    </Paper>
  );
}

export default GroupCard;
