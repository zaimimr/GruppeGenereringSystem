import * as React from 'react';
import { GroupType } from 'views/Invitation/Invitation';

type Context = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSetGroups: any;
};

const GroupsContext = React.createContext<Context>({
  // eslint-disable-next-line
  useSetGroups: [[], () => {}],
});

export const useSetGroups = () => React.useContext(GroupsContext).useSetGroups;

type Props = {
  children: React.ReactNode;
};

export function GroupProvider({ children }: Props) {
  const [groups, setGroups] = React.useState<GroupType[]>([]);

  const groupsContext = {
    useSetGroups: [groups, setGroups],
  };

  return <GroupsContext.Provider value={groupsContext}>{children}</GroupsContext.Provider>;
}
