import * as React from 'react';
import { GroupType } from 'views/Invitation/Invitation';

type Context = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSetCsvGroups: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSetParticipants: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSetOriginalGroups: any;
};

const EventContext = React.createContext<Context>({
  // eslint-disable-next-line
  useSetCsvGroups: [[], () => {}],
  // eslint-disable-next-line
  useSetParticipants: [[], () => {}],
  // eslint-disable-next-line
  useSetOriginalGroups: [[], () => {}],
});

export const useSetCsvGroups = () => React.useContext(EventContext).useSetCsvGroups;
export const useSetParticipants = () => React.useContext(EventContext).useSetParticipants;
export const useSetOriginalGroups = () => React.useContext(EventContext).useSetOriginalGroups;

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
  const [csvGroups, setCsvGroups] = React.useState<GroupType[]>([]);
  const [participants, setParticipants] = React.useState<IParticipants[]>([]);
  // eslint-disable-next-line
  const [originalGroups, setOriginalGroups] = React.useState<any>([]);

  const eventContext = {
    useSetCsvGroups: [csvGroups, setCsvGroups],
    useSetParticipants: [participants, setParticipants],
    useSetOriginalGroups: [originalGroups, setOriginalGroups],
  };

  return <EventContext.Provider value={eventContext}>{children}</EventContext.Provider>;
}
