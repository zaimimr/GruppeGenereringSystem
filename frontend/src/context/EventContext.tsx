import * as React from 'react';
import { ICsvData, IParticipants, IPresentData } from 'utils/types';
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

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [csvGroups, setCsvGroups] = React.useState<ICsvData[]>([]);
  const [participants, setParticipants] = React.useState<IParticipants[]>([]);
  // eslint-disable-next-line
  const [originalGroups, setOriginalGroups] = React.useState<IPresentData>()
  const eventContext = {
    useSetCsvGroups: [csvGroups, setCsvGroups],
    useSetParticipants: [participants, setParticipants],
    useSetOriginalGroups: [originalGroups, setOriginalGroups],
  };

  return <EventContext.Provider value={eventContext}>{children}</EventContext.Provider>;
}
