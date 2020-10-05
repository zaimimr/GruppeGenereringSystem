import { IParticipants } from 'context/EventContext';
export type IGroupInformation = {
  participants: IParticipants;
  minimumPerGroup: number;
  maximumPerGroup: number;
};
