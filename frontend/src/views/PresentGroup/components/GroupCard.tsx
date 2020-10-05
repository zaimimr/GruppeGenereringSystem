import { Typography } from '@material-ui/core';
import Paper from 'components/Paper';
import { useSetGroups } from 'context/PresentGroupContext';
import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from 'utils/constants';

import PersonCard from './PersonCard';

export type GroupCardProps = {
  groupNumber: number;
  participants: { id: number; name: string }[];
};

function GroupCard({ groupNumber, participants }: GroupCardProps) {
  const { groups } = useSetGroups();

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
        {participants.map((participant, index) => {
          return <PersonCard groupNumber={groupNumber} id={participant.id} key={index} name={participant.name} />;
        })}
      </div>
    </Paper>
  );
}

export default GroupCard;
