export type IParticipants = {
  id: string;
  name: string;
  email: string;
  group: string;
};

export type ICsvData = {
  groupName: string;
  csvIsHeader: boolean;
  csvNameField: string;
  csvEmailField: string;
  csvData: string[][];
};

export type IFilterField = {
  group?: string;
  key: 'minimum' | 'maximum';
  value: number;
};

export type IFilterData = {
  participants: IParticipants[];
  minimumPerGroup: number;
  maximumPerGroup: number;
  filters?: IFilterField[];
};

export type IPresentData = {
  isCriteria: boolean;
  generatedGroups: IParticipants[][];
};

export type IApprovedGroupsData = {
  event: string;
  coordinatorEmail: string;
  finalData: IPresentData;
};
