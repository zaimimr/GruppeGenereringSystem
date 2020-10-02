import * as React from 'react';
import { GroupType } from 'views/Invitation/Invitation';

type Context = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSetGroups: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSetParticipants: any;
};

const EventContext = React.createContext<Context>({
  // eslint-disable-next-line
  useSetGroups: [[], () => {}],
  // eslint-disable-next-line
  useSetParticipants: [[], () => {}],
});

export const useSetGroups = () => React.useContext(EventContext).useSetGroups;
export const useSetParticipants = () => React.useContext(EventContext).useSetParticipants;

type Props = {
  children: React.ReactNode;
};

export type IParticipants = {
  id: string;
  name: string;
  email: string;
  group: string;
  gender?: string;
};
export function EventProvider({ children }: Props) {
  const [groups, setGroups] = React.useState<GroupType[]>([]);

  const [participants, setParticipants] = React.useState<IParticipants[]>([
    { id: 'vhrwpa', name: 'Zaim Imran', email: 'Zaim@mail.com', group: 'DataIng', gender: 'Mann' },
    { id: 'bfnaod', name: 'Max Schau', email: 'Max@mail.com', group: 'DataIng', gender: 'Mann' },
    { id: 'hfwweh', name: 'Ola Normann', email: 'Ola@mail.com', group: 'DigFor', gender: 'Mann' },
    { id: 'h3qbba', name: 'Kari Traa', email: 'Kari@mail.com', group: 'Freestyle', gender: 'Kvinne' },
  ]);

  const eventContext = {
    useSetGroups: [groups, setGroups],
    useSetParticipants: [participants, setParticipants],
  };

  return <EventContext.Provider value={eventContext}>{children}</EventContext.Provider>;
}
