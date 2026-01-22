export interface FeedDto {
  _id: string;
  id: string;
  caption: string;
  location: string;
  postImageUri?: string | null;
  postedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileUri: string | null;
  };
  postOnProfile: boolean;
  result?: number | null;
  unit?: "KM" | "M" | "Mile" | "d" | "s" | "m" | "yrs" | null;
  date?: string | null; // ISO date string (YYYY-MM-DD)
  likesCount: number;
  isLiked: boolean;
  isOwner: boolean;
  createdAt: string; // ISO datetime string
}
export type FeedListDto = FeedDto[];
