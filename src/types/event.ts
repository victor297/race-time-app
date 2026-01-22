export interface IEventProps {
  id: string;
  title: string;
  eventDate: string;
  eventType: "Virtual" | "Physical" | "Hybrid";
  address: string;
  participants: number;
  cover: string;
}

export interface IEventParticipantProps {
  imageUri: string;
  name: string;
}

export interface IEventCategoriesProps {
  id: string;
  name: string;
}

export interface IEventFaqProps {
  question: string;
  answer: string;
}

export interface IEventDetailsProps extends IEventProps {
  descriptions: string;
  participantsList: IEventParticipantProps[];
  categories: IEventCategoriesProps[];
  faq: IEventFaqProps[];
  race: string; // HTML format
  images: string[];

  /** Creates a detailed event from a base event */
  copyFromBase(base: IEventProps): IEventDetailsProps;
}
