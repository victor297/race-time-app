// export interface RaceResultDto {
//   id: string;
//   name: string;
//   bibNumber: string;
//   time: string; // HH:MM:SS format
//   distanceKm: number;
//   pace: string; // MM:SS/KM format
//   category: string;
//   gender: "Male" | "Female" | string;
//   overallRank: number;
//   genderRank: number;
//   categoryRank: number;
// }

import { RaceResultDto } from "./dto";

export interface RaceEventSummary {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  date: string; // ISO date string
}

export interface AthleteResultDetails {
  event: RaceEventSummary;
}

export interface CertificateForm {
  firstName: string;
  lastName: string;
  bib: string;
  eventName: string;
  eventLocation: string;
}
