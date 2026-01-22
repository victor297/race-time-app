export interface RaceResultDto {
  event: {
    title: string;
    imageUrl: string;
    target: number; // Example: 42.195
    id: string;
    eventLocation: string;
    eventDate: string;
    eventEndDate: string;
    category: RaceResultCategoryDto;
    categories: RaceResultCategoryDto[];
  };
  stats: {
    distanceKm: number;
    pace: number;
    noOfRuns: number;
  };
}

export interface RaceResultCategoryDto {
  title: string;
  target: number;
  slots: number;
  id: string;
}
export interface ScoreBoardDto {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    gender: string;
    profileUri: string;
    email: string;
    bibNumber: string;
    isMyResult: boolean;
  };

  category: {
    id: string;
    title: string;
    target: number;
  };

  stats: {
    distanceKm: number;
    pace: number;
    completed: boolean;
  };

  rankings: {
    overall: number;
    category: number;
    gender: number;
  };

  time: {
    finishTime: string; // ISO timestamp
    completionTime: string; // Human-readable duration
  };
}

export interface RaceResultLeaderboardDto {
  scoreboard: ScoreBoardDto[];
  event: {
    id: string;
    title: string;
  };
}
