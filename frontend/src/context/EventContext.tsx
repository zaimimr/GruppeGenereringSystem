import * as React from 'react';
import { ICsvData, IParticipants, IPresentData } from 'utils/types';

/**
 * EventContext
 * @category Context
 * @property {ICsvData[]} useSetCsvGroups Global useState of CsvGroups
 * @property {IParticipants[]} useSetParticipants Global useState of participants in an event
 * @property {IPresentData} useSetOriginalGroups Global useState of generated groups
 * @property {Event[]} useEvents Global useState of active events
 * @return {object}
 */

type Context = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSetCsvGroups: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSetParticipants: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSetOriginalGroups: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEvents: any;
};

const EventContext = React.createContext<Context>({
  // eslint-disable-next-line
  useSetCsvGroups: [[], () => {}],
  // eslint-disable-next-line
  useSetParticipants: [[], () => {}],
  // eslint-disable-next-line
  useSetOriginalGroups: [[], () => {}],
  // eslint-disable-next-line
  useEvents: [[], () => {}],
});

export const useSetCsvGroups = () => React.useContext(EventContext).useSetCsvGroups;
export const useSetParticipants = () => React.useContext(EventContext).useSetParticipants;
export const useSetOriginalGroups = () => React.useContext(EventContext).useSetOriginalGroups;
export const useEvents = () => React.useContext(EventContext).useEvents;

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [csvGroups, setCsvGroups] = React.useState<ICsvData[]>([]);
  const [participants, setParticipants] = React.useState<IParticipants[]>([]);
  // eslint-disable-next-line
  const [originalGroups, setOriginalGroups] = React.useState<IPresentData>()
  const [events, setEvents] = React.useState<Event[]>();

  const eventContext = {
    useSetCsvGroups: [csvGroups, setCsvGroups],
    useSetParticipants: [participants, setParticipants],
    useSetOriginalGroups: [originalGroups, setOriginalGroups],
    useEvents: [events, setEvents],
  };

  return <EventContext.Provider value={eventContext}>{children}</EventContext.Provider>;
}
