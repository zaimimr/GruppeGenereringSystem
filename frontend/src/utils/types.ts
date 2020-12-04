/**
 * IParticipants
 * @category Types
 * @alias IParticipants
 * @typedef {object} IParticipants
 * @property {string} id Participant id
 * @property {string} name Participant name
 * @property {string} email Participant email
 * @property {string} group Participant group
 */
export type IParticipants = {
  id: string;
  name: string;
  email: string;
  group: string;
};
/**
 * ICsvData
 * @category Types
 * @alias ICsvData
 * @typedef {object} ICsvData
 * @property {string} groupName Name of group
 * @property {boolean} csvIsHeader Does csv have headers
 * @property {string} csvNameField What is the name field
 * @property {string} csvEmailField What is the email field
 * @property {string[][]} csvData CSV data
 */
export type ICsvData = {
  groupName: string;
  csvIsHeader: boolean;
  csvNameField: string;
  csvEmailField: string;
  csvData: string[][];
};
/**
 * IFilterField
 * @category Types
 * @alias IFilterField
 * @typedef {object} IFilterField
 * @property {string} [name] Name of filter
 * @property {number} minimum Minimum filter
 * @property {number} maximum Maximum filter
 */
export type IFilterField = {
  name?: string;
  minimum: number;
  maximum: number;
};
/**
 * IFilterData
 * @category Types
 * @alias IFilterData
 * @typedef {object} IFilterData
 * @property {IParticipants[]} participants List with participants
 * @property {IFilterField[]} filters List of filters
 */
export type IFilterData = {
  participants: IParticipants[];
  filters: IFilterField[];
};
/**
 * IPresentData
 * @category Types
 * @alias IPresentData
 * @typedef {object} IPresentData
 * @property {boolean} isCriteria Is all criteria fullfilled
 * @property {IParticipants[][]} generatedGroups List with groups
 * @property {IFilterField[]} [filters] List of filters
 */
export type IPresentData = {
  isCriteria: boolean;
  generatedGroups: IParticipants[][];
  filters?: IFilterField[];
};
/**
 * IApprovedGroupsData
 * @category Types
 * @alias IApprovedGroupsData
 * @typedef {object} IApprovedGroupsData
 * @property {string} event Event id
 * @property {IPresentData} finalData Approved groups with filters
 */
export type IApprovedGroupsData = {
  event: string;
  finalData: IPresentData;
};
/**
 * IEventData
 * @category Types
 * @alias IEventData
 * @typedef {object} IEventData
 * @property {string} title Event title
 * @property {string} ingress Event ingress
 * @property {string} [place] Event location
 * @property {string} date Event date
 * @property {string} time Event time
 * @property {string} [description] Event description
 * @property {IFilterField[]} filters Event general filters
 */
export type IEventData = {
  title: string;
  ingress: string;
  place?: string;
  date: string;
  time: string;
  description?: string;
  filters: IFilterField[];
};
/**
 * ILoginCredentials
 * @category Types
 * @alias ILoginCredentials
 * @typedef {object} ILoginCredentials
 * @property {string} email User email
 * @property {string} password User password
 */
export type ILoginCredentials = {
  email: string;
  password: string;
};
/**
 * IUser
 * @category Types
 * @alias IUser
 * @typedef {object} IUser
 * @property {string} id User id
 * @property {string} email User email
 * @property {string} name User name
 */
export type IUser = {
  id: string;
  email: string;
  name: string;
};
/**
 * SignUpData
 * @category Types
 * @alias SignUpData
 * @typedef {object} SignUpData
 * @property {string} name Registration name
 * @property {string} email Registration email
 * @property {string} password Registration password
 */
export type SignUpData = {
  name: string;
  email: string;
  password: string;
};
/**
 * IEvent
 * @category Types
 * @alias IEvent
 * @typedef {object} IEvent
 * @property {string} id Event id
 * @property {string} title Event title
 * @property {string} ingress Event ingress
 * @property {string} place Event location
 * @property {string} date Event date
 * @property {string} time Event time
 * @property {string} description Event description
 * @property {number} minimumPerGroup Event minimum general filter
 * @property {number} maximumPerGroup Event maximum general filter
 * @property {string} dateCreated Event created at
 * @property {string} createdBy Event host
 */
export type IEvent = {
  id: string;
  title: string;
  ingress: string;
  place: string;
  time: string;
  description: string;
  minimumPerGroup: number;
  maximumPerGroup: number;
  dateCreated: string;
  createdBy: string;
};
/**
 * CreateEventData
 * @category Types
 * @alias CreateEventData
 * @typedef {object} CreateEventData
 * @property {string} title Event title
 * @property {string} ingress Event ingress
 * @property {string} place Event location
 * @property {string} time Event time
 * @property {string} description Event description
 * @property {number} minimumPerGroup Event minimum general filter
 * @property {number} maximumPerGroup Event maximum general filter
 */
export type CreateEventData = {
  title: string;
  ingress: string;
  place: string;
  time: string;
  description: string;
  minimumPerGroup: number;
  maximumPerGroup: number;
};
