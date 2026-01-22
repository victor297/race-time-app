export interface ActivityUserDto {
  _id: string;
  firstName: string;
  lastName: string;
  profileUri: string | null;
}

export interface ActivityDto {
  _id: string;
  user: ActivityUserDto;
  title: string;
  description: string;
  imageUri: string | null;
  type:
    | "event_created"
    | "payment_success"
    | "registration_completed"
    | "profile_updated"
    | "achievement_unlocked"
    | "feed_post"
    | "other"
    | string;
  public: boolean;
  createdAt: string;
  updatedAt: string;
}
