import * as React from 'react';

type PresentGroupContext = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groups: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalGroups: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setGroups: any;
};

type ParticipantType = {
  id: number;
  name: string;
};

const PresentGroupContext = React.createContext<PresentGroupContext>({
  // TODO
  // get these groups from backend
  groups: [],
  originalGroups: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setGroups: () => {},
});

export const useSetGroups = () => React.useContext(PresentGroupContext);

type Props = {
  children: React.ReactNode;
};

export function PresentGroupProvider({ children }: Props) {
  const [groups, setGroups] = React.useState<ParticipantType[][]>([
    [
      { id: 1, name: 'Max T. Schau' },
      { id: 2, name: 'Sara Hjelle' },
      { id: 3, name: 'Zaim Imran' },
    ],
    [
      { id: 4, name: 'Tomas Holt' },
      { id: 5, name: 'Sander Holt' },
      { id: 6, name: 'Simon Årdal' },
      { id: 7, name: 'Michael Jackson Michael Jackson Michael Jackson Michael Jackson' },
    ],
    [
      { id: 1, name: 'Max T. Schau' },
      { id: 2, name: 'Sara Hjelle' },
      { id: 3, name: 'Zaim Imran' },
    ],
    [
      { id: 4, name: 'Tomas Holt' },
      { id: 5, name: 'Sander Holt' },
      { id: 6, name: 'Simon Årdal' },
      { id: 7, name: 'Michael Jackson' },
    ],
  ]);
  const originalGroups = [
    [
      { id: 1, name: 'Max T. Schau' },
      { id: 2, name: 'Sara Hjelle' },
      { id: 3, name: 'Zaim Imran' },
    ],
    [
      { id: 4, name: 'Tomas Holt' },
      { id: 5, name: 'Sander Holt' },
      { id: 6, name: 'Simon Årdal' },
      { id: 7, name: 'Michael Jackson Michael Jackson Michael Jackson Michael Jackson' },
    ],
    [
      { id: 1, name: 'Max T. Schau' },
      { id: 2, name: 'Sara Hjelle' },
      { id: 3, name: 'Zaim Imran' },
    ],
    [
      { id: 4, name: 'Tomas Holt' },
      { id: 5, name: 'Sander Holt' },
      { id: 6, name: 'Simon Årdal' },
      { id: 7, name: 'Michael Jackson' },
    ],
  ];

  const context = {
    groups,
    originalGroups,
    setGroups,
  };

  return <PresentGroupContext.Provider value={context}>{children}</PresentGroupContext.Provider>;
}
